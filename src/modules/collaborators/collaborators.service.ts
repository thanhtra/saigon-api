import { Injectable } from '@nestjs/common';

import { CollaboratorsRepository } from './collaborators.repository';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { QueryCollaboratorDto } from './dto/query-collaborator.dto';
import { UpdateCollaboratorDto } from './dto/update-collaborator.dto';
import { Collaborator } from './entities/collaborator.entity';

import { DataRes, PageDto } from 'src/common/dtos/respones.dto';
import { CollaboratorType, UserRole } from 'src/common/helpers/enum';
import { ErrorMes } from 'src/common/helpers/errorMessage';

import { UsersRepository } from '../users/users.repository';
import { GetAvailableCollaboratorsDto } from './dto/get-available-collaborators.dto';

@Injectable()
export class CollaboratorsService {
  constructor(
    private readonly collaboratorsRepository: CollaboratorsRepository,
    private readonly usersRepository: UsersRepository,
  ) { }

  async getCollaborators(
    query: QueryCollaboratorDto,
  ): Promise<DataRes<PageDto<Collaborator>>> {
    try {
      const data = await this.collaboratorsRepository.getCollaborators(query);
      return DataRes.success(data);
    } catch (error) {
      return DataRes.failed(
        ErrorMes.COLLABORATOR_GET_LIST,
      );
    }
  }

  async create(
    dto: CreateCollaboratorDto,
  ): Promise<DataRes<Collaborator>> {
    try {
      const user = await this.usersRepository.findOneUser(dto.user_id);
      if (!user) {
        return DataRes.failed(ErrorMes.USER_GET_DETAIL);
      }

      const existed = await this.collaboratorsRepository.findByUserId(dto.user_id);
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
          note: dto.note,
          active: dto.active ?? true,
        });

      return DataRes.success(collaborator);
    } catch (error) {
      return DataRes.failed(
        ErrorMes.COLLABORATOR_CREATE,
      );
    }
  }

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
        ErrorMes.COLLABORATOR_GET_DETAIL,
      );
    }
  }

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
        ErrorMes.COLLABORATOR_UPDATE,
      );
    }
  }

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
        ErrorMes.COLLABORATOR_REMOVE,
      );
    }
  }

  async getAvailableCollaborators(query: GetAvailableCollaboratorsDto): Promise<DataRes<{ id: string; name: string; phone: string }[]>> {
    try {
      const { type, field_cooperation } = query;
      const data = await this.collaboratorsRepository.getAvailableCollaborators(type, field_cooperation);
      return DataRes.success(data);
    } catch (error) {
      return DataRes.failed('Không thể lấy danh sách cộng tác viên');
    }
  }


}
