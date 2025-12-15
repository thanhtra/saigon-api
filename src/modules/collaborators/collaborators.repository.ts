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
  async createCollaborator(dto: Partial<Collaborator>): Promise<Collaborator> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  // ---------- FIND ONE ----------
  async findOneCollaborator(id: string): Promise<Collaborator | null> {
    return this.repo.findOne({ where: { id } });
  }

  // ---------- LIST WITH FILTER + PAGINATION ----------
  async getCollaborators(query: QueryCollaboratorDto): Promise<PageDto<Collaborator>> {
    const qb = this.repo.createQueryBuilder('collaborator');

    // Filter
    if (query.keySearch) {
      qb.andWhere('(collaborator.name ILIKE :q OR collaborator.phone ILIKE :q)', {
        q: `%${query.keySearch}%`,
      });
    }

    if (query.field_cooperation) {
      qb.andWhere('collaborator.field_cooperation = :field', {
        field: query.field_cooperation,
      });
    }

    if (typeof query.active === 'boolean') {
      qb.andWhere('collaborator.active = :active', { active: query.active });
    }

    // Pagination
    qb.orderBy('collaborator.createdAt', query.order)
      .skip(getSkip(query.page, query.size))
      .take(query.size);

    const [entities, itemCount] = await qb.getManyAndCount();

    return new PageDto(entities, new PageMetaDto({ itemCount, pageOptionsDto: query }));
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
