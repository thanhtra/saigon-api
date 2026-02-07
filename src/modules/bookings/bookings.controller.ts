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

import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { BookingsService } from './bookings.service';
import {
  CreateBookingDto,
  CreateBookingPublicDto,
} from './dto/create-booking.dto';
import { QueryMyBookingDto } from './dto/query-my-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';
import { QueryCTVBookingDto } from './dto/query-ctv-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
  ) { }


  @Post('customer/register')
  @Public()
  @Throttle(5, 60) // 5 requests / minute / IP
  async customerCreate(
    @Body() dto: CreateBookingPublicDto,
  ): Promise<DataRes<any>> {
    return this.bookingsService.customerCreate(dto);
  }


  @Get('customer/me')
  @Auth()
  async getMyBookings(
    @CurrentUser() user: User,
    @Query() query: QueryMyBookingDto,
  ): Promise<DataRes<PageDto<Booking>>> {
    return this.bookingsService.getMyBookingsByPhone(user.phone, query);
  }

  @Get('customer/ctv')
  @Auth(PERMISSIONS.bookings.ctv_bookings)
  getMyCtvBookings(
    @CurrentUser() user: User,
    @Query() query: QueryCTVBookingDto,
  ) {
    return this.bookingsService.getBookingsByReferrerPhone(
      user.phone,
      query,
    );
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
    return this.bookingsService.getBookings(pageOptionsDto);
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
