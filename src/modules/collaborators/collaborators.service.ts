import { Injectable } from '@nestjs/common';

import { CollaboratorsRepository } from './collaborators.repository';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { QueryCollaboratorDto } from './dto/query-collaborator.dto';
import { UpdateCollaboratorDto } from './dto/update-collaborator.dto';
import { Collaborator } from './entities/collaborator.entity';

import { DataRes, PageDto } from 'src/common/dtos/respones.dto';
import { CollaboratorType, FieldCooperation, UserRole } from 'src/common/helpers/enum';
import { ErrorMes } from 'src/common/helpers/errorMessage';

import { TransactionService } from 'src/common/database/transaction.service';
import { User } from '../users/entities/user.entity';
import { UsersRepository } from '../users/users.repository';
import { GetAvailableCollaboratorsDto } from './dto/get-available-collaborators.dto';
import { EntityManager } from 'typeorm';

@Injectable()
export class CollaboratorsService {
  constructor(
    private readonly collaboratorsRepository: CollaboratorsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly transactionService: TransactionService,
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
      if (!user || !user.active) {
        return DataRes.failed(ErrorMes.USER_GET_DETAIL);
      }

      const existed = await this.collaboratorsRepository.findByUserId(dto.user_id);
      if (existed) {
        return DataRes.failed(ErrorMes.COLLABORATOR_EXISTED);
      }

      const collaborator =
        await this.collaboratorsRepository.saveCollaborator({
          user_id: dto.user_id,
          type: dto.type,
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
      const collaborator = await this.collaboratorsRepository.findOneCollaborator(id);
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
      const result = await this.transactionService.runInTransaction(
        async (manager) => {
          /* ===== 1. LOAD COLLABORATOR ===== */
          const collaborator = await manager.findOne(Collaborator, {
            where: { id },
          });

          if (!collaborator) {
            throw new Error(ErrorMes.COLLABORATOR_UPDATE);
          }

          /* ===== 2. LOAD USER ===== */
          const user = collaborator.user_id
            ? await manager.findOne(User, { where: { id: collaborator.user_id } })
            : null;

          const previousType = collaborator.type;
          const previousUserRole = user?.role;

          /* ===== 3. UPDATE COLLABORATOR ===== */
          Object.assign(collaborator, {
            ...(dto.type !== undefined && { type: dto.type }),
            ...(dto.field_cooperation !== undefined && { field_cooperation: dto.field_cooperation }),
            ...(dto.note !== undefined && { note: dto.note }),
            ...(dto.active !== undefined && { active: dto.active }),
          });

          const updatedCollaborator = await manager.save(
            Collaborator,
            collaborator,
          );

          /* ===== 4. BUSINESS RULE: SYNC USER ROLE ===== */
          let roleChanged = false;

          // Broker → Owner
          if (
            user &&
            dto.type === CollaboratorType.Owner &&
            dto.field_cooperation !== undefined &&
            dto.field_cooperation !== FieldCooperation.Undetermined &&
            previousUserRole === UserRole.Broker
          ) {
            user.role = UserRole.Owner;
            roleChanged = true;
          }

          // Owner → Broker
          if (
            user &&
            previousType === CollaboratorType.Owner &&
            dto.type === CollaboratorType.Broker &&
            previousUserRole === UserRole.Owner
          ) {
            user.role = UserRole.Broker;
            roleChanged = true;
          }

          /* ===== 5. INVALIDATE SESSION IF ROLE CHANGED ===== */
          if (user && roleChanged) {
            user.password_version += 1; // ❗ invalidate all tokens
            user.refresh_token = null;

            await manager.save(User, user);
          }

          return updatedCollaborator;
        },
      );

      return DataRes.success(result);
    } catch (error) {
      return DataRes.failed(
        error?.message || ErrorMes.COLLABORATOR_UPDATE,
      );
    }
  }


  async remove(
    id: string,
  ): Promise<DataRes<null>> {
    try {
      const removed = await this.collaboratorsRepository.removeCollaborator(id);
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
