import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  FindOptionsOrder,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import {
  PageDto,
  PageMetaDto,
  PageOptionsDto,
} from 'src/common/dtos/respones.dto';
import { UserRole } from 'src/common/helpers/enum';
import { getSkip } from 'src/common/helpers/utils';

import { CreateUserDto } from './dto/create-user.dto';
import { FilterUsersDto } from './dto/filter-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) { }

  // ---------------- CREATE ----------------
  async create(dto: CreateUserDto): Promise<User> {
    const user = this.repo.create({
      ...dto,
      password: await this.hashPassword(dto.password),
      role: dto.role ?? UserRole.User,
    });

    return this.repo.save(user);
  }

  // ---------------- UPDATE ----------------
  async update(id: string, dto: UpdateUserDto): Promise<User | null> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) return null;

    if (dto.password) {
      dto.password = await this.hashPassword(dto.password);
    }

    return this.repo.save(this.repo.merge(user, dto));
  }

  // ---------------- FIND ONE ----------------
  async findOneUser(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findOneUserByPhone(phone: string): Promise<User | null> {
    return this.repo.findOne({ where: { phone } });
  }

  // ---------------- LIST + PAGINATION ----------------
  async getUsers(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<User>> {
    const qb = this.repo.createQueryBuilder('user');

    qb.orderBy('user.createdAt', pageOptionsDto.order)
      .skip(getSkip(pageOptionsDto.page, pageOptionsDto.size))
      .take(Math.min(pageOptionsDto.size, 50)); // 🔥 limit size

    if (pageOptionsDto.keySearch && !pageOptionsDto.multipleSearchEnums) {
      qb.andWhere(
        '(user.name LIKE :q OR user.phone LIKE :q)',
        { q: `%${pageOptionsDto.keySearch}%` },
      );
    }

    const [entities, itemCount] = await qb.getManyAndCount();

    return new PageDto(
      entities,
      new PageMetaDto({ itemCount, pageOptionsDto }),
    );
  }

  // ---------------- DELETE ----------------
  async removeUser(id: string): Promise<boolean> {
    const { affected } = await this.repo.delete(id);
    return affected === 1;
  }

  // ---------------- FILTER ----------------
  async findByFilter(
    filters: FilterUsersDto,
    orderBy?: FindOptionsOrder<User>,
  ): Promise<User[]> {
    return this.repo.find({
      where: filters,
      ...(orderBy && { order: orderBy }),
    });
  }

  // ---------------- HELPER ----------------
  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
