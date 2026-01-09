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

import { DataRes } from 'src/common/dtos/respones.dto';
import { PERMISSIONS } from 'src/config/permissions';

import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, CreateBookingPublicDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';

@Controller('bookings')
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
  ) { }


  /* ================= CUSTOMER ================= */

  @Post('register')
  @Public()
  @UseGuards(ThrottlerGuard)
  @Throttle(5, 60)            // 5 lần / 60 giây / IP
  async customerCreate(
    @Body() dto: CreateBookingPublicDto,
  ): Promise<DataRes<any>> {
    return await this.bookingsService.customerCreate(dto);
  }


  /* ================= ADMIN ================= */

  @Post()
  @Auth(PERMISSIONS.bookings.create)
  async create(
    @Body() dto: CreateBookingDto,
  ): Promise<DataRes<Booking>> {
    return await this.bookingsService.create(dto);
  }

  @Get()
  @Auth(PERMISSIONS.bookings.read)
  async getAll(): Promise<DataRes<Booking[]>> {
    return await this.bookingsService.getAll();
  }

  @Get(':id')
  @Auth(PERMISSIONS.bookings.read)
  async getOne(
    @Param('id') id: string,
  ): Promise<DataRes<Booking>> {
    return await this.bookingsService.getOne(id);
  }

  @Put(':id')
  @Auth(PERMISSIONS.bookings.update)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBookingDto,
  ): Promise<DataRes<Booking>> {
    return await this.bookingsService.update(id, dto);
  }

  @Delete(':id')
  @Auth(PERMISSIONS.bookings.delete)
  async remove(
    @Param('id') id: string,
  ): Promise<DataRes<null>> {
    return await this.bookingsService.remove(id);
  }
}
