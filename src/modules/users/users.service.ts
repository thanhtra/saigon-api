import { Injectable } from '@nestjs/common';
import { DataRes, PageDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { Enums } from 'src/common/dtos/enum.dto';
import { CustomerType, UserRole } from 'src/common/helpers/enum';
import { ErrorMes } from 'src/common/helpers/errorMessage';
import { FindOptionsOrder } from 'typeorm';

import { CreateUserDto, CustomerCreateUserDto } from './dto/create-user.dto';
import { FilterUsersDto } from './dto/filter-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
  ) { }

  // ---------------- PRIVATE ----------------
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
    const { password, refresh_token, ...safeUser } = user;
    return safeUser as User;
  }

  // ---------------- UPDATE ----------------
  async update(
    id: string,
    dto: UpdateUserDto,
    currentUser: User,
  ): Promise<DataRes<User>> {
    const safeDto = this.filterUpdateDtoByRole(dto, currentUser);

    const updated = await this.usersRepository.update(id, safeDto);
    if (!updated) {
      return DataRes.failed(ErrorMes.USER_UPDATE);
    }

    return DataRes.success(this.toSafeUser(updated));
  }

  // ---------------- CUSTOMER CREATE ----------------

  async customerCreate(dto: CustomerCreateUserDto): Promise<DataRes<User>> {
    const existed = await this.usersRepository.findOneUserByPhone(dto.phone);
    if (existed) {
      return DataRes.failed("Số điện thoại đã tồn tại");
    }

    let role;
    switch (dto.customer_type) {
      case CustomerType.OWNER:
        role = UserRole.Owner;
        break;
      case CustomerType.BROKER:
        role = UserRole.Broker;
        break;
      case CustomerType.TENANT:
        role = UserRole.Tenant;
        break;
      default:
        role = UserRole.Tenant;
    }

    const user = await this.usersRepository.create({
      name: dto.name,
      password: dto.password,
      phone: dto.phone,
      role: role,
      active: true
    });

    return DataRes.success(this.toSafeUser(user));
  }

  // ---------------- CREATE ----------------
  async create(dto: CreateUserDto): Promise<DataRes<User>> {
    if (dto?.role && dto.role === UserRole.Admin) {
      return DataRes.failed("Lỗi tạo người dùng");
    }

    const existed = await this.usersRepository.findOneUserByPhone(dto.phone);
    if (existed) {
      return DataRes.failed("Số điện thoại đã tồn tại");
    }

    if (dto.role === UserRole.Admin) {
      return DataRes.failed("Lỗi hệ thống");
    }

    const user = await this.usersRepository.create(dto);
    return DataRes.success(this.toSafeUser(user));
  }

  // ---------------- GET ONE ----------------
  async getUser(id: string): Promise<DataRes<User>> {
    const user = await this.usersRepository.findOneUser(id);
    if (!user) {
      return DataRes.failed(ErrorMes.USER_GET_DETAIL);
    }

    return DataRes.success(this.toSafeUser(user));
  }


  // ---------------- LIST ----------------
  async getUsers(
    pageOptionsDto: PageOptionsDto,
  ): Promise<DataRes<PageDto<User>>> {
    const users = await this.usersRepository.getUsers(pageOptionsDto);
    return DataRes.success(users);
  }

  // ---------------- DELETE ----------------
  async removeUser(id: string): Promise<DataRes<null>> {
    const removed = await this.usersRepository.removeUser(id);
    return removed
      ? DataRes.success(null)
      : DataRes.failed(ErrorMes.USER_REMOVE);
  }

  // ---------------- FILTER ----------------
  async findByFilter(
    filters: FilterUsersDto,
    orderBy?: FindOptionsOrder<User>,
  ): Promise<User[]> {
    return this.usersRepository.findByFilter(filters, orderBy);
  }

  // ---------------- FIND BY PHONE ----------------
  async findOneByPhone(phone: string): Promise<DataRes<User>> {
    try {
      const user = await this.usersRepository.findOneUserByPhone(phone);
      if (!user) {
        return DataRes.failed(ErrorMes.USER_GET_DETAIL || 'Người dùng không tồn tại');
      }

      return DataRes.success(user);
    } catch (error) {
      return DataRes.failed(error?.message || 'Lấy thông tin người dùng thất bại');
    }
  }
}
