import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsOrder } from 'typeorm';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingsRepository {
    constructor(
        @InjectRepository(Booking)
        private readonly repo: Repository<Booking>,
    ) { }

    async create(dto: Partial<Booking>): Promise<Booking> {
        const entity = this.repo.create(dto);
        return this.repo.save(entity);
    }

    async update(id: string, dto: Partial<Booking>): Promise<Booking | null> {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity) return null;
        return this.repo.save(this.repo.merge(entity, dto));
    }

    async remove(id: string): Promise<boolean> {
        const { affected } = await this.repo.delete(id);
        return affected === 1;
    }

    async findOne(id: string): Promise<Booking | null> {
        return this.repo.findOne({
            where: { id },
            relations: ['room', 'guide'],
        });
    }

    async findAll(orderBy?: FindOptionsOrder<Booking>): Promise<Booking[]> {
        return this.repo.find({
            relations: ['room', 'guide'],
            order: orderBy,
        });
    }
}
