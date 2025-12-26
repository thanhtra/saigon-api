import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsOrder, DataSource, In } from 'typeorm';
import { Room } from './entities/rooms.entity';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { generateRoomCode, getSkip, slugifyVN } from 'src/common/helpers/utils';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomStatus } from 'src/common/helpers/enum';
import { Upload } from '../uploads/entities/upload.entity';

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
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const room = queryRunner.manager.create(Room, {
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
                cover_index: dto.cover_index ?? 0,
            });

            await queryRunner.manager.save(room);

            /* ===== HANDLE UPLOAD ===== */
            if (dto.upload_ids?.length) {
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

    // ---------------- UPDATE ----------------
    async update(id: string, dto: UpdateRoomDto): Promise<Room | null> {
        const room = await this.repo.findOne({ where: { id } });
        if (!room) return null;

        return this.repo.save(this.repo.merge(room, dto));
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

        if (pageOptions.keySearch) {
            qb.andWhere('room.room_code LIKE :q OR room.price::text LIKE :q', { q: `%${pageOptions.keySearch}%` });
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

    // ---------------- FILTER ----------------
    // async findByFilter(filters: Partial<Room>, orderBy?: FindOptionsOrder<Room>): Promise<Room[]> {
    //     return this.repo.find({
    //         where: filters,
    //         ...(orderBy && { order: orderBy }),
    //     });
    // }
}
