import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PageDto, PageMetaDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { getSkip } from 'src/common/helpers/utils';

import { Tenant } from './entities/tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantsRepository {
  constructor(
    @InjectRepository(Tenant)
    private readonly repo: Repository<Tenant>,
  ) { }

  // ---------- CREATE ----------
  async createTenant(dto: CreateTenantDto): Promise<Tenant> {
    const tenant = this.repo.create(dto);
    return this.repo.save(tenant);
  }

  // ---------- FIND ONE ----------
  async findOneTenant(id: string): Promise<Tenant | null> {
    return this.repo.findOne({ where: { id } });
  }

  // ---------- LIST ----------
  async getTenants(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Tenant>> {
    const qb = this.repo.createQueryBuilder('tenant');

    qb.orderBy('tenant.createdAt', pageOptionsDto.order)
      .skip(getSkip(pageOptionsDto.page, pageOptionsDto.size))
      .take(pageOptionsDto.size);

    if (pageOptionsDto.keySearch) {
      qb.andWhere(
        '(tenant.name ILIKE :q OR tenant.phone ILIKE :q)',
        { q: `%${pageOptionsDto.keySearch}%` },
      );
    }

    const [entities, itemCount] = await qb.getManyAndCount();

    return new PageDto(
      entities,
      new PageMetaDto({ itemCount, pageOptionsDto }),
    );
  }

  // ---------- UPDATE ----------
  async updateTenant(
    id: string,
    dto: UpdateTenantDto,
  ): Promise<Tenant | null> {
    const tenant = await this.findOneTenant(id);
    if (!tenant) return null;

    const updated = this.repo.merge(tenant, dto);
    return this.repo.save(updated);
  }

  // ---------- DELETE ----------
  async removeTenant(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected === 1;
  }
}
