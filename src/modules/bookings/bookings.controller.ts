import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { Permissions } from 'src/common/decorators/permissions.decorator';
import { DataRes } from 'src/common/dtos/respones.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { PERMISSIONS } from 'src/config/permissions';

import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';

@Controller('bookings')
@UseGuards(PermissionsGuard)
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
  ) { }

  /* ================= CREATE ================= */

  @Post()
  @Permissions(PERMISSIONS.bookings.create)
  async create(
    @Body() dto: CreateBookingDto,
  ): Promise<DataRes<Booking>> {
    return await this.bookingsService.create(dto);
  }

  /* ================= LIST ================= */

  @Get()
  @Permissions(PERMISSIONS.bookings.read)
  async getAll(): Promise<DataRes<Booking[]>> {
    return await this.bookingsService.getAll();
  }

  /* ================= DETAIL ================= */

  @Get(':id')
  @Permissions(PERMISSIONS.bookings.read)
  async getOne(
    @Param('id') id: string,
  ): Promise<DataRes<Booking>> {
    return await this.bookingsService.getOne(id);
  }

  /* ================= UPDATE ================= */

  @Put(':id')
  @Permissions(PERMISSIONS.bookings.update)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBookingDto,
  ): Promise<DataRes<Booking>> {
    return await this.bookingsService.update(id, dto);
  }

  /* ================= DELETE ================= */

  @Delete(':id')
  @Permissions(PERMISSIONS.bookings.delete)
  async remove(
    @Param('id') id: string,
  ): Promise<DataRes<null>> {
    return await this.bookingsService.remove(id);
  }
}
