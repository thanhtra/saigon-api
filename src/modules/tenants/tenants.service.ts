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
    // tenants.service.ts
    // async create(dto: CreateTenantDto) {
    //       const user = await this.usersService.create({
    //         name: dto.name,
    //         phone: dto.phone,
    //         email: dto.email,
    //         cccd: dto.cccd,
    //         password: dto.password,
    //         role: UserRole.Tenant,
    //       });

    //       const tenant = this.tenantRepo.create({
    //         user,
    //         note: dto.note,
    //       });

    //       return this.tenantRepo.save(tenant);
    //     }


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

}
