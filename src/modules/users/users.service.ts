import { Injectable } from '@nestjs/common';
import { FindOptionsOrder } from 'typeorm';

import { DataRes, PageDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { CustomerType, UserRole } from 'src/common/helpers/enum';
import { ErrorMes } from 'src/common/helpers/errorMessage';

import { CreateUserDto, CustomerCreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUsersDto } from './dto/filter-users.dto';
import { GetAvailableCollaboratorsDto } from './dto/get-available-collaborators.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
  ) { }

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

  private toSafeUser(user: User): User {
    if (!user) return user;

    const { password, refresh_token, ...safeUser } = user;
    return safeUser as User;
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

  /* ================= CREATE ================= */

  async customerCreate(
    dto: CustomerCreateUserDto,
  ): Promise<DataRes<User>> {
    try {
      const existed = await this.usersRepository.findOneUserByPhone(dto.phone);
      if (existed) {
        return DataRes.failed('Số điện thoại đã tồn tại');
      }

      const role = this.mapCustomerRole(dto.customer_type);

      const user = await this.usersRepository.create({
        name: dto.name,
        phone: dto.phone,
        password: dto.password,
        role,
        active: true,
      });

      return DataRes.success(this.toSafeUser(user));
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Tạo tài khoản khách hàng thất bại',
      );
    }
  }

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
      return DataRes.success(this.toSafeUser(user));
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

      const updated = await this.usersRepository.update(id, safeDto);
      if (!updated) {
        return DataRes.failed(ErrorMes.USER_UPDATE);
      }

      return DataRes.success(this.toSafeUser(updated));
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

      return DataRes.success(this.toSafeUser(user));
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
        users.map(user => this.toSafeUser(user)),
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

  /* ================= INTERNAL / OTHER ================= */

  async findByFilter(
    filters: FilterUsersDto,
    orderBy?: FindOptionsOrder<User>,
  ): Promise<User[]> {
    return await this.usersRepository.findByFilter(filters, orderBy);
  }

  async findOneByPhone(
    phone: string,
  ): Promise<DataRes<User>> {
    try {
      const user = await this.usersRepository.findOneUserByPhone(phone);
      if (!user) {
        return DataRes.failed(ErrorMes.USER_GET_DETAIL);
      }

      return DataRes.success(user);
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Lấy thông tin người dùng thất bại',
      );
    }
  }
}
