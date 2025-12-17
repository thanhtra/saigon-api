import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsOrder } from 'typeorm';
import { Room } from './entities/rooms.entity';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { getSkip } from 'src/common/helpers/utils';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsRepository {
    constructor(
        @InjectRepository(Room)
        private readonly repo: Repository<Room>,
    ) { }

    // ---------------- CREATE ----------------
    async create(dto: CreateRoomDto): Promise<Room> {
        const room = this.repo.create(dto);
        return this.repo.save(room);
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
