import { Injectable } from '@nestjs/common';

import { CollaboratorsRepository } from './collaborators.repository';
import { Collaborator } from './entities/collaborator.entity';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { UpdateCollaboratorDto } from './dto/update-collaborator.dto';
import { QueryCollaboratorDto } from './dto/query-collaborator.dto';

import { DataRes, PageDto } from 'src/common/dtos/respones.dto';
import { CollaboratorType, UserRole } from 'src/common/helpers/enum';
import { ErrorMes } from 'src/common/helpers/errorMessage';

import { UsersRepository } from '../users/users.repository';

@Injectable()
export class CollaboratorsService {
  constructor(
    private readonly collaboratorsRepository: CollaboratorsRepository,
    private readonly usersRepository: UsersRepository,
  ) { }

  /* ================= CREATE ================= */

  async create(
    dto: CreateCollaboratorDto,
  ): Promise<DataRes<Collaborator>> {
    try {
      const user = await this.usersRepository.findOneUser(dto.user_id);
      if (!user) {
        return DataRes.failed(ErrorMes.USER_GET_DETAIL);
      }

      const existed =
        await this.collaboratorsRepository.findByUserId(dto.user_id);
      if (existed) {
        return DataRes.failed(ErrorMes.COLLABORATOR_EXISTED);
      }

      const type: CollaboratorType =
        user.role === UserRole.Owner
          ? CollaboratorType.Owner
          : CollaboratorType.Broker;

      const collaborator =
        await this.collaboratorsRepository.saveCollaborator({
          user_id: dto.user_id,
          type,
          field_cooperation: dto.field_cooperation,
          active: dto.active ?? true,
        });

      return DataRes.success(collaborator);
    } catch (error) {
      return DataRes.failed(
        error?.message || ErrorMes.COLLABORATOR_CREATE,
      );
    }
  }

  /* ================= DETAIL ================= */

  async getOne(
    id: string,
  ): Promise<DataRes<Collaborator>> {
    try {
      const collaborator =
        await this.collaboratorsRepository.findOneCollaborator(id);

      if (!collaborator) {
        return DataRes.failed(ErrorMes.COLLABORATOR_GET_DETAIL);
      }

      return DataRes.success(collaborator);
    } catch (error) {
      return DataRes.failed(
        error?.message || ErrorMes.COLLABORATOR_GET_DETAIL,
      );
    }
  }

  /* ================= LIST / PAGINATION ================= */

  async getPaginated(
    query: QueryCollaboratorDto,
  ): Promise<DataRes<PageDto<Collaborator>>> {
    try {
      const page =
        await this.collaboratorsRepository.getCollaborators(query);

      return DataRes.success(page);
    } catch (error) {
      return DataRes.failed(
        error?.message || ErrorMes.COLLABORATOR_GET_LIST,
      );
    }
  }

  /* ================= UPDATE ================= */

  async update(
    id: string,
    dto: UpdateCollaboratorDto,
  ): Promise<DataRes<Collaborator>> {
    try {
      const collaborator =
        await this.collaboratorsRepository.updateCollaborator(id, dto);

      if (!collaborator) {
        return DataRes.failed(ErrorMes.COLLABORATOR_UPDATE);
      }

      return DataRes.success(collaborator);
    } catch (error) {
      return DataRes.failed(
        error?.message || ErrorMes.COLLABORATOR_UPDATE,
      );
    }
  }

  /* ================= DELETE ================= */

  async remove(
    id: string,
  ): Promise<DataRes<null>> {
    try {
      const removed =
        await this.collaboratorsRepository.removeCollaborator(id);

      if (!removed) {
        return DataRes.failed(ErrorMes.COLLABORATOR_REMOVE);
      }

      return DataRes.success(null);
    } catch (error) {
      return DataRes.failed(
        error?.message || ErrorMes.COLLABORATOR_REMOVE,
      );
    }
  }
}
