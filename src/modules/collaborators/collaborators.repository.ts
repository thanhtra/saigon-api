import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collaborator } from './entities/collaborator.entity';
import { QueryCollaboratorDto } from './dto/query-collaborator.dto';
import { PageDto, PageMetaDto } from 'src/common/dtos/respones.dto';
import { getSkip } from 'src/common/helpers/utils';

@Injectable()
export class CollaboratorsRepository {
  constructor(
    @InjectRepository(Collaborator)
    private readonly repo: Repository<Collaborator>,
  ) { }

  // ---------- CREATE ----------
  async saveCollaborator(
    dto: Partial<Collaborator>,
  ): Promise<Collaborator> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async findByUserId(userId: string): Promise<Collaborator | null> {
    return this.repo.findOne({
      where: { user_id: userId },
    });
  }




  // ---------- FIND ONE ----------
  async findOneCollaborator(id: string): Promise<Collaborator | null> {
    return this.repo
      .createQueryBuilder('c')
      .leftJoin('c.user', 'user')
      .select([
        // Collaborator fields
        'c.id',
        'c.user_id',
        'c.field_cooperation',
        'c.active',
        'c.note',

        // User fields (CHỈ LẤY CẦN THIẾT)
        'user.id',
        'user.name',
        'user.phone',
      ])
      .where('c.id = :id', { id })
      .getOne();
  }




  // ---------- LIST WITH FILTER + PAGINATION ----------
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
      ])

    // 🔍 Search
    if (query.keySearch) {
      qb.andWhere(
        '(user.name ILIKE :q OR user.phone ILIKE :q OR user.email ILIKE :q)',
        { q: `%${query.keySearch}%` },
      );
    }

    // 🎯 Filter field cooperation
    if (query.field_cooperation) {
      qb.andWhere(
        'collaborator.field_cooperation = :field',
        { field: query.field_cooperation },
      );
    }

    // 📌 Active
    if (typeof query.active === 'boolean') {
      qb.andWhere('collaborator.active = :active', {
        active: query.active,
      });
    }

    // 📄 Pagination
    qb.orderBy('collaborator.createdAt', query.order)
      .skip((query.page - 1) * query.size)
      .take(query.size);

    const [entities, itemCount] = await qb.getManyAndCount();

    return new PageDto(
      entities,
      new PageMetaDto({ itemCount, pageOptionsDto: query }),
    );
  }

  // ---------- UPDATE ----------
  async updateCollaborator(id: string, dto: Partial<Collaborator>): Promise<Collaborator | null> {
    const collaborator = await this.findOneCollaborator(id);
    if (!collaborator) return null;

    const updated = this.repo.merge(collaborator, dto);
    return this.repo.save(updated);
  }

  // ---------- DELETE ----------
  async removeCollaborator(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected === 1;
  }
}
