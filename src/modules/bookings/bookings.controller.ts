import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/config/permissions';
import { BookingsService } from './bookings.service';
import { DataRes } from 'src/common/dtos/respones.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('bookings')
@UseGuards(PermissionsGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }

  @Post()
  @Permissions(PERMISSIONS.bookings.create)
  create(@Body() dto: CreateBookingDto): Promise<DataRes<any>> {
    return this.bookingsService.create(dto);
  }

  @Get()
  @Permissions(PERMISSIONS.bookings.read)
  getAll(): Promise<DataRes<any>> {
    return this.bookingsService.getAll();
  }

  @Get(':id')
  @Permissions(PERMISSIONS.bookings.read)
  getOne(@Param('id') id: string): Promise<DataRes<any>> {
    return this.bookingsService.getOne(id);
  }

  @Put(':id')
  @Permissions(PERMISSIONS.bookings.update)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBookingDto,
  ): Promise<DataRes<any>> {
    return this.bookingsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions(PERMISSIONS.bookings.delete)
  remove(@Param('id') id: string): Promise<DataRes<any>> {
    return this.bookingsService.remove(id);
  }
}
