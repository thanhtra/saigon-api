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
    const qb = this.repo
      .createQueryBuilder('tenant')
      .leftJoinAndSelect('tenant.user', 'user')
      .leftJoin('tenant.contracts', 'contracts')
      .loadRelationCountAndMap(
        'tenant.contractCount',
        'tenant.contracts',
      );

    /* ========== SEARCH ========== */
    if (pageOptionsDto.key_search) {
      qb.andWhere(
        `(user.name ILIKE :q OR user.phone ILIKE :q)`,
        { q: `%${pageOptionsDto.key_search}%` },
      );
    }

    /* ========== SORT & PAGINATION ========== */
    qb.orderBy('tenant.createdAt', pageOptionsDto.order)
      .skip((pageOptionsDto.page - 1) * pageOptionsDto.size)
      .take(pageOptionsDto.size);

    /* ========== SELECT CHỈ FIELD CẦN ========== */
    qb.select([
      'tenant.id',
      'tenant.note',
      'tenant.createdAt',

      'user.id',
      'user.name',
      'user.phone',
      'user.link_facebook',
      'user.active',
    ]);

    const [entities, itemCount] = await qb.getManyAndCount();

    return new PageDto(
      entities,
      new PageMetaDto({
        itemCount,
        pageOptionsDto,
      }),
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
