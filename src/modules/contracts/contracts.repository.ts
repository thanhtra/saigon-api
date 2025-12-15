import { Injectable } from '@nestjs/common';
import { Repository, FindOptionsOrder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Contract } from './entities/contract.entity';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { getSkip } from 'src/common/helpers/utils';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@Injectable()
export class ContractsRepository {
    constructor(
        @InjectRepository(Contract)
        private readonly repo: Repository<Contract>,
    ) { }

    // ---------------- CREATE ----------------
    async create(dto: CreateContractDto): Promise<Contract> {
        const contract = this.repo.create(dto);
        return this.repo.save(contract);
    }

    // ---------------- UPDATE ----------------
    async update(id: string, dto: UpdateContractDto): Promise<Contract | null> {
        const contract = await this.repo.findOne({ where: { id } });
        if (!contract) return null;
        return this.repo.save(this.repo.merge(contract, dto));
    }

    // ---------------- DELETE ----------------
    async remove(id: string): Promise<boolean> {
        const { affected } = await this.repo.delete(id);
        return affected === 1;
    }

    // ---------------- GET ONE ----------------
    async findOne(id: string): Promise<Contract | null> {
        return this.repo.findOne({ where: { id }, relations: ['rental', 'room', 'tenant', 'commission'] });
    }

    // ---------------- LIST + PAGINATION ----------------
    async findAll(pageOptions: PageOptionsDto): Promise<PageDto<Contract>> {
        const qb = this.repo.createQueryBuilder('contract')
            .leftJoinAndSelect('contract.rental', 'rental')
            .leftJoinAndSelect('contract.room', 'room')
            .leftJoinAndSelect('contract.tenant', 'tenant')
            .leftJoinAndSelect('contract.commission', 'commission')
            .orderBy('contract.createdAt', pageOptions.order)
            .skip(getSkip(pageOptions.page, pageOptions.size))
            .take(Math.min(pageOptions.size, 50));

        if (pageOptions.keySearch) {
            qb.andWhere('tenant.name LIKE :q OR rental.title LIKE :q', { q: `%${pageOptions.keySearch}%` });
        }

        const [entities, itemCount] = await qb.getManyAndCount();
        return new PageDto(entities, new PageMetaDto({ itemCount, pageOptionsDto: pageOptions }));
    }

    // ---------------- FILTER ----------------
    async findByFilter(
        filters: Partial<Contract>,
        orderBy?: { column: string; order: 'ASC' | 'DESC' },
    ): Promise<Contract[]> {
        const qb = this.repo.createQueryBuilder('contract')
            .leftJoinAndSelect('contract.rental', 'rental')
            .leftJoinAndSelect('contract.room', 'room')
            .leftJoinAndSelect('contract.tenant', 'tenant')
            .leftJoinAndSelect('contract.commission', 'commission');

        Object.entries(filters).forEach(([key, value]) => {
            qb.andWhere(`contract.${key} = :${key}`, { [key]: value });
        });

        if (orderBy) {
            qb.orderBy(orderBy.column, orderBy.order);
        }

        return qb.getMany();
    }


    // ---------------- FILTER BY TENANT ----------------
    async findByTenant(tenantId: string): Promise<Contract[]> {
        return this.repo.find({ where: { tenant: { id: tenantId } }, relations: ['rental', 'room', 'tenant', 'commission'] });
    }

    // ---------------- FILTER BY RENTAL ----------------
    async findByRental(rentalId: string): Promise<Contract[]> {
        return this.repo.find({ where: { rental: { id: rentalId } }, relations: ['rental', 'room', 'tenant', 'commission'] });
    }

    // ---------------- FILTER BY ROOM ----------------
    async findByRoom(roomId: string): Promise<Contract[]> {
        return this.repo.find({ where: { room: { id: roomId } }, relations: ['rental', 'room', 'tenant', 'commission'] });
    }
}
