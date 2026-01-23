import { Injectable } from '@nestjs/common';
import { DataRes, PageDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { BookingStatus } from 'src/common/helpers/enum';
import { ErrorMes } from 'src/common/helpers/errorMessage';
import { UsersRepository } from '../users/users.repository';
import { BookingsRepository } from './bookings.repository';
import {
  CreateBookingDto,
  CreateBookingPublicDto,
} from './dto/create-booking.dto';
import { QueryMyBookingDto } from './dto/query-my-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingsService {
  constructor(
    private readonly bookingsRepository: BookingsRepository,
    private readonly usersRepository: UsersRepository
  ) { }


  async create(
    dto: CreateBookingDto,
  ): Promise<DataRes<Booking>> {
    try {
      const booking = await this.bookingsRepository.createBooking({
        rental_id: dto.rental_id,
        room_id: dto.room_id,
        customer_name: dto.customer_name.trim(),
        customer_phone: dto.customer_phone.trim(),
        referrer_phone: dto.referrer_phone?.trim() || null,
        customer_note: dto.customer_note,
        admin_note: dto.admin_note,
        viewing_at: dto.viewing_at,
        status: dto.status ?? BookingStatus.Pending,
      });

      return DataRes.success(booking);
    } catch (error) {
      return DataRes.failed(ErrorMes.BOOKING_CREATE);
    }
  }

  async update(
    id: string,
    dto: UpdateBookingDto,
  ): Promise<DataRes<Booking>> {
    try {
      const detail = await this.bookingsRepository.findOneBooking(id);
      if (!detail) {
        return DataRes.failed(ErrorMes.BOOKING_UPDATE);
      }

      const booking = await this.bookingsRepository.updateBooking(
        id,
        {
          rental_id: dto.rental_id ?? detail.rental_id,
          room_id: dto.room_id ?? detail.room_id,
          customer_name: dto.customer_name ?? detail?.customer_name,
          customer_phone: dto.customer_phone ?? detail?.customer_phone,
          referrer_phone: dto.referrer_phone ?? detail?.referrer_phone,
          customer_note: dto.customer_note ?? detail?.customer_note,
          admin_note: dto.admin_note ?? detail?.admin_note,
          viewing_at: dto.viewing_at ?? detail?.viewing_at,
          status: dto.status ?? detail?.status,
        },
      );

      if (!booking) {
        return DataRes.failed(ErrorMes.BOOKING_UPDATE);
      }

      return DataRes.success(booking);
    } catch (error) {
      return DataRes.failed(ErrorMes.BOOKING_UPDATE);
    }
  }

  async getBooking(
    id: string,
  ): Promise<DataRes<Booking>> {
    try {
      const booking = await this.bookingsRepository.findOneBooking(id);

      if (!booking) {
        return DataRes.failed(ErrorMes.BOOKING_GET_DETAIL);
      }

      return DataRes.success(booking);
    } catch (error) {
      return DataRes.failed(ErrorMes.BOOKING_GET_DETAIL);
    }
  }

  async getBookings(
    pageOptionsDto: PageOptionsDto,
  ): Promise<DataRes<PageDto<Booking>>> {
    try {
      const bookings = await this.bookingsRepository.getBookings(pageOptionsDto);

      return DataRes.success(bookings);
    } catch (error) {
      return DataRes.failed(ErrorMes.BOOKING_GET_LIST);
    }
  }

  async remove(id: string): Promise<DataRes<null>> {
    try {
      const removed = await this.bookingsRepository.removeBooking(id);

      if (!removed) {
        return DataRes.failed(ErrorMes.BOOKING_REMOVE);
      }

      return DataRes.success(null);
    } catch (error) {
      return DataRes.failed(ErrorMes.BOOKING_REMOVE);
    }
  }

  // CUSTOMER

  async customerCreate(
    dto: CreateBookingPublicDto,
  ): Promise<DataRes<any>> {
    try {
      const booking = await this.bookingsRepository.createBooking({
        room_id: dto.room_id,
        rental_id: dto.rental_id,
        customer_name: dto.customer_name,
        customer_phone: dto.customer_phone.trim(),
        customer_note: dto.customer_note,
        viewing_at: dto.viewing_at,
        referrer_phone: dto.referrer_phone ? dto.referrer_phone.trim() : null,
        status: BookingStatus.Pending,
      });

      const user = await this.usersRepository.findOneUserByPhone(dto.customer_phone);

      return DataRes.success({
        ...booking,
        user_exists: !!user,
        prefill: user ? null : {
          name: dto.customer_name,
          phone: dto.customer_phone
        }
      });
    } catch (error) {
      return DataRes.failed(
        'Đặt lịch xem phòng thất bại',
      );
    }
  }

  async getMyBookingsByPhone(
    phone: string,
    query: QueryMyBookingDto,
  ): Promise<DataRes<PageDto<Booking>>> {
    try {
      const bookings = await this.bookingsRepository.getMyBookingsByPhone(phone, query);

      return DataRes.success(bookings);
    } catch (error) {
      return DataRes.failed(ErrorMes.BOOKING_GET_LIST);
    }
  }


}
