import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { Permissions } from 'src/common/decorators/permissions.decorator';
import { Enums } from 'src/common/dtos/enum.dto';
import { DataRes, PageDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { PERMISSIONS } from 'src/config/permissions';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // ---------- CREATE ----------
  @Post()
  @Permissions(PERMISSIONS.users.create)
  create(
    @Body() dto: CreateUserDto,
  ): Promise<DataRes<User>> {
    return this.usersService.create(dto);
  }

  // ---------- LIST ----------
  @Get()
  @Permissions(PERMISSIONS.users.read_many)
  getUsers(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<DataRes<PageDto<User>>> {
    return this.usersService.getUsers(pageOptionsDto);
  }

  // ---------- DETAIL ----------
  @Get(':id')
  @Permissions(PERMISSIONS.users.read_one)
  getUser(
    @Param('id') id: string,
  ): Promise<DataRes<User>> {
    return this.usersService.getUser(id);
  }

  // ---------- ENUMS ----------
  @Get('enums')
  @Permissions(PERMISSIONS.users.enums)
  getEnums(): DataRes<Enums[]> {
    return this.usersService.getEnums();
  }

  // ---------- UPDATE ----------
  @Put(':id')
  @Permissions(PERMISSIONS.users.update)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Req() req,
  ): Promise<DataRes<User>> {
    return this.usersService.update(id, dto, req.user);
  }

  // ---------- DELETE ----------
  @Delete(':id')
  @Permissions(PERMISSIONS.users.delete)
  remove(
    @Param('id') id: string,
  ): Promise<DataRes<null>> {
    return this.usersService.removeUser(id);
  }
}
