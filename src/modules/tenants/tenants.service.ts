import { Injectable } from '@nestjs/common';
import {
  DataRes,
  PageDto,
  PageOptionsDto,
} from 'src/common/dtos/respones.dto';
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

  /* ================= CREATE ================= */

  async create(
    dto: CreateTenantDto,
  ): Promise<DataRes<Tenant>> {
    try {
      const tenant =
        await this.tenantsRepository.createTenant(dto);

      return DataRes.success(tenant);
    } catch (error) {
      return DataRes.failed(
        error?.message || ErrorMes.TENANT_CREATE,
      );
    }
  }

  /* ================= DETAIL ================= */

  async getTenant(
    id: string,
  ): Promise<DataRes<Tenant>> {
    try {
      const tenant =
        await this.tenantsRepository.findOneTenant(id);

      if (!tenant) {
        return DataRes.failed(
          ErrorMes.TENANT_GET_DETAIL,
        );
      }

      return DataRes.success(tenant);
    } catch (error) {
      return DataRes.failed(
        error?.message || ErrorMes.TENANT_GET_DETAIL,
      );
    }
  }

  /* ================= LIST ================= */

  async getTenants(
    pageOptionsDto: PageOptionsDto,
  ): Promise<DataRes<PageDto<Tenant>>> {
    try {
      const tenants =
        await this.tenantsRepository.getTenants(
          pageOptionsDto,
        );

      return DataRes.success(tenants);
    } catch (error) {
      return DataRes.failed(
        error?.message || ErrorMes.TENANT_GET_LIST,
      );
    }
  }

  /* ================= UPDATE ================= */

  async update(
    id: string,
    dto: UpdateTenantDto,
  ): Promise<DataRes<Tenant>> {
    try {
      const tenant =
        await this.tenantsRepository.updateTenant(
          id,
          dto,
        );

      if (!tenant) {
        return DataRes.failed(
          ErrorMes.TENANT_UPDATE,
        );
      }

      return DataRes.success(tenant);
    } catch (error) {
      return DataRes.failed(
        error?.message || ErrorMes.TENANT_UPDATE,
      );
    }
  }

  /* ================= DELETE ================= */

  async remove(
    id: string,
  ): Promise<DataRes<null>> {
    try {
      const removed =
        await this.tenantsRepository.removeTenant(id);

      if (!removed) {
        return DataRes.failed(
          ErrorMes.TENANT_REMOVE,
        );
      }

      return DataRes.success(null);
    } catch (error) {
      return DataRes.failed(
        error?.message || ErrorMes.TENANT_REMOVE,
      );
    }
  }
}
