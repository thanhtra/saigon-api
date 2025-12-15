import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PageOptionsDto, DataRes } from 'src/common/dtos/respones.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/config/permissions';
import { Room } from './entities/rooms.entity';

@Controller('rooms')
@UseGuards(PermissionsGuard)
export class RoomsController {
  constructor(private roomsService: RoomsService) { }

  // ---------- ADMIN ----------
  @Post()
  @Permissions(PERMISSIONS.rooms.create)
  create(@Body() dto: CreateRoomDto): Promise<DataRes<Room>> {
    return this.roomsService.create(dto);
  }

  @Get()
  @Permissions(PERMISSIONS.rooms.read_many)
  getAll(@Query() pageOptions: PageOptionsDto): Promise<DataRes<any>> {
    return this.roomsService.getAll(pageOptions);
  }

  @Get('admin/:id')
  @Permissions(PERMISSIONS.rooms.read_one)
  getOneAdmin(@Param('id') id: string): Promise<DataRes<Room>> {
    return this.roomsService.getOne(id);
  }

  @Put(':id')
  @Permissions(PERMISSIONS.rooms.update)
  update(@Param('id') id: string, @Body() dto: UpdateRoomDto): Promise<DataRes<Room>> {
    return this.roomsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions(PERMISSIONS.rooms.delete)
  remove(@Param('id') id: string): Promise<DataRes<{ id: string }>> {
    return this.roomsService.remove(id);
  }

  // ---------- CUSTOMER ----------
  @Get('rental/:rental_id')
  getByRental(@Param('rental_id') rental_id: string): Promise<DataRes<Room[]>> {
    return this.roomsService.getByRental(rental_id);
  }
}
