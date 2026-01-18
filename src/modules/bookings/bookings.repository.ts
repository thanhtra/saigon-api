import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { getSkip } from 'src/common/helpers/utils';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { BookingStatus } from 'src/common/helpers/enum';


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
                `(booking.customer_name ILIKE :q
              OR booking.customer_phone ILIKE :q
              OR booking.referrer_phone ILIKE :q)`,
                { q: `%${pageOptionsDto.key_search}%` },
            );
        }

        /* ===== 1. STATUS PRIORITY ===== */
        qb.addSelect(
            `
          CASE booking.status
            WHEN '${BookingStatus.Pending}' THEN 1
            WHEN '${BookingStatus.Confirmed}' THEN 2
            WHEN '${BookingStatus.Completed}' THEN 3
            WHEN '${BookingStatus.NoShow}' THEN 4
            WHEN '${BookingStatus.Cancelled}' THEN 5
            ELSE 6
          END
          `,
            'status_priority',
        );

        /* ===== 2. VIEWING TIME DISTANCE ===== */
        qb.addSelect(
            `
          CASE
            WHEN booking.status IN ('${BookingStatus.Pending}', '${BookingStatus.Confirmed}')
            THEN ABS(EXTRACT(EPOCH FROM (booking.viewing_at - NOW())))
            ELSE NULL
          END
          `,
            'viewing_distance',
        );

        /* ===== ORDER ===== */
        qb.orderBy('status_priority', 'ASC')
            .addOrderBy('viewing_distance', 'ASC')
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
}

