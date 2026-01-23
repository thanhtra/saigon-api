import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { BookingStatus } from 'src/common/helpers/enum';
import { getSkip } from 'src/common/helpers/utils';
import { Repository } from 'typeorm';
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
            .leftJoinAndSelect('room.uploads', 'uploads');

        /* ===== SEARCH ===== */
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

        /* ===== STATUS PRIORITY ===== */
        qb.addSelect(
            `
            CASE booking.status
                WHEN :pending THEN 1
                WHEN :confirmed THEN 2
                WHEN :completed THEN 3
                WHEN :noShow THEN 4
                WHEN :cancelled THEN 5
                ELSE 6
            END
            `,
            'status_priority',
        ).setParameters({
            pending: BookingStatus.Pending,
            confirmed: BookingStatus.Confirmed,
            completed: BookingStatus.Completed,
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


        /* ===== ORDER ===== */
        qb.orderBy('status_priority', 'ASC')
            .addOrderBy('viewing_distance', 'ASC', 'NULLS LAST')
            .addOrderBy('booking.updatedAt', 'DESC');

        /* ===== PAGINATION ===== */
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


}

