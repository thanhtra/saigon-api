import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import {
  FindOptionsOrder,
  Repository,
} from 'typeorm';

import {
  PageDto,
  PageMetaDto,
  PageOptionsDto,
} from 'src/common/dtos/respones.dto';
import { getSkip } from 'src/common/helpers/utils';

import { CreateUserDto } from './dto/create-user.dto';
import { FilterUsersDto } from './dto/filter-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { GetAvailableCollaboratorsDto } from './dto/get-available-collaborators.dto';
import { Collaborator } from '../collaborators/entities/collaborator.entity';
import { UserRole } from 'src/common/helpers/enum';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) { }

  // ---------- CREATE ----------
  async create(dto: CreateUserDto): Promise<User> {
    const user = this.repo.create({
      ...dto,
      password: await this.hashPassword(dto.password),
    });

    return this.repo.save(user);
  }

  // ---------- UPDATE ----------
  async update(id: string, dto: UpdateUserDto): Promise<User | null> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) return null;

    if (dto.password) {
      dto.password = await this.hashPassword(dto.password);
    } else {
      delete dto.password;
    }

    return this.repo.save({ ...user, ...dto });
  }

  // ---------- FIND ----------
  async findOneUser(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findOneUserByPhone(phone: string): Promise<User | null> {
    return this.repo.findOne({ where: { phone } });
  }

  // ---------- LIST ----------
  async getUsers(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<User>> {
    const qb = this.repo.createQueryBuilder('user');

    const skip = getSkip(pageOptionsDto.page, pageOptionsDto.size);
    const take = Math.min(pageOptionsDto.size, 50);

    qb.orderBy('user.createdAt', pageOptionsDto.order)
      .skip(skip)
      .take(take);

    if (pageOptionsDto.keySearch) {
      qb.andWhere(
        '(user.name ILIKE :q OR user.phone ILIKE :q)',
        { q: `%${pageOptionsDto.keySearch}%` },
      );
    }

    const [entities, itemCount] = await qb.getManyAndCount();

    return new PageDto(
      entities,
      new PageMetaDto({ itemCount, pageOptionsDto }),
    );
  }

  // ---------- AVAILABLE COLLABORATORS ----------
  async getAvailableCollaborators(
    query: GetAvailableCollaboratorsDto,
  ): Promise<User[]> {

    const { keyword, limit = 20 } = query;

    const qb = this.repo
      .createQueryBuilder('u')
      .leftJoin(
        Collaborator,
        'c',
        'c.user_id = u.id',
      )
      .where('c.id IS NULL')
      .andWhere('u.active = true')
      .andWhere('u.role IN (:...roles)', {
        roles: [UserRole.Owner, UserRole.Broker],
      });

    if (keyword) {
      qb.andWhere(
        '(u.name ILIKE :kw OR u.phone ILIKE :kw)',
        { kw: `%${keyword}%` },
      );
    }

    return qb
      .orderBy('u.createdAt', 'DESC')
      .limit(limit)
      .getMany();
  }


  // ---------- DELETE ----------
  async removeUser(id: string): Promise<boolean> {
    const { affected } = await this.repo.delete(id);
    return affected === 1;
  }

  // ---------- FILTER ----------
  async findByFilter(
    filters: FilterUsersDto,
    orderBy?: FindOptionsOrder<User>,
  ): Promise<User[]> {
    return this.repo.find({
      where: filters,
      ...(orderBy && { order: orderBy }),
    });
  }

  // ---------- HELPER ----------
  private hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }
}
