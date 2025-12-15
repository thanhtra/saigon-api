import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsOrder } from 'typeorm';
import { Amenity } from './entities/amenitie.entity';


@Injectable()
export class AmenitiesRepository {
    constructor(
        @InjectRepository(Amenity)
        private readonly repo: Repository<Amenity>,
    ) { }

    async create(dto: Partial<Amenity>): Promise<Amenity> {
        const entity = this.repo.create(dto);
        return this.repo.save(entity);
    }

    async update(id: string, dto: Partial<Amenity>): Promise<Amenity | null> {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity) return null;
        return this.repo.save(this.repo.merge(entity, dto));
    }

    async remove(id: string): Promise<boolean> {
        const { affected } = await this.repo.delete(id);
        return affected === 1;
    }

    async findOne(id: string): Promise<Amenity | null> {
        return this.repo.findOne({ where: { id } });
    }

    async findAll(orderBy?: FindOptionsOrder<Amenity>): Promise<Amenity[]> {
        return this.repo.find({ order: orderBy });
    }
}
