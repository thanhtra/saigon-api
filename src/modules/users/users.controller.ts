import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Inject, Param, Post, Query, UseInterceptors, Request } from '@nestjs/common';
import { Put, UseGuards } from '@nestjs/common/decorators';
import { REQUEST } from '@nestjs/core';
import { Enums } from 'src/common/dtos/enum.dto';
import { DataRes, PageDto, PageOptionsDto } from "src/common/dtos/respones.dto";
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { PERMISSIONS } from 'src/config/permissions';
import { Public } from '../../common/decorators/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private usersService: UsersService,
    @Inject(REQUEST) private request,) { }

  @Post()
  @Public()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<DataRes<User>> {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.users.read_many)
  async getUsers(@Query() pageOptionsDto: PageOptionsDto): Promise<DataRes<PageDto<User>>> {
    return await this.usersService.getUsers(pageOptionsDto);
  }

  @Get(':id/detail')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.users.read_one)
  async getUser(@Param('id') id: string): Promise<DataRes<User>> {
    return this.usersService.getUser(id);
  }

  @Get('/enums')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.users.enums)
  getEnums(): DataRes<Enums[]> {
    return this.usersService.getEnums();
  }

  @Put(':id/update')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.users.update)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<DataRes<User>> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id/delete')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.users.delete)
  async remove(@Param('id') id: string): Promise<DataRes<User>> {
    return this.usersService.removeUser(id);
  }

}
