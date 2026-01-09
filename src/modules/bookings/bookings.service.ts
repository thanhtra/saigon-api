import { Injectable } from '@nestjs/common';
import { DataRes } from 'src/common/dtos/respones.dto';
import { BookingStatus } from 'src/common/helpers/enum';
import { BookingsRepository } from './bookings.repository';
import {
  CreateBookingDto,
  CreateBookingPublicDto,
} from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class BookingsService {
  constructor(
    private readonly bookingsRepository: BookingsRepository,
    private readonly usersRepository: UsersRepository
  ) { }

  /* ================= CREATE (PUBLIC) ================= */

  async customerCreate(
    dto: CreateBookingPublicDto,
  ): Promise<DataRes<any>> {
    try {
      const booking = await this.bookingsRepository.create({
        room_id: dto.room_id,
        customer_name: dto.customer_name,
        customer_phone: dto.customer_phone,
        customer_note: dto.customer_note,
        viewing_at: new Date(dto.viewing_at),
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
        error?.message || 'Đặt lịch xem phòng thất bại',
      );
    }
  }


  /* ================= CREATE (ADMIN) ================= */

  async create(dto: CreateBookingDto): Promise<DataRes<Booking>> {
    try {
      const booking = await this.bookingsRepository.create({
        room_id: dto.room_id,
        customer_name: dto.customer_name,
        customer_phone: dto.customer_phone,
        customer_note: dto.customer_note,
        viewing_at: new Date(dto.viewing_at),
        admin_note: dto.admin_note,
        status: dto.status,
      });

      return DataRes.success(booking);
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Tạo lịch xem phòng thất bại',
      );
    }
  }


  /* ================= UPDATE ================= */

  async update(
    id: string,
    dto: UpdateBookingDto,
  ): Promise<DataRes<Booking>> {
    try {
      const updated = await this.bookingsRepository.update(id, {
        room_id: dto.room_id,
        customer_name: dto.customer_name,
        customer_phone: dto.customer_phone,
        customer_note: dto.customer_note,
        viewing_at: dto.viewing_at
          ? new Date(dto.viewing_at)
          : undefined,
        admin_note: dto.admin_note,
        status: dto.status,
      });

      if (!updated) {
        return DataRes.failed(
          'Lịch xem phòng không tồn tại',
        );
      }

      return DataRes.success(updated);
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Cập nhật lịch xem phòng thất bại',
      );
    }
  }

  /* ================= DELETE ================= */

  async remove(id: string): Promise<DataRes<null>> {
    try {
      const success = await this.bookingsRepository.remove(id);
      if (!success) {
        return DataRes.failed(
          'Lịch xem phòng không tồn tại',
        );
      }

      return DataRes.success(null);
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Xóa lịch xem phòng thất bại',
      );
    }
  }

  /* ================= DETAIL ================= */

  async getOne(id: string): Promise<DataRes<Booking>> {
    try {
      const booking = await this.bookingsRepository.findOne(id);
      if (!booking) {
        return DataRes.failed(
          'Không tìm thấy lịch xem phòng',
        );
      }

      return DataRes.success(booking);
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Lấy chi tiết lịch xem phòng thất bại',
      );
    }
  }

  /* ================= LIST ================= */

  async getAll(): Promise<DataRes<Booking[]>> {
    try {
      const bookings = await this.bookingsRepository.findAll({
        viewing_at: 'DESC',
      });

      return DataRes.success(bookings);
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Lấy danh sách lịch xem phòng thất bại',
      );
    }
  }
}
