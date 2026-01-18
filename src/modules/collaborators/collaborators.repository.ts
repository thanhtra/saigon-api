import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto, PageMetaDto } from 'src/common/dtos/respones.dto';
import { getSkip } from 'src/common/helpers/utils';
import { Repository } from 'typeorm';
import { QueryCollaboratorDto } from './dto/query-collaborator.dto';
import { Collaborator } from './entities/collaborator.entity';
import { CollaboratorType, FieldCooperation } from 'src/common/helpers/enum';

@Injectable()
export class CollaboratorsRepository {
  constructor(
    @InjectRepository(Collaborator)
    private readonly repo: Repository<Collaborator>,
  ) { }


  async getCollaborators(
    query: QueryCollaboratorDto,
  ): Promise<PageDto<Collaborator>> {

    const qb = this.repo
      .createQueryBuilder('collaborator')
      .leftJoin('collaborator.user', 'user')
      .addSelect([
        'user.id',
        'user.name',
        'user.phone',
        'user.email',
        'user.note',
      ])

    if (query.key_search) {
      qb.andWhere(
        '(user.name ILIKE :q OR user.phone ILIKE :q OR user.email ILIKE :q)',
        { q: `%${query.key_search}%` },
      );
    }

    if (query.field_cooperation) {
      qb.andWhere(
        'collaborator.field_cooperation = :field',
        { field: query.field_cooperation },
      );
    }

    if (typeof query.active === 'boolean') {
      qb.andWhere('collaborator.active = :active', {
        active: query.active,
      });
    }

    qb.orderBy('collaborator.createdAt', query.order)
      .skip(getSkip(query.page, query.size))
      .take(Math.min(query.size, 50));

    const [entities, itemCount] = await qb.getManyAndCount();

    return new PageDto(
      entities,
      new PageMetaDto({ itemCount, pageOptionsDto: query }),
    );
  }

  async findByUserId(userId: string): Promise<Collaborator | null> {
    if (!userId) return null;

    return this.repo.findOne({
      where: { user_id: userId },
    });
  }

  async saveCollaborator(
    dto: Partial<Collaborator>,
  ): Promise<Collaborator> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async findOneCollaborator(id: string): Promise<Collaborator | null> {
    return this.repo
      .createQueryBuilder('c')
      .leftJoin('c.user', 'user')
      .select([
        'c.id',
        'c.user_id',
        'c.type',
        'c.field_cooperation',
        'c.active',
        'c.note',

        'user.id',
        'user.name',
        'user.phone',
      ])
      .where('c.id = :id', { id })
      .getOne();
  }

  async updateCollaborator(id: string, dto: Partial<Collaborator>): Promise<Collaborator | null> {
    const collaborator = await this.repo.findOne({
      where: { id },
    });
    if (!collaborator) return null;

    const updated = this.repo.merge(collaborator, dto);
    return this.repo.save(updated);
  }

  async removeCollaborator(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected === 1;
  }

  async getAvailableCollaborators(
    type?: CollaboratorType,
    field_cooperation?: FieldCooperation,
  ): Promise<{ id: string; name: string; phone: string }[]> {
    const qb = this.repo
      .createQueryBuilder('collaborator')
      .leftJoin('collaborator.user', 'user')
      .select([
        'collaborator.id AS id',
        'user.name AS name',
        'user.phone AS phone',
      ])
      .where('collaborator.active = :collabActive', { collabActive: true })
      .andWhere('collaborator.is_blacklisted = false')
      .andWhere('user.active = true');

    if (type) {
      qb.andWhere('collaborator.type = :type', { type });
    }

    if (field_cooperation) {
      qb.andWhere('collaborator.field_cooperation = :field', { field: field_cooperation });
    }

    qb.orderBy('user.name', 'ASC');

    return qb.getRawMany();
  }





}
