import { Injectable } from '@nestjs/common';
import { DataRes, PageDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { Enums } from 'src/common/dtos/enum.dto';
import { UserRole } from 'src/common/helpers/enum';
import { ErrorMes } from 'src/common/helpers/errorMessage';
import { FindOptionsOrder } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
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

  // ---------------- CREATE ----------------
  async create(dto: CreateUserDto): Promise<DataRes<User>> {
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

  // ---------------- ENUMS ----------------
  getEnums(): DataRes<Enums[]> {
    const enums = Object.entries(CreateUserDto.getEnums()).map(
      ([value, label]) => ({ value, label }),
    );

    return enums.length
      ? DataRes.success(enums)
      : DataRes.failed(ErrorMes.ENUMS_GET_ALL);
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
      // Loại bỏ thông tin nhạy cảm trước khi trả về
      const { password, refresh_token, ...safeUser } = user;
      return DataRes.success(safeUser as User);
    } catch (error) {
      return DataRes.failed(error?.message || 'Lấy thông tin người dùng thất bại');
    }
  }
}
