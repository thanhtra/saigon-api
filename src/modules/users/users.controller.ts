import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';

import { Public } from 'src/common/decorators/public.decorator';
import { DataRes, PageDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { PERMISSIONS } from 'src/config/permissions';

import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Auth } from 'src/common/decorators/auth.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/modules/users/entities/user.entity';
import { CreateUserDto, CustomerCreateUserDto } from './dto/create-user.dto';
import { CustomerUpdateUserDto } from './dto/customer-update-user.dto';
import { GetAvailableCollaboratorsDto } from './dto/get-available-collaborators.dto';
import { RegisterAfterBookingDto } from './dto/register-after-booking.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  /* ================= CUSTOMER ================= */

  @Post('register')
  @Public()
  @UseGuards(ThrottlerGuard)
  @Throttle(5, 60)            // 5 lần / 60 giây / IP
  async customerCreate(
    @Body() dto: CustomerCreateUserDto,
  ): Promise<DataRes<any>> {
    return await this.usersService.customerCreate(dto);
  }

  @Post('register-after-booking')
  @Public()
  @UseGuards(ThrottlerGuard)
  @Throttle(5, 60)
  async registerAfterBooking(
    @Body() dto: RegisterAfterBookingDto,
  ): Promise<DataRes<any>> {
    return await this.usersService.registerAfterBooking(dto);
  }


  /* ================= USER ================= */


  @Put('me')
  @UseGuards(ThrottlerGuard)
  @Auth(PERMISSIONS.users.all_role)
  async customerUpdateProfile(
    @Body() dto: CustomerUpdateUserDto,
    @CurrentUser() user: User,
  ): Promise<DataRes<User>> {
    return await this.usersService.customerUpdateProfile(
      user,
      dto,
    );
  }

  /* ================= ADMIN ================= */

  @Post()
  @Auth(PERMISSIONS.users.create)
  async create(
    @Body() dto: CreateUserDto,
  ): Promise<DataRes<User>> {
    return await this.usersService.create(dto);
  }

  @Get('available-collaborator')
  @Auth(PERMISSIONS.users.read_many)
  async getAvailableCollaborators(
    @Query() query: GetAvailableCollaboratorsDto,
  ): Promise<DataRes<User[]>> {
    return await this.usersService.getAvailableCollaborators(query);
  }

  @Get()
  @Auth(PERMISSIONS.users.read_many)
  async getUsers(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<DataRes<PageDto<User>>> {
    return await this.usersService.getUsers(pageOptionsDto);
  }

  @Get(':id')
  @Auth(PERMISSIONS.users.read_one)
  async getUser(
    @Param('id') id: string,
  ): Promise<DataRes<User>> {
    return await this.usersService.getUser(id);
  }

  @Put(':id')
  @Auth(PERMISSIONS.users.update)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() userReq: User,
  ): Promise<DataRes<User>> {
    return await this.usersService.update(id, dto, userReq);
  }

  @Delete(':id')
  @Auth(PERMISSIONS.users.delete)
  async remove(
    @Param('id') id: string,
  ): Promise<DataRes<null>> {
    return await this.usersService.removeUser(id);
  }

}