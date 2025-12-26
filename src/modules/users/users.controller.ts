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
import { Public } from 'src/common/decorators/public.decorator';
import { DataRes, PageDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { PERMISSIONS } from 'src/config/permissions';

import { CreateUserDto, CustomerCreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetAvailableCollaboratorsDto } from './dto/get-available-collaborators.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(PermissionsGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  /* ================= CUSTOMER ================= */

  // ---------- REGISTER ----------
  @Post('register')
  @Public()
  async customerCreate(
    @Body() dto: CustomerCreateUserDto,
  ): Promise<DataRes<User>> {
    return await this.usersService.customerCreate(dto);
  }

  /* ================= ADMIN ================= */

  // ---------- CREATE ----------
  @Post()
  @Permissions(PERMISSIONS.users.create)
  async create(
    @Body() dto: CreateUserDto,
  ): Promise<DataRes<User>> {
    return await this.usersService.create(dto);
  }

  // ---------- LIST AVAILABLE COLLABORATORS ----------
  @Get('available-collaborator')
  @Permissions(PERMISSIONS.users.read_many)
  async getAvailableCollaborators(
    @Query() query: GetAvailableCollaboratorsDto,
  ): Promise<DataRes<User[]>> {
    return await this.usersService.getAvailableCollaborators(query);
  }

  // ---------- LIST USERS ----------
  @Get()
  @Permissions(PERMISSIONS.users.read_many)
  async getUsers(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<DataRes<PageDto<User>>> {
    return await this.usersService.getUsers(pageOptionsDto);
  }

  // ---------- DETAIL ----------
  @Get(':id')
  @Permissions(PERMISSIONS.users.read_one)
  async getUser(
    @Param('id') id: string,
  ): Promise<DataRes<User>> {
    return await this.usersService.getUser(id);
  }

  // ---------- UPDATE ----------
  @Put(':id')
  @Permissions(PERMISSIONS.users.update)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Req() req,
  ): Promise<DataRes<User>> {
    return await this.usersService.update(id, dto, req.user);
  }

  // ---------- DELETE ----------
  @Delete(':id')
  @Permissions(PERMISSIONS.users.delete)
  async remove(
    @Param('id') id: string,
  ): Promise<DataRes<null>> {
    return await this.usersService.removeUser(id);
  }
}
