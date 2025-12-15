import { Injectable } from '@nestjs/common';
import { Enums } from 'src/common/dtos/enum.dto';
import { DataRes, PageDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { ErrorMes } from 'src/common/helpers/errorMessage';

import { TenantsRepository } from './tenants.repository';
import { Tenant } from './entities/tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(
    private readonly tenantsRepository: TenantsRepository,
  ) { }

  // ---------- CREATE ----------
  async create(dto: CreateTenantDto): Promise<DataRes<Tenant>> {
    const tenant = await this.tenantsRepository.createTenant(dto);
    return tenant
      ? DataRes.success(tenant)
      : DataRes.failed(ErrorMes.TENANT_CREATE);
  }

  // ---------- DETAIL ----------
  async getTenant(id: string): Promise<DataRes<Tenant>> {
    const tenant = await this.tenantsRepository.findOneTenant(id);
    return tenant
      ? DataRes.success(tenant)
      : DataRes.failed(ErrorMes.TENANT_GET_DETAIL);
  }

  // ---------- LIST ----------
  async getTenants(
    pageOptionsDto: PageOptionsDto,
  ): Promise<DataRes<PageDto<Tenant>>> {
    const tenants = await this.tenantsRepository.getTenants(pageOptionsDto);
    return DataRes.success(tenants);
  }

  // ---------- UPDATE ----------
  async update(
    id: string,
    dto: UpdateTenantDto,
  ): Promise<DataRes<Tenant>> {
    const tenant = await this.tenantsRepository.updateTenant(id, dto);
    return tenant
      ? DataRes.success(tenant)
      : DataRes.failed(ErrorMes.TENANT_UPDATE);
  }

  // ---------- DELETE ----------
  async remove(id: string): Promise<DataRes<null>> {
    const removed = await this.tenantsRepository.removeTenant(id);
    return removed
      ? DataRes.success(null)
      : DataRes.failed(ErrorMes.TENANT_REMOVE);
  }

  // ---------- ENUMS ----------
  getEnums(): DataRes<Enums[]> {
    const enums = Object.entries(CreateTenantDto.getEnums()).map(
      ([value, label]) => ({ value, label }),
    );

    return enums.length
      ? DataRes.success(enums)
      : DataRes.failed(ErrorMes.ENUMS_GET_ALL);
  }
}
