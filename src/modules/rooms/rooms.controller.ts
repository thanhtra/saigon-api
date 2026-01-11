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
import { Public } from 'src/common/decorators/public.decorator';
import {
  DataRes,
  PageDto,
  PageOptionsDto,
} from 'src/common/dtos/respones.dto';
import { PERMISSIONS } from 'src/config/permissions';
import { CreateRoomDto } from './dto/create-room.dto';
import { QueryRoomPublicDto } from './dto/query-room-public.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/rooms.entity';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(
    private readonly roomsService: RoomsService,
  ) { }

  /* ================= CUSTOMER ================= */

  @Get('rental/:rental_id')
  @Public()
  async getByRental(
    @Param('rental_id') rental_id: string,
  ): Promise<DataRes<Room[]>> {
    return await this.roomsService.getByRental(rental_id);
  }


  @Get('public')
  @Public()
  async getPublicRooms(
    @Query() query: QueryRoomPublicDto,
  ): Promise<DataRes<PageDto<Room>>> {
    return await this.roomsService.getPublicRooms(query);
  }

  @Get('public/:slug')
  @Public()
  async getRoomBySlug(
    @Param('slug') slug: string,
  ): Promise<DataRes<Room>> {
    return await this.roomsService.getPublicRoomBySlug(slug);
  }




  /* ================= ADMIN ================= */

  @Put(':id')
  @Auth(PERMISSIONS.rooms.update)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRoomDto,
  ): Promise<DataRes<Room>> {
    return await this.roomsService.update(id, dto);
  }






  /* ================= chua su dung ================= */



  @Post()
  @Auth(PERMISSIONS.rooms.create)
  async create(
    @Body() dto: CreateRoomDto
  ): Promise<DataRes<Room>> {
    return await this.roomsService.create(dto);
  }





  @Get()
  @Auth(PERMISSIONS.rooms.read_many)
  async getAll(
    @Query() pageOptions: PageOptionsDto,
  ): Promise<DataRes<any>> {
    return await this.roomsService.getAll(pageOptions);
  }

  @Get('admin/:id')
  @Auth(PERMISSIONS.rooms.read_one)
  async getOneAdmin(
    @Param('id') id: string,
  ): Promise<DataRes<Room>> {
    return await this.roomsService.getOneAdmin(id);
  }


  @Delete(':id')
  @Auth(PERMISSIONS.rooms.delete)
  async remove(
    @Param('id') id: string,
  ): Promise<DataRes<boolean>> {
    return await this.roomsService.remove(id);
  }

}
