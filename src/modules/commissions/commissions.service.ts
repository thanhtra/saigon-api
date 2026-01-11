import { Injectable } from '@nestjs/common';
import { CommissionsRepository } from './commissions.repository';
import { Commission } from './entities/commission.entity';
import { CreateCommissionDto } from './dto/create-commission.dto';
import { UpdateCommissionDto } from './dto/update-commission.dto';
import { DataRes, PageDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { ErrorMes } from 'src/common/helpers/errorMessage';

@Injectable()
export class CommissionsService {
  constructor(private readonly repo: CommissionsRepository) { }

  // ---------- CREATE ----------
  async create(dto: CreateCommissionDto): Promise<DataRes<Commission>> {
    const entity = await this.repo.createCommission(dto);
    return entity
      ? DataRes.success(entity)
      : DataRes.failed(ErrorMes.COMMISSION_CREATE);
  }

  // ---------- GET ONE ----------
  async getOne(id: string): Promise<DataRes<Commission>> {
    const entity = await this.repo.findOneCommission(id);
    return entity
      ? DataRes.success(entity)
      : DataRes.failed(ErrorMes.COMMISSION_GET_DETAIL);
  }

  // ---------- LIST / PAGINATION ----------
  async getAll(pageOptionsDto: PageOptionsDto): Promise<DataRes<PageDto<Commission>>> {
    const page = await this.repo.getAll(pageOptionsDto);
    return DataRes.success(page);
  }

  // ---------- UPDATE ----------
  async update(id: string, dto: UpdateCommissionDto): Promise<DataRes<Commission>> {
    const entity = await this.repo.updateCommission(id, dto);
    return entity
      ? DataRes.success(entity)
      : DataRes.failed(ErrorMes.COMMISSION_UPDATE);
  }

  // ---------- DELETE ----------
  async remove(id: string): Promise<DataRes<{ id: string }>> {
    const removed = await this.repo.removeCommission(id);
    return removed
      ? DataRes.success({ id })
      : DataRes.failed(ErrorMes.COMMISSION_REMOVE);
  }

  // ---------- FILTER BY CONTRACT ----------
  async getByContract(contractId: string): Promise<DataRes<Commission[]>> {
    const entities = await this.repo.findByContract(contractId);
    return DataRes.success(entities);
  }

  // ---------- FILTER BY SALE ----------
  async getBySale(saleId: string): Promise<DataRes<Commission[]>> {
    const entities = await this.repo.findBySale(saleId);
    return DataRes.success(entities);
  }

  // ---------- FILTER BY COLLABORATOR ----------
  // async getByCollaborator(collaboratorId: string): Promise<DataRes<Commission[]>> {
  //   const entities = await this.repo.findByCollaborator(collaboratorId);
  //   return DataRes.success(entities);
  // }
}
