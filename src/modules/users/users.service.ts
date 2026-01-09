import { Injectable } from '@nestjs/common';

import { DataRes, PageDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { CustomerType, UserRole } from 'src/common/helpers/enum';
import { ErrorMes } from 'src/common/helpers/errorMessage';

import { toSafeUser } from 'src/common/helpers/api';
import { CreateUserDto, CustomerCreateUserDto } from './dto/create-user.dto';
import { CustomerUpdateUserDto } from './dto/customer-update-user.dto';
import { GetAvailableCollaboratorsDto } from './dto/get-available-collaborators.dto';
import { RegisterAfterBookingDto } from './dto/register-after-booking.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { User } from 'src/modules/users/entities/user.entity';


@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
  ) { }


  /* ================= CUSTOMER  ================= */

  async customerCreate(
    dto: CustomerCreateUserDto,
  ): Promise<DataRes<any>> {
    try {
      const existed = await this.usersRepository.findOneUserByPhone(dto.phone);
      if (existed) {
        return DataRes.failed('PHONE_IS_EXISTED');
      }

      const user = await this.usersRepository.create({
        name: dto.name.trim(),
        phone: dto.phone.trim(),
        password: dto.password,
        role: this.mapCustomerRole(dto.customer_type),
        active: true,
      });

      return DataRes.success(toSafeUser(user));
    } catch (error) {
      console.log('Error customerCreate', error?.message);
      return DataRes.failed(ErrorMes.SYSTEM_ERROR);
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
      console.log('Error customerUpdateProfile', error?.message);
      return DataRes.failed(ErrorMes.SYSTEM_ERROR);
    }
  }

  async registerAfterBooking(
    dto: RegisterAfterBookingDto,
  ): Promise<DataRes<any>> {
    try {
      const existed = await this.usersRepository.findOneUserByPhone(dto.phone);
      if (existed) {
        return DataRes.failed('PHONE_IS_EXISTED');
      }

      const user = await this.usersRepository.create({
        name: dto.name.trim(),
        phone: dto.phone.trim(),
        password: dto.password,
        role: UserRole.Tenant,
        active: true,
      });

      return DataRes.success(toSafeUser(user));
    } catch (error) {
      console.log('Error registerAfterBooking', error?.message);
      return DataRes.failed(ErrorMes.SYSTEM_ERROR);
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
        error?.message || 'Tạo người dùng thất bại',
      );
    }
  }

  /* ================= UPDATE ================= */

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
        error?.message || 'Cập nhật người dùng thất bại',
      );
    }
  }

  /* ================= GET ONE ================= */

  async getUser(id: string): Promise<DataRes<User>> {
    try {
      const user = await this.usersRepository.findOneUser(id);
      if (!user) {
        return DataRes.failed(ErrorMes.USER_GET_DETAIL);
      }

      return DataRes.success(toSafeUser(user));
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Lấy thông tin người dùng thất bại',
      );
    }
  }

  /* ================= LIST ================= */

  async getUsers(
    pageOptionsDto: PageOptionsDto,
  ): Promise<DataRes<PageDto<User>>> {
    try {
      const users = await this.usersRepository.getUsers(pageOptionsDto);
      return DataRes.success(users);
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Lấy danh sách người dùng thất bại',
      );
    }
  }

  async getAvailableCollaborators(
    query: GetAvailableCollaboratorsDto,
  ): Promise<DataRes<User[]>> {
    try {
      const users = await this.usersRepository.getAvailableCollaborators(query);

      return DataRes.success(
        users.map(user => toSafeUser(user)),
      );
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Lấy danh sách cộng tác viên thất bại',
      );
    }
  }

  /* ================= DELETE ================= */

  async removeUser(id: string): Promise<DataRes<null>> {
    try {
      const removed = await this.usersRepository.removeUser(id);
      return removed
        ? DataRes.success(null)
        : DataRes.failed(ErrorMes.USER_REMOVE);
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Xoá người dùng thất bại',
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
    switch (type) {
      case CustomerType.Owner:
        return UserRole.Owner;
      case CustomerType.Broker:
        return UserRole.Broker;
      case CustomerType.Tenant:
      default:
        return UserRole.Tenant;
    }
  }

}
