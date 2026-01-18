import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import {
  DataRes,
  PageDto,
  PageOptionsDto,
} from 'src/common/dtos/respones.dto';
import { PERMISSIONS } from 'src/config/permissions';

import { Throttle } from '@nestjs/throttler';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Public } from 'src/common/decorators/public.decorator';

import { BookingsService } from './bookings.service';
import {
  CreateBookingDto,
  CreateBookingPublicDto,
} from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';

@Controller('bookings')
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
  ) { }

  /* ======================================================
   * CUSTOMER (PUBLIC)
   * ====================================================== */

  @Post('customer/register')
  @Public()
  @Throttle(5, 60) // 5 requests / minute / IP
  async customerCreate(
    @Body() dto: CreateBookingPublicDto,
  ): Promise<DataRes<any>> {
    return this.bookingsService.customerCreate(dto);
  }

  /* ======================================================
   * ADMIN
   * ====================================================== */

  @Post('admintra')
  @Auth(PERMISSIONS.bookings.create)
  async create(
    @Body() dto: CreateBookingDto,
  ): Promise<DataRes<Booking>> {
    return this.bookingsService.create(dto);
  }

  @Get('admintra')
  @Auth(PERMISSIONS.bookings.read)
  async getBookings(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<DataRes<PageDto<Booking>>> {
    return this.bookingsService.getBookings(
      pageOptionsDto,
    );
  }

  @Get(':id/admintra')
  @Auth(PERMISSIONS.bookings.read)
  async getOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DataRes<Booking>> {
    return this.bookingsService.getBooking(id);
  }

  @Put(':id/admintra')
  @Auth(PERMISSIONS.bookings.update)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBookingDto,
  ): Promise<DataRes<Booking>> {
    return this.bookingsService.update(id, dto);
  }

  @Delete(':id/admintra')
  @Auth(PERMISSIONS.bookings.delete)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DataRes<null>> {
    return this.bookingsService.remove(id);
  }
}
