import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { ACREAGE_LEVEL_MAP, PRICE_LEVEL_MAP } from 'src/common/helpers/constants';
import { RoomStatus } from 'src/common/helpers/enum';
import { getSkip } from 'src/common/helpers/utils';
import { DataSource, Repository } from 'typeorm';
import { QueryRoomPublicDto } from './dto/query-room-public.dto';
import { Room } from './entities/rooms.entity';

@Injectable()
export class RoomsRepository {
    constructor(
        @InjectRepository(Room)
        private readonly repo: Repository<Room>,
        private readonly dataSource: DataSource
    ) { }


    // ---------------- LIST + PAGINATION ----------------
    async findAll(pageOptions: PageOptionsDto): Promise<PageDto<Room>> {
        const qb = this.repo.createQueryBuilder('room')
            .orderBy('room.createdAt', pageOptions.order)
            .skip(getSkip(pageOptions.page, pageOptions.size))
            .take(Math.min(pageOptions.size, 50));

        if (pageOptions.key_search) {
            qb.andWhere('room.room_code LIKE :q OR room.price::text LIKE :q', { q: `%${pageOptions.key_search}%` });
        }

        const [entities, itemCount] = await qb.getManyAndCount();
        return new PageDto(entities, new PageMetaDto({ itemCount, pageOptionsDto: pageOptions }));
    }

    // ---------------- GET ONE ----------------
    async findOne(id: string): Promise<Room | null> {
        return this.repo.findOne({ where: { id } });
    }

    // ---------------- CUSTOMER ----------------
    async findByRental(rental_id: string): Promise<Room[]> {
        return this.repo.find({ where: { rental_id } });
    }

    // ---------------- PUBLIC ----------------

    async findPublicRoomBySlug(slug: string): Promise<Room | null> {
        return await this.repo
            .createQueryBuilder('room')
            .leftJoinAndSelect('room.uploads', 'upload')
            .leftJoinAndSelect('room.rental', 'rental')

            /* ===== CONDITION ===== */
            .where('room.slug = :slug', { slug })
            .andWhere('room.active = true')
            .andWhere('room.status = :status', {
                status: RoomStatus.Available,
            })
            .andWhere('rental.active = true')

            /* ===== ORDER UPLOAD ===== */
            .orderBy('upload.createdAt', 'ASC')

            /* ===== SELECT TỐI ƯU ===== */
            .addSelect([
                'rental.id',
                'rental.province',
                'rental.district',
                'rental.ward',
                'rental.address_detail_display',
            ])

            .getOne();
    }

    async findPublicRooms(
        query: QueryRoomPublicDto,
    ): Promise<PageDto<Room>> {
        const qb = this.repo
            .createQueryBuilder('room')
            .leftJoinAndSelect('room.uploads', 'upload')
            .leftJoin('room.rental', 'rental')

            /* ===== BASE CONDITION ===== */
            .where('room.active = true')
            .andWhere('room.status = :status', {
                status: RoomStatus.Available,
            })
            .andWhere('rental.active = true')

            /* ===== SELECT OPTIMIZE ===== */
            .addSelect([
                'rental.id',
                'rental.province',
                'rental.district',
                'rental.ward',
                'rental.address_detail_display',
                'rental.rental_type'
            ])

            .orderBy('room.createdAt', query.order)
            .skip(getSkip(query.page, query.size))
            .take(Math.min(query.size, 50));

        /* ================= SEARCH ================= */
        if (query.keyword) {
            qb.andWhere(
                `(room.title ILIKE :q OR rental.address_detail_display ILIKE :q)`,
                { q: `%${query.keyword}%` },
            );
        }

        /* ================= LOCATION ================= */
        if (query.province) {
            qb.andWhere('rental.province = :province', {
                province: query.province,
            });
        }

        if (query.district) {
            qb.andWhere('rental.district = :district', {
                district: query.district,
            });
        }

        if (query.ward) {
            qb.andWhere('rental.ward = :ward', {
                ward: query.ward,
            });
        }

        /* ================= RENTAL TYPE ================= */
        if (query.rental_type?.length) {
            qb.andWhere('rental.rental_type IN (:...types)', {
                types: query.rental_type,
            });
        }

        /* ================= PRICE LEVEL ================= */
        if (query.price_level) {
            const range = PRICE_LEVEL_MAP[query.price_level];
            if (range?.min !== null)
                qb.andWhere('room.price >= :minPrice', { minPrice: range.min });
            if (range?.max !== null)
                qb.andWhere('room.price <= :maxPrice', { maxPrice: range.max });
        }

        /* ================= ACREAGE LEVEL ================= */
        if (query.acreage_level) {
            const range = ACREAGE_LEVEL_MAP[query.acreage_level];

            if (range) {
                qb.andWhere(
                    `
                    (
                        room.area IS NULL
                        OR (
                            (:minArea IS NULL OR room.area >= :minArea)
                            AND (:maxArea IS NULL OR room.area <= :maxArea)
                        )
                    )
                    `,
                    {
                        minArea: range.min ?? null,
                        maxArea: range.max ?? null,
                    },
                );
            }
        }

        /* ================= AMENITIES ================= */
        if (query.amenities?.length) {
            qb.andWhere(
                'room.amenities @> ARRAY[:...amenities]::text[]',
                {
                    amenities: query.amenities,
                },
            );
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
