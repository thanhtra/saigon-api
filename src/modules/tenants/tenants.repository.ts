import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PageDto, PageMetaDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { getSkip } from 'src/common/helpers/utils';

import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { Tenant } from './entities/tenant.entity';

@Injectable()
export class TenantsRepository {
  constructor(
    @InjectRepository(Tenant)
    private readonly repo: Repository<Tenant>,
  ) { }

  async createTenant(dto: CreateTenantDto): Promise<Tenant> {
    const tenant = this.repo.create(dto);
    return this.repo.save(tenant);
  }

  async findOneTenant(id: string): Promise<Tenant | null> {
    if (!id) return null;
    return this.repo.findOne({ where: { id } });
  }

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

    if (pageOptionsDto.key_search) {
      qb.andWhere(
        `(user.name ILIKE :q OR user.phone ILIKE :q)`,
        { q: `%${pageOptionsDto.key_search}%` },
      );
    }

    qb.orderBy('tenant.createdAt', pageOptionsDto.order)
      .skip(getSkip(pageOptionsDto.page, pageOptionsDto.size))
      .take(pageOptionsDto.size);

    qb.select([
      'tenant.id',
      'tenant.note',
      'tenant.createdAt',
      'tenant.active',

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

  async updateTenant(
    id: string,
    dto: UpdateTenantDto,
  ): Promise<Tenant | null> {
    const tenant = await this.findOneTenant(id);
    if (!tenant) return null;

    const updated = this.repo.merge(tenant, dto);
    return this.repo.save(updated);
  }

  async removeTenant(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected === 1;
  }
}
