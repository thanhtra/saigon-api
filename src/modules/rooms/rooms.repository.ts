import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto, PageMetaDto } from 'src/common/dtos/respones.dto';
import { ACREAGE_LEVEL_MAP, PRICE_LEVEL_MAP } from 'src/common/helpers/constants';
import { RentalStatus, RoomStatus } from 'src/common/helpers/enum';
import { getSkip } from 'src/common/helpers/utils';
import { Repository } from 'typeorm';
import { QueryMyRoomsDto } from './dto/query-my-rooms.dto';
import { QueryRoomPublicDto } from './dto/query-room-public.dto';
import { QueryRoomDto } from './dto/query-room.dto';
import { Room } from './entities/rooms.entity';

@Injectable()
export class RoomsRepository {
    constructor(
        @InjectRepository(Room)
        private readonly repo: Repository<Room>,
    ) { }

    // ---------------- CUSTOMER ----------------

    async findPublicRoomBySlug(slug: string): Promise<Room | null> {
        return await this.repo
            .createQueryBuilder('room')
            .leftJoin('room.uploads', 'upload')
            .leftJoin('room.rental', 'rental')

            .select([
                'room.id',
                'room.slug',
                'room.title',
                'room.room_code',
                'room.room_number',
                'room.price',
                'room.area',
                'room.updatedAt',
                'room.video_url',
                'room.floor',
                'room.amenities',
                'room.description',
                'room.deposit'
            ])

            .addSelect([
                'upload.id',
                'upload.file_path',
                'upload.createdAt',
                'upload.is_cover'
            ])

            .addSelect([
                'rental.id',
                'rental.rental_type',
                'rental.address_detail_display',
                'rental.fee_electric',
                'rental.fee_water',
                'rental.water_unit',
                'rental.fee_wifi',
                'rental.fee_parking',
                'rental.fee_service',
                'rental.fee_other'
            ])

            .where('room.slug = :slug', { slug })
            .andWhere('room.active = true')
            .andWhere('room.status = :status', { status: RoomStatus.Available })
            .andWhere('rental.active = true')

            .orderBy('upload.createdAt', 'ASC')

            .getOne();
    }



    async findPublicRooms(
        query: QueryRoomPublicDto,
    ): Promise<PageDto<Partial<any>>> {

        const qb = this.repo
            .createQueryBuilder('room')

            .innerJoin('room.rental', 'rental')
            .leftJoin('room.uploads', 'upload')

            .where('room.active = true')
            .andWhere('room.status = :roomStatus', {
                roomStatus: RoomStatus.Available,
            })
            .andWhere('rental.active = true')
            .andWhere('rental.status = :rentalStatus', {
                rentalStatus: RentalStatus.Confirmed,
            })

            .select([
                'room.id',
                'room.title',
                'room.slug',
                'room.price',
                'room.area',
                'room.createdAt',
                'room.amenities',
                'room.deposit',
                'room.floor',
                'room.max_people',
                'room.room_code',
                'room.room_number',
                'room.video_url'
            ])

            .addSelect([
                'upload.id',
                'upload.file_path',
                'upload.file_type',
                'upload.is_cover'
            ])

            .addSelect([
                'rental.id',
                'rental.address_detail_display',
                'rental.rental_type',
            ])

            .orderBy('room.createdAt', query.order)
            .skip(getSkip(query.page, query.size))
            .take(Math.min(query.size, 50));

        if (query.keyword?.trim()) {
            qb.andWhere(
                `(room.title ILIKE :q OR rental.address_detail_display ILIKE :q OR room.room_code ILIKE :q)`,
                { q: `%${query.keyword.trim()}%` },
            );
        }

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

        if (query.rental_type?.length) {
            qb.andWhere('rental.rental_type IN (:...types)', {
                types: query.rental_type,
            });
        }

        if (query.price_level) {
            const range = PRICE_LEVEL_MAP[query.price_level];

            if (range?.min !== null) {
                qb.andWhere('room.price >= :minPrice', {
                    minPrice: range.min,
                });
            }

            if (range?.max !== null) {
                qb.andWhere('room.price <= :maxPrice', {
                    maxPrice: range.max,
                });
            }
        }

        if (query.acreage_level) {
            const range = ACREAGE_LEVEL_MAP[query.acreage_level];

            if (range?.min != null) {
                qb.andWhere('room.area >= :minArea', {
                    minArea: range.min,
                });
            }

            if (range?.max != null) {
                qb.andWhere('room.area <= :maxArea', {
                    maxArea: range.max,
                });
            }
        }

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


    async getMyRooms(
        userId: string,
        query: QueryMyRoomsDto,
    ): Promise<PageDto<any>> {

        const { page, size, order, status, key_search } = query;

        const qb = this.repo
            .createQueryBuilder('room')

            .innerJoin('room.rental', 'rental')
            .innerJoin('rental.collaborator', 'collaborator')
            .innerJoin('collaborator.user', 'user')

            .leftJoin('room.uploads', 'upload')

            .select([
                'room.id',
                'room.title',
                'room.slug',
                'room.price',
                'room.area',
                'room.room_number',
                'room.room_code',
                'room.status',
                'room.createdAt',

                'rental.id',
                'rental.address_detail_display',
                'rental.rental_type',

                'upload.id',
                'upload.file_path',
                'upload.file_type',
                'upload.is_cover'
            ])

            .where('user.id = :userId', { userId })
            .andWhere('room.active = true')
            .andWhere('room.status != :disabledStatus', {
                disabledStatus: RoomStatus.Disabled,
            })
            .andWhere('collaborator.active = true')
            .andWhere('collaborator.is_blacklisted = false');

        if (status) {
            qb.andWhere('room.status = :status', { status });
        }

        if (key_search?.trim()) {
            qb.andWhere(
                `
                (
                    room.title ILIKE :q
                    OR room.room_code ILIKE :q
                    OR rental.address_detail_display ILIKE :q
                )
                `,
                { q: `%${key_search.trim()}%` },
            );
        }

        qb.orderBy('room.createdAt', order);

        qb.skip(getSkip(page, size))
            .take(Math.min(size, 50));

        const [entities, itemCount] = await qb.getManyAndCount();

        return new PageDto(
            entities,
            new PageMetaDto({ itemCount, pageOptionsDto: query }),
        );
    }


    // ---------------- ADMIN ----------------
    async getRooms(query: QueryRoomDto): Promise<PageDto<Room>> {
        const qb = this.repo
            .createQueryBuilder('room')
            .leftJoinAndSelect('room.rental', 'rental')
            .leftJoinAndSelect('rental.collaborator', 'collaborator')
            .leftJoinAndSelect('collaborator.user', 'collaborator_user')
            .leftJoinAndSelect('rental.createdBy', 'created_by_user') // 👈 NGƯỜI ĐĂNG
            .where('rental.active = true')
            .orderBy('room.createdAt', query.order)
            .skip(getSkip(query.page, query.size))
            .take(Math.min(query.size, 50));

        /* ===============================
           FILTER
        ================================ */

        // room.active
        if (query.active !== undefined) {
            qb.andWhere('room.active = :active', {
                active: query.active,
            });
        }

        // room.status
        if (query.status) {
            qb.andWhere('room.status = :status', {
                status: query.status,
            });
        }

        // rental_id
        if (query.rental_id) {
            qb.andWhere('room.rental_id = :rental_id', {
                rental_id: query.rental_id,
            });
        }

        // rental_type
        if (query.rental_type) {
            qb.andWhere('rental.rental_type = :rental_type', {
                rental_type: query.rental_type,
            });
        }

        /* ===============================
           SEARCH
        ================================ */

        if (query.key_search) {
            const q = `%${query.key_search.trim()}%`;

            qb.andWhere(
                `
                (
                    room.room_code ILIKE :q
                    OR room.price::text ILIKE :q
                    OR rental.address_detail ILIKE :q
                    OR created_by_user.phone ILIKE :q
                )
                `,
                { q },
            );
        }

        /* ===============================
           EXECUTE
        ================================ */

        const [entities, itemCount] = await qb.getManyAndCount();

        return new PageDto(
            entities,
            new PageMetaDto({
                itemCount,
                pageOptionsDto: query,
            }),
        );
    }


    async getOneAdmin(id: string): Promise<Room | null> {
        return this.repo
            .createQueryBuilder('room')
            .leftJoinAndSelect('room.uploads', 'upload')
            .leftJoinAndSelect('room.rental', 'rental')
            .where('room.id = :id', { id })
            .orderBy('upload.created_at', 'ASC')
            .getOne();
    }

    // async findByRental(rental_id: string): Promise<Room[]> {
    //     return this.repo.find({ where: { rental_id } });
    // }


}
