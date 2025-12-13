import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Enums } from 'src/common/dtos/enum.dto';
import { DataRes, PageDto, PageOptionsDto } from "src/common/dtos/respones.dto";
import { ErrorMes } from "../../common/helpers/errorMessage";
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUsersDto } from './dto/filter-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { UserRoles } from 'src/config/userRoles';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    @Inject(REQUEST) private request,) { }


  async getUser(id: string): Promise<DataRes<User>> {
    var res = new DataRes<User>();

    try {
      const user = await this.usersRepository.findOneUser(id);

      if (!user) {
        res.setFailed(ErrorMes.USER_GET_DETAIL);
      }

      res.setSuccess(user);
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  getEnums(): DataRes<Enums[]> {
    var res = new DataRes<Enums[]>;

    try {
      let arr: Array<Enums> = [];
      Object.entries(CreateUserDto.getEnums()).forEach(item => {
        arr.push({
          label: item[1],
          value: item[0]
        })
      });

      if (!arr.length) {
        res.setFailed(ErrorMes.ENUMS_GET_ALL);
      }
      res.setSuccess(arr);
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<DataRes<User>> {
    var res = new DataRes<User>();

    try {
      const user = this.request?.user;
      if (user && user.role !== UserRoles.Admin) {
        delete updateUserDto?.active;
        delete updateUserDto?.role;
        delete updateUserDto?.phone;
      }
      const userUpdated = await this.usersRepository.updateUser(id, updateUserDto);

      if (userUpdated) {
        res.setSuccess(userUpdated);
      } else {
        res.setFailed(ErrorMes.USER_UPDATE);
      }
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  findOneByPhone(phone: string) {
    return this.usersRepository.findOneUserByPhone(phone);
  }

  async getUsers(pageOptionsDto: PageOptionsDto): Promise<DataRes<PageDto<User>>> {
    var res = new DataRes<PageDto<User>>;

    try {
      const users = await this.usersRepository.getUsers(pageOptionsDto);

      if (!users) {
        res.setFailed(ErrorMes.USER_GET_ALL);
        return res;
      }

      res.setSuccess(users);
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async create(createUserDto: CreateUserDto): Promise<DataRes<User>> {
    var res = new DataRes<User>();

    try {
      const userCreated = await this.usersRepository.createUser(createUserDto);

      if (userCreated) {
        res.setSuccess(userCreated);
      } else {
        res.setFailed(ErrorMes.USER_CREATE);
      }
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async removeUser(id: string): Promise<DataRes<User>> {
    var res = new DataRes<User>();

    try {
      const { affected } = await this.usersRepository.removeUser(id);

      if (affected === 1) {
        res.setSuccess(null);
      } else {
        res.setFailed(ErrorMes.USER_REMOVE);
      }
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  findByFilter(filters: FilterUsersDto, orderBy?: {}): Promise<User[]> {
    return this.usersRepository.findByFilter(filters, orderBy);
  }


}
