import { Injectable } from '@nestjs/common';
import { CollaboratorsRepository } from './collaborators.repository';
import { Collaborator } from './entities/collaborator.entity';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { UpdateCollaboratorDto } from './dto/update-collaborator.dto';
import { QueryCollaboratorDto } from './dto/query-collaborator.dto';
import { DataRes, PageDto } from 'src/common/dtos/respones.dto';
import { Enums } from 'src/common/dtos/enum.dto';
import { CollaboratorType, FieldCooperation, UserRole } from 'src/common/helpers/enum';
import { ErrorMes } from 'src/common/helpers/errorMessage';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class CollaboratorsService {
  constructor(private readonly repo: CollaboratorsRepository,
    private readonly userRepo: UsersRepository

  ) { }

  // ---------- CREATE ----------

  async create(
    dto: CreateCollaboratorDto,
  ): Promise<DataRes<Collaborator>> {
    const user = await this.userRepo.findOneUser(dto.user_id);
    if (!user) {
      return DataRes.failed(ErrorMes.USER_GET_DETAIL);
    }

    const existed = await this.repo.findByUserId(dto.user_id);
    if (existed) {
      return DataRes.failed(ErrorMes.COLLABORATOR_EXISTED);
    }

    const collType: CollaboratorType =
      user.role === UserRole.Owner
        ? CollaboratorType.Owner
        : CollaboratorType.Broker;

    const entity = await this.repo.saveCollaborator({
      user_id: dto.user_id,
      type: collType,
      field_cooperation: dto.field_cooperation,
      active: dto.active ?? true,
    });

    return entity
      ? DataRes.success(entity)
      : DataRes.failed(ErrorMes.COLLABORATOR_CREATE);
  }

  // ---------- GET ONE ----------
  async getOne(id: string): Promise<DataRes<Collaborator>> {
    const entity = await this.repo.findOneCollaborator(id);
    return entity
      ? DataRes.success(entity)
      : DataRes.failed(ErrorMes.COLLABORATOR_GET_DETAIL);
  }

  // ---------- PAGINATED LIST ----------
  async getPaginated(query: QueryCollaboratorDto): Promise<DataRes<PageDto<Collaborator>>> {
    const page = await this.repo.getCollaborators(query);
    return DataRes.success(page);
  }

  // ---------- UPDATE ----------
  async update(id: string, dto: UpdateCollaboratorDto): Promise<DataRes<Collaborator>> {
    const entity = await this.repo.updateCollaborator(id, dto);
    return entity
      ? DataRes.success(entity)
      : DataRes.failed(ErrorMes.COLLABORATOR_UPDATE);
  }

  // ---------- DELETE ----------
  async remove(id: string): Promise<DataRes<null>> {
    const removed = await this.repo.removeCollaborator(id);
    return removed
      ? DataRes.success(null)
      : DataRes.failed(ErrorMes.COLLABORATOR_REMOVE);
  }
}
