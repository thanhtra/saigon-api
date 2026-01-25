import { BadRequestException, Injectable } from '@nestjs/common';

import { DataRes, PageDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { CollaboratorType, CustomerType, FieldCooperation, UserRole } from 'src/common/helpers/enum';
import { ErrorMes } from 'src/common/helpers/errorMessage';

import { toSafeUser } from 'src/common/helpers/api';
import { CreateUserDto, CustomerCreateUserDto } from './dto/create-user.dto';
import { CustomerUpdateUserDto } from './dto/customer-update-user.dto';
import { GetAvailableCollaboratorsDto } from './dto/get-available-collaborators.dto';
import { RegisterAfterBookingDto } from './dto/register-after-booking.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { User } from 'src/modules/users/entities/user.entity';
import { GetAvailableTenantsDto } from './dto/get-available-tenants.dto';
import { TransactionService } from 'src/common/database/transaction.service';
import { Tenant } from '../tenants/entities/tenant.entity';
import { Collaborator } from '../collaborators/entities/collaborator.entity';
import { PasswordUtil } from 'src/common/helpers/password';
import { EntityManager } from 'typeorm';


@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly transactionService: TransactionService,
  ) { }


  /* ================= CUSTOMER  ================= */

  async customerCreate(
    dto: CustomerCreateUserDto,
  ): Promise<DataRes<any>> {
    try {
      const result = await this.transactionService.runInTransaction(
        async (manager) => {

          const existed = await manager.findOne(User, {
            where: { phone: dto.phone.trim() },
          });

          if (existed) {
            throw new BadRequestException('PHONE_IS_EXISTED');
          }

          const role = this.mapCustomerRole(dto.customer_type);

          const user = await manager.save(
            User,
            manager.create(User, {
              name: dto.name.trim(),
              phone: dto.phone.trim(),
              password: await PasswordUtil.hash(dto.password.trim()),
              role,
              active: true,
            }),
          );

          let collaborator: Collaborator | null = null;
          let tenant: Tenant | null = null;

          if ([CustomerType.Owner, CustomerType.Broker].includes(dto.customer_type)) {

            collaborator = await manager.save(
              Collaborator,
              manager.create(Collaborator, {
                user_id: user.id,
                type: dto.customer_type === CustomerType.Owner ? CollaboratorType.Owner : CollaboratorType.Broker,
                field_cooperation: FieldCooperation.Undetermined,
                active: true,
              }),
            );
          }

          if (role === UserRole.Tenant) {
            tenant = await manager.save(
              Tenant,
              manager.create(Tenant, {
                user_id: user.id,
                active: true,
              }),
            );
          }

          return toSafeUser(user);
        },
      );

      return DataRes.success(result);
    } catch (error) {
      console.error('Error customerCreate', error);
      return DataRes.failed(
        error?.message || ErrorMes.SYSTEM_ERROR,
      );
    }
  }

  async customerUpdateProfile(
    currentUser: User,
    dto: CustomerUpdateUserDto,
  ): Promise<DataRes<User>> {
    try {
      const payload = {
        name: dto.name?.trim(),
        email: dto.email ?? null,
        zalo: dto.zalo ?? null,
        link_facebook: dto.link_facebook ?? null,
        address: dto.address ?? null,
      };

      const updated = await this.usersRepository.updateProfile(
        currentUser.id,
        payload,
      );

      if (!updated) {
        return DataRes.failed('Cập nhật thông tin thất bại');
      }

      return DataRes.success(toSafeUser(updated));
    } catch (error) {
      return DataRes.failed(ErrorMes.SYSTEM_ERROR);
    }
  }

  async registerAfterBooking(
    dto: RegisterAfterBookingDto,
  ): Promise<DataRes<any>> {
    try {
      const result = await this.transactionService.runInTransaction(
        async (manager) => {
          const existed = await manager.findOne(User, {
            where: { phone: dto.phone.trim() },
          });

          if (existed) {
            throw new BadRequestException('PHONE_IS_EXISTED');
          }

          const user = await manager.save(
            User,
            manager.create(User, {
              name: dto.name.trim(),
              phone: dto.phone.trim(),
              password: await PasswordUtil.hash(dto.password.trim()),
              role: UserRole.Tenant,
              active: true,
            }),
          );

          const tenant = await manager.save(
            Tenant,
            manager.create(Tenant, {
              user_id: user.id,
              active: true,
            }),
          );

          return {
            user: toSafeUser(user),
            tenant_id: tenant.id,
          };
        },
      );

      return DataRes.success(result);
    } catch (error) {
      console.error('Error registerAfterBooking', error);
      return DataRes.failed(
        error?.message || ErrorMes.SYSTEM_ERROR,
      );
    }
  }


  /* ================= ADMIN ================= */

  async create(
    dto: CreateUserDto,
  ): Promise<DataRes<User>> {
    try {
      if (dto.role === UserRole.Admin) {
        return DataRes.failed('Lỗi hệ thống');
      }

      const existed = await this.usersRepository.findOneUserByPhone(dto.phone);
      if (existed) {
        return DataRes.failed('Số điện thoại đã tồn tại');
      }

      const user = await this.usersRepository.create(dto);
      return DataRes.success(toSafeUser(user));
    } catch (error) {
      return DataRes.failed(
        'Tạo người dùng thất bại',
      );
    }
  }

  async update(
    id: string,
    dto: UpdateUserDto,
    currentUser: User,
  ): Promise<DataRes<User>> {
    try {
      const safeDto = this.filterUpdateDtoByRole(dto, currentUser);

      const updated = await this.usersRepository.updateProfile(id, safeDto);
      if (!updated) {
        return DataRes.failed(ErrorMes.USER_UPDATE);
      }

      return DataRes.success(toSafeUser(updated));
    } catch (error) {
      return DataRes.failed(
        'Cập nhật người dùng thất bại',
      );
    }
  }

  async getUser(id: string): Promise<DataRes<User>> {
    try {
      const user = await this.usersRepository.findOneUser(id);
      if (!user) {
        return DataRes.failed(ErrorMes.USER_GET_DETAIL);
      }

      return DataRes.success(user);
    } catch (error) {
      return DataRes.failed(
        'Lấy thông tin người dùng thất bại',
      );
    }
  }

  async getUsers(
    pageOptionsDto: PageOptionsDto,
  ): Promise<DataRes<PageDto<User>>> {
    try {
      const users = await this.usersRepository.getUsers(pageOptionsDto);
      return DataRes.success(users);
    } catch (error) {
      return DataRes.failed(
        'Lấy danh sách người dùng thất bại',
      );
    }
  }

  async removeUser(id: string): Promise<DataRes<null>> {
    try {
      const removed = await this.usersRepository.removeUser(id);
      return removed
        ? DataRes.success(null)
        : DataRes.failed(ErrorMes.USER_REMOVE);
    } catch (error) {
      return DataRes.failed(
        'Xoá người dùng thất bại',
      );
    }
  }

  async getAvailableCollaborators(
    query: GetAvailableCollaboratorsDto,
  ): Promise<DataRes<User[]>> {
    try {
      const users = await this.usersRepository.getAvailableCollaborators(query);
      return DataRes.success(users);
    } catch (error) {
      return DataRes.failed(
        'Lấy danh sách cộng tác viên thất bại',
      );
    }
  }

  async getAvailableTenants(
    query: GetAvailableTenantsDto,
  ): Promise<DataRes<User[]>> {
    try {
      const users = await this.usersRepository.getAvailableTenants(query);
      return DataRes.success(users);
    } catch (error) {
      return DataRes.failed(
        'Lấy danh sách khách hàng thất bại',
      );
    }
  }




  /* ================= PRIVATE HELPERS ================= */

  private filterUpdateDtoByRole(
    dto: UpdateUserDto,
    currentUser: User,
  ): UpdateUserDto {
    if (currentUser.role === UserRole.Admin) {
      return dto;
    }

    const { active, role, phone, ...safeDto } = dto;
    return safeDto;
  }

  private mapCustomerRole(type: CustomerType): UserRole {
    return type === CustomerType.Tenant
      ? UserRole.Tenant
      : UserRole.Broker;
  }

  private async invalidateUserSession(
    manager: EntityManager,
    user: User,
  ) {
    user.password_version += 1;
    user.refresh_token = null;

    await manager.save(User, user);
  }


}
