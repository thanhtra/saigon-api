import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { ACREAGE_LEVEL_MAP, PRICE_LEVEL_MAP } from 'src/common/helpers/constants';
import { RoomStatus } from 'src/common/helpers/enum';
import { generateRoomCode, getSkip, slugifyVN } from 'src/common/helpers/utils';
import { DataSource, In, Repository } from 'typeorm';
import { Upload } from '../uploads/entities/upload.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { QueryRoomPublicDto } from './dto/query-room-public.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/rooms.entity';

@Injectable()
export class RoomsRepository {
    constructor(
        @InjectRepository(Room)
        private readonly repo: Repository<Room>,
        private readonly dataSource: DataSource
    ) { }

    async create(
        dto: CreateRoomDto,
        user: any,
    ): Promise<Room> {
        const room = this.repo.create({
            rental_id: dto.rental_id,
            collaborator_id: dto.collaborator_id,
            created_by: user.id,

            title: dto.title,
            room_code: generateRoomCode(),
            slug: slugifyVN(`${dto.title}-${Date.now()}`),

            price: dto.price,
            status: dto.status ?? RoomStatus.Available,

            floor: dto.floor,
            room_number: dto.room_number,
            area: dto.area,
            max_people: dto.max_people,

            amenities: dto.amenities,
            description: dto.description,
            active: dto.active ?? true,
        });

        return await this.repo.save(room);
    }


    async update(id: string, dto: UpdateRoomDto): Promise<Room | null> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const room = await queryRunner.manager.findOne(Room, {
                where: { id },
            });

            if (!room) return null;

            /* ================= UPDATE ROOM ================= */

            queryRunner.manager.merge(Room, room, {
                title: dto.title,
                price: dto.price,
                area: dto.area,
                max_people: dto.max_people,
                status: dto.status,
                amenities: dto.amenities,
                description: dto.description,
                active: dto.active,
                cover_index: dto.cover_index,
            });

            await queryRunner.manager.save(room);

            /* ================= UPDATE UPLOADS ================= */

            if (dto.upload_ids?.length) {
                // reset uploads cũ (optional – rất nên)
                await queryRunner.manager.update(
                    Upload,
                    { room: { id } },
                    { room: null },
                );

                // gán uploads mới
                await queryRunner.manager.update(
                    Upload,
                    { id: In(dto.upload_ids) },
                    { room },
                );
            }

            await queryRunner.commitTransaction();
            return room;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    // ---------------- DELETE ----------------
    async remove(id: string): Promise<boolean> {
        const { affected } = await this.repo.delete(id);
        return affected === 1;
    }

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
