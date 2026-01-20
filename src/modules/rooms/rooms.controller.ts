import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { Auth } from 'src/common/decorators/auth.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import {
  DataRes,
  PageDto
} from 'src/common/dtos/respones.dto';
import { PERMISSIONS } from 'src/config/permissions';
import { User } from '../users/entities/user.entity';
import { CreateRoomDto, CustomerCreateRoomDto } from './dto/create-room.dto';
import { QueryRoomPublicDto } from './dto/query-room-public.dto';
import { QueryRoomDto } from './dto/query-room.dto';
import { CustomerUpdateRoomDto, UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/rooms.entity';
import { RoomsService } from './rooms.service';
import { QueryMyRoomsDto } from './dto/query-my-rooms.dto';

@Controller('rooms')
export class RoomsController {
  constructor(
    private readonly roomsService: RoomsService,
  ) { }



  @Post('admintra')
  @Auth(PERMISSIONS.rooms.create)
  async create(
    @Body() dto: CreateRoomDto
  ): Promise<DataRes<Room>> {
    return await this.roomsService.create(dto);
  }

  // CUSTOMER
  @Post('customer')
  @Auth(PERMISSIONS.rooms.customer_create)
  async customerCreateRoom(
    @Body() dto: CustomerCreateRoomDto,
    @CurrentUser() user: User,
  ): Promise<DataRes<any>> {
    return await this.roomsService.customerCreateRoom(dto, user);
  }

  @Get('customer/my')
  @Auth(PERMISSIONS.rooms.my_rooms)
  async getMyRooms(
    @CurrentUser() user: User,
    @Query() query: QueryMyRoomsDto,
  ): Promise<DataRes<PageDto<any>>> {
    return this.roomsService.getMyRooms(user, query);
  }

  // CUSTOMER
  @Get('customer')
  @Public()
  async getPublicRooms(
    @Query() query: QueryRoomPublicDto,
  ): Promise<DataRes<PageDto<any>>> {
    return await this.roomsService.getPublicRooms(query);
  }

  // CUSTOMER
  @Get('customer/:slug')
  @Public()
  async getRoomBySlug(
    @Param('slug') slug: string,
  ): Promise<DataRes<Room>> {
    return await this.roomsService.getPublicRoomBySlug(slug);
  }

  @Get('admintra')
  @Auth(PERMISSIONS.rooms.read_many)
  async getRooms(
    @Query() query: QueryRoomDto,
  ): Promise<DataRes<PageDto<Room>>> {
    return this.roomsService.getRooms(query);
  }

  @Get(':id/admintra')
  @Auth(PERMISSIONS.rooms.read_one)
  async getOneAdmin(
    @Param('id') id: string,
  ): Promise<DataRes<Room>> {
    return await this.roomsService.getOneAdmin(id);
  }

  @Put(':id/admintra')
  @Auth(PERMISSIONS.rooms.update)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRoomDto,
  ): Promise<DataRes<Room>> {
    return await this.roomsService.update(id, dto);
  }

  // CUSTOMER
  @Put(':id/customer')
  @Auth(PERMISSIONS.rooms.customer_update)
  async customerUpdate(
    @Param('id') id: string,
    @Body() dto: CustomerUpdateRoomDto,
    @CurrentUser() user: User,
  ): Promise<DataRes<any>> {
    return await this.roomsService.customerUpdate(id, dto, user);
  }

  @Delete(':id/admintra')
  @Auth(PERMISSIONS.rooms.delete)
  async remove(
    @Param('id') id: string,
  ): Promise<DataRes<boolean>> {
    return await this.roomsService.remove(id);
  }



  // CUSTOMER
  // @Get('customer/:rental_id/rental')
  // @Public()
  // async getByRental(
  //   @Param('rental_id') rentalId: string,
  // ): Promise<DataRes<Room[]>> {
  //   return await this.roomsService.getByRental(rentalId);
  // }

}
