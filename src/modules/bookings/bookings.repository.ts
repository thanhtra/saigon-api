import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { BookingStatus, UploadDomain } from 'src/common/helpers/enum';
import { getSkip } from 'src/common/helpers/utils';
import { Repository } from 'typeorm';
import { QueryCTVBookingDto } from './dto/query-ctv-booking.dto';
import { QueryMyBookingDto } from './dto/query-my-booking.dto';
import { Booking } from './entities/booking.entity';


@Injectable()
export class BookingsRepository {
    constructor(
        @InjectRepository(Booking)
        private readonly repo: Repository<Booking>,
    ) { }

    async createBooking(
        dto: Partial<Booking>,
    ): Promise<Booking> {
        const booking = this.repo.create(dto);
        return this.repo.save(booking);
    }

    async findOneBooking(
        id: string,
    ): Promise<Booking | null> {
        if (!id) return null;

        return this.repo.findOne({
            where: { id },
            relations: ['room'],
        });
    }

    async getBookings(
        pageOptionsDto: PageOptionsDto,
    ): Promise<PageDto<Booking>> {
        const qb = this.repo
            .createQueryBuilder('booking')
            .leftJoinAndSelect('booking.room', 'room')
            .leftJoinAndSelect('room.uploads', 'uploads')

            .leftJoinAndSelect('room.ctv_collaborator', 'ctv')
            .leftJoinAndSelect('ctv.user', 'ctv_user');

        if (pageOptionsDto.key_search) {
            qb.andWhere(
                `
                booking.customer_name ILIKE :q
                OR booking.customer_phone ILIKE :q
                OR booking.referrer_phone ILIKE :q
                `,
                { q: `%${pageOptionsDto.key_search}%` },
            );
        }

        qb.addSelect(
            `
            CASE booking.status
                WHEN :pending THEN 1
                WHEN :confirmed THEN 2
                WHEN :completed THEN 3
                WHEN :deposited THEN 4
                WHEN :movedIn THEN 5
                WHEN :noShow THEN 6
                WHEN :cancelled THEN 7
                ELSE 8
            END
            `,
            'status_priority',
        ).setParameters({
            pending: BookingStatus.Pending,
            confirmed: BookingStatus.Confirmed,
            completed: BookingStatus.Completed,
            deposited: BookingStatus.Deposited,
            movedIn: BookingStatus.MovedIn,
            noShow: BookingStatus.NoShow,
            cancelled: BookingStatus.Cancelled,
        });

        qb.addSelect(
            `
            CASE
                WHEN booking.status IN (:...activeStatuses)
                THEN ABS(
                    EXTRACT(
                        EPOCH FROM (
                            booking.viewing_at::timestamp - NOW()
                        )
                    )
                )
                ELSE NULL
            END
            `,
            'viewing_distance',
        ).setParameters({
            activeStatuses: [
                BookingStatus.Pending,
                BookingStatus.Confirmed,
            ],
        });


        qb.orderBy('status_priority', 'ASC')
            .addOrderBy('viewing_distance', 'ASC', 'NULLS LAST')
            .addOrderBy('booking.updatedAt', 'DESC');

        qb.skip(getSkip(pageOptionsDto.page, pageOptionsDto.size))
            .take(pageOptionsDto.size);

        const [entities, itemCount] = await qb.getManyAndCount();

        return new PageDto(
            entities,
            new PageMetaDto({
                itemCount,
                pageOptionsDto,
            }),
        );
    }

    async updateBooking(
        id: string,
        dto: Partial<Booking>,
    ): Promise<Booking | null> {
        const booking = await this.findOneBooking(id);
        if (!booking) return null;

        const updated = this.repo.merge(booking, dto);
        return this.repo.save(updated);
    }

    async removeBooking(
        id: string,
    ): Promise<boolean> {
        const result = await this.repo.delete(id);
        return result.affected === 1;
    }

    async updateCommissionStatus(
        bookingId: string,
        isPaid: boolean,
    ): Promise<Booking> {
        await this.repo.update(
            { id: bookingId },
            { is_paid_commission: isPaid },
        );

        return this.findOneBooking(bookingId);
    }


    // CUSTOMER

    async getMyBookingsByPhone(
        phone: string,
        query: QueryMyBookingDto,
    ): Promise<PageDto<Booking>> {
        const qb = this.repo
            .createQueryBuilder('booking')
            .leftJoin('booking.room', 'room')
            .leftJoin('room.rental', 'rental')
            .select([
                'booking.id',
                'booking.status',
                'booking.viewing_at',
                'booking.createdAt',
                'booking.updatedAt',

                'room.id',
                'room.title',
                'room.price',
                'room.area',
                'room.room_number',
                'room.room_code',
                'room.slug',

                'rental.address_detail_display',
            ])
            .where('booking.customer_phone = :phone', { phone });

        if (query.status) {
            qb.andWhere('booking.status = :status', { status: query.status });
        }

        if (query.key_search) {
            qb.andWhere(
                `(booking.customer_name ILIKE :q OR booking.customer_phone ILIKE :q)`,
                { q: `%${query.key_search}%` },
            );
        }

        qb.orderBy('booking.viewing_at', query.order)
            .skip(getSkip(query.page, query.size))
            .take(query.size);

        const [entities, itemCount] = await qb.getManyAndCount();

        return new PageDto(
            entities,
            new PageMetaDto({
                itemCount,
                pageOptionsDto: query,
            }),
        );

    }

    async getBookingsByReferrerPhone(
        referrerPhone: string,
        query: QueryCTVBookingDto,
    ): Promise<PageDto<Booking>> {

        const qb = this.repo
            .createQueryBuilder('booking')
            .leftJoin('booking.room', 'room')
            .leftJoin('room.rental', 'rental')
            .leftJoin(
                'room.uploads',
                'upload',
                'upload.domain = :domain AND upload.is_cover = true',
                { domain: UploadDomain.Rooms },
            )
            .select([
                'booking.id',
                'booking.status',
                'booking.viewing_at',
                'booking.createdAt',
                'booking.updatedAt',
                'booking.customer_name',
                'booking.customer_phone',
                'booking.is_paid_commission',

                'room.id',
                'room.title',
                'room.price',
                'room.area',
                'room.room_number',
                'room.room_code',
                'room.slug',

                'rental.address_detail_display',

                'upload.id',
                'upload.file_path',
                'upload.is_cover',
            ])
            .where('booking.referrer_phone = :phone', {
                phone: referrerPhone,
            });

        if (query.status) {
            qb.andWhere('booking.status = :status', {
                status: query.status,
            });
        }

        if (query.is_paid_commission !== undefined) {
            qb.andWhere('booking.status = :movedIn', {
                movedIn: BookingStatus.MovedIn,
            });

            qb.andWhere(
                'booking.is_paid_commission = :isPaid',
                { isPaid: query.is_paid_commission },
            );
        }

        if (query.key_search) {
            qb.andWhere(
                `
                booking.customer_name ILIKE :q
                OR booking.customer_phone ILIKE :q
                `,
                { q: `%${query.key_search}%` },
            );
        }

        qb.orderBy('booking.viewing_at', query.order ?? 'DESC');

        if (query.is_pagin !== false) {
            qb.skip(getSkip(query.page, query.size))
                .take(query.size);
        }

        const [entities, itemCount] = await qb.getManyAndCount();

        return new PageDto(
            entities,
            new PageMetaDto({
                itemCount,
                pageOptionsDto: query,
            }),
        );
    }

}

