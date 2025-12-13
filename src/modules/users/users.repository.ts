import { User } from './entities/user.entity';
import { EntityRepository, Repository, Connection } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { FilterUsersDto } from './dto/filter-users.dto';
import { PageDto, PageOptionsDto, PageMetaDto } from "src/common/dtos/respones.dto";
import { getSkip } from 'src/common/helpers/utils';
import { UserRoles } from 'src/config/userRoles';


@Injectable()
@EntityRepository(User)
export class UsersRepository {
  private repo: Repository<User>;

  constructor(private connection: Connection) {
    this.repo = this.connection.getRepository(User);
  }

  createUser = async (createUserDto: CreateUserDto) => {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const data = this.repo.create({
      ...createUserDto,
      role: UserRoles.User,
      password: hashedPassword,
    });

    return this.repo.save(data);
  };

  findOneUser = async (id: string) => {
    return this.repo.findOneOrFail({ where: { id } });
  };

  getUsers = async (pageOptionsDto: PageOptionsDto): Promise<PageDto<User>> => {
    const queryBuilder = this.repo.createQueryBuilder("user");

    queryBuilder
      .orderBy("user.createdAt", pageOptionsDto.order)
      .skip(getSkip(pageOptionsDto.page, pageOptionsDto.size))
      .take(pageOptionsDto.size);

    if (pageOptionsDto?.keySearch && pageOptionsDto?.multipleSearchEnums === '') {
      queryBuilder.andWhere('user.full_name like :data OR user.phone like :data', { data: `%${pageOptionsDto.keySearch}%` })
    }

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  };

  findByFilter(filters: FilterUsersDto, orderBy?: {}): Promise<User[]> {
    return this.repo.find({
      where: filters,
      order: orderBy ? orderBy : {}, // {} applies the default sorting order
    });
  }

  findOneUserByPhone = async (phone: string) => {
    return this.repo.findOne({ where: { phone } });
  };

  updateUser = async (id: string, updateUserDto: UpdateUserDto) => {
    const user = await this.findOneUser(id);
    if (!user) return null;

    if (updateUserDto.password) {
      /*
       * @todo: Fix this issue: Getting an error "this.repo.configService.get is not a function" when calling the below function... Not sure why!
       */
      const saltRounds = 10;

      const hashedPassword = await bcrypt.hash(
        updateUserDto.password,
        saltRounds,
      );

      updateUserDto.password = hashedPassword;
    }

    delete user.password;
    delete user.refresh_token;

    return this.repo.save({ ...user, ...updateUserDto });
  };

  removeUser = async (id: string) => {
    await this.repo.findOneOrFail({ where: { id } });
    return this.repo.delete(id);
  };
}
