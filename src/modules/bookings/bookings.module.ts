import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsRepository } from './bookings.repository';
import { BookingsController } from './bookings.controller';
import { Booking } from './entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking])],
  providers: [BookingsService, BookingsRepository],
  controllers: [BookingsController],
  exports: [BookingsService],
})
export class BookingsModule { }
