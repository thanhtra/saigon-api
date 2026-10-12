import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository
} from 'typeorm';

import {
  PageDto,
  PageMetaDto,
} from 'src/common/dtos/respones.dto';
import { getSkip } from 'src/common/helpers/utils';

import { UserRole } from 'src/common/helpers/enum';
import { PasswordUtil } from 'src/common/helpers/password';
import { User } from 'src/modules/users/entities/user.entity';
import { Collaborator } from '../collaborators/entities/collaborator.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { GetAvailableCollaboratorsDto } from './dto/get-available-collaborators.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetAvailableTenantsDto } from './dto/get-available-tenants.dto';
import { FilterUsersDto } from './dto/filter-users.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) { }

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.repo.create({
      ...dto,
      password: await PasswordUtil.hash(dto.password),
    });

    return this.repo.save(user);
  }

  async updateProfile(
    id: string,
    dto: UpdateUserDto,
  ): Promise<User | null> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) return null;

    return this.repo.save({
      ...user,
      ...dto,
    });
  }

  async updatePassword(
    userId: string,
    hashedPassword: string,
  ): Promise<void> {
    await this.repo.update(userId, {
      password: hashedPassword,
      refresh_token: null,
      password_version: () => 'password_version + 1',
    });
  }

  async updateRefreshToken(
    userId: string,
    hashedRefreshToken: string | null,
  ): Promise<void> {
    await this.repo.update(userId, {
      refresh_token: hashedRefreshToken,
    });
  }

  async findOneUser(id: string): Promise<User | null> {
    if (!id) return null;
    return this.repo.findOne({ where: { id } });
  }

  async findOneUserByPhone(phone: string): Promise<User | null> {
    if (!phone) return null;
    return this.repo.findOne({ where: { phone } });
  }

  async getUsers(
    filter: FilterUsersDto,
  ): Promise<PageDto<User>> {
    const qb = this.repo.createQueryBuilder('user');

    const skip = getSkip(filter.page, filter.size);
    const take = Math.min(filter.size, 50);

    qb.orderBy('user.createdAt', filter.order)
      .skip(skip)
      .take(take);

    if (filter.key_search) {
      qb.andWhere(
        '(user.name ILIKE :q OR user.phone ILIKE :q)',
        { q: `%${filter.key_search}%` },
      );
    }

    if (filter.role) {
      qb.andWhere('user.role = :role', {
        role: filter.role,
      });
    }

    if (filter.active !== undefined) {
      qb.andWhere('user.active = :active', {
        active: filter.active,
      });
    }

    const [entities, itemCount] = await qb.getManyAndCount();

    return new PageDto(
      entities,
      new PageMetaDto({
        itemCount,
        pageOptionsDto: filter,
      }),
    );
  }

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

  async getAvailableTenants(
    query: GetAvailableTenantsDto,
  ): Promise<User[]> {
    const { keyword, limit = 20 } = query;

    const qb = this.repo
      .createQueryBuilder('u')
      .leftJoin(
        'tenants',
        't',
        't.user_id = u.id',
      )
      .where('t.id IS NULL')
      .andWhere('u.active = true')
      .andWhere('u.role = :role', { role: UserRole.Tenant });

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


  async removeUser(id: string): Promise<boolean> {
    const { affected } = await this.repo.delete(id);
    return affected === 1;
  }

}
