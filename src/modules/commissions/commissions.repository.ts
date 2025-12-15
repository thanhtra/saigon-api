import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Commission } from './entities/commission.entity';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { getSkip } from 'src/common/helpers/utils';

@Injectable()
export class CommissionsRepository {
    constructor(
        @InjectRepository(Commission)
        private readonly repo: Repository<Commission>,
    ) { }

    // ---------- CREATE ----------
    async createCommission(dto: Partial<Commission>): Promise<Commission> {
        const entity = this.repo.create(dto);
        return this.repo.save(entity);
    }

    // ---------- FIND ONE ----------
    async findOneCommission(id: string): Promise<Commission | null> {
        return this.repo.findOne({
            where: { id },
            relations: ['contract', 'sale', 'collaborator'],
        });
    }

    // ---------- LIST / PAGINATION ----------
    async getAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<Commission>> {
        const qb = this.repo.createQueryBuilder('commission')
            .leftJoinAndSelect('commission.contract', 'contract')
            .leftJoinAndSelect('commission.sale', 'sale')
            .leftJoinAndSelect('commission.collaborator', 'collaborator');

        qb.orderBy('commission.createdAt', pageOptionsDto.order)
            .skip(getSkip(pageOptionsDto.page, pageOptionsDto.size))
            .take(pageOptionsDto.size);

        const [entities, itemCount] = await qb.getManyAndCount();
        return new PageDto(entities, new PageMetaDto({ itemCount, pageOptionsDto }));
    }

    // ---------- UPDATE ----------
    async updateCommission(id: string, dto: Partial<Commission>): Promise<Commission | null> {
        const commission = await this.findOneCommission(id);
        if (!commission) return null;

        const updated = this.repo.merge(commission, dto);
        return this.repo.save(updated);
    }

    // ---------- DELETE ----------
    async removeCommission(id: string): Promise<boolean> {
        const result = await this.repo.delete(id);
        return result.affected === 1;
    }

    // ---------- FILTER BY CONTRACT ----------
    async findByContract(contractId: string): Promise<Commission[]> {
        return this.repo.find({
            where: { contract: { id: contractId } },
            relations: ['contract', 'sale', 'collaborator'],
        });
    }

    // ---------- FILTER BY SALE ----------
    async findBySale(saleId: string): Promise<Commission[]> {
        return this.repo.find({
            where: { sale: { id: saleId } },
            relations: ['contract', 'sale', 'collaborator'],
        });
    }

    // ---------- FILTER BY COLLABORATOR ----------
    async findByCollaborator(collaboratorId: string): Promise<Commission[]> {
        return this.repo.find({
            where: { collaborator: { id: collaboratorId } },
            relations: ['contract', 'sale', 'collaborator'],
        });
    }
}
