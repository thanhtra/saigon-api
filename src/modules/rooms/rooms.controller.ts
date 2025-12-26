import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import {
  PageOptionsDto,
  DataRes,
} from 'src/common/dtos/respones.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/config/permissions';
import { Room } from './entities/rooms.entity';

@Controller('rooms')
@UseGuards(PermissionsGuard)
export class RoomsController {
  constructor(
    private readonly roomsService: RoomsService,
  ) { }

  /* ================= ADMIN ================= */

  @Post()
  @Permissions(PERMISSIONS.rooms.create)
  async create(
    @Body() dto: CreateRoomDto,
    @Req() req,
  ): Promise<DataRes<Room>> {
    return await this.roomsService.create(dto, req.user);
  }

  @Get()
  @Permissions(PERMISSIONS.rooms.read_many)
  async getAll(
    @Query() pageOptions: PageOptionsDto,
  ): Promise<DataRes<any>> {
    return await this.roomsService.getAll(pageOptions);
  }

  @Get('admin/:id')
  @Permissions(PERMISSIONS.rooms.read_one)
  async getOneAdmin(
    @Param('id') id: string,
  ): Promise<DataRes<Room>> {
    return await this.roomsService.getOneAdmin(id);
  }

  @Put(':id')
  @Permissions(PERMISSIONS.rooms.update)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRoomDto,
  ): Promise<DataRes<Room>> {
    return await this.roomsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions(PERMISSIONS.rooms.delete)
  async remove(
    @Param('id') id: string,
  ): Promise<DataRes<boolean>> {
    return await this.roomsService.remove(id);
  }

  /* ================= CUSTOMER ================= */

  @Get('rental/:rental_id')
  async getByRental(
    @Param('rental_id') rental_id: string,
  ): Promise<DataRes<Room[]>> {
    return await this.roomsService.getByRental(rental_id);
  }
}
