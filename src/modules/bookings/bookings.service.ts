import { Injectable } from '@nestjs/common';
import { BookingsRepository } from './bookings.repository';
import { DataRes } from 'src/common/dtos/respones.dto';
import { CreateBookingDto, CreateBookingPublicDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';
import { BookingStatus } from 'src/common/helpers/enum';

@Injectable()
export class BookingsService {
  constructor(private readonly bookingsRepository: BookingsRepository) { }

  async create(dto: CreateBookingDto): Promise<DataRes<Booking>> {
    const booking = await this.bookingsRepository.create({
      room_id: dto.room_id,
      guide: { id: dto.guide_id } as any, // hoặc load entity trước
      customer_name: dto.customer_name,
      customer_phone: dto.customer_phone,
      customer_note: dto.customer_note,
      viewing_at: new Date(dto.viewing_at), // ✅ FIX
      note: dto.note,
      status: dto.status,
    });

    return DataRes.success(booking);
  }

  async createPublic(dto: CreateBookingPublicDto): Promise<DataRes<Booking>> {
    const booking = await this.bookingsRepository.create({
      room_id: dto.room_id,
      customer_name: dto.customer_name,
      customer_phone: dto.customer_phone,
      customer_note: dto.customer_note,
      viewing_at: new Date(dto.viewing_at),
      status: BookingStatus.PENDING,
    });

    return DataRes.success(booking);
  }


  async update(id: string, dto: UpdateBookingDto): Promise<DataRes<Booking>> {
    const updated = await this.bookingsRepository.update(id, {
      room_id: dto.room_id,
      guide: { id: dto.guide_id } as any, // hoặc load entity trước
      customer_name: dto.customer_name,
      customer_phone: dto.customer_phone,
      customer_note: dto.customer_note,
      viewing_at: new Date(dto.viewing_at), // ✅ FIX
      note: dto.note,
      status: dto.status,
    });
    if (!updated) return DataRes.failed('Cập nhật lịch xem phòng thất bại');
    return DataRes.success(updated);
  }

  async remove(id: string): Promise<DataRes<{ id: string }>> {
    const success = await this.bookingsRepository.remove(id);
    if (!success) return DataRes.failed('Xóa lịch xem phòng thất bại');
    return DataRes.success({ id });
  }

  async getOne(id: string): Promise<DataRes<Booking>> {
    const booking = await this.bookingsRepository.findOne(id);
    if (!booking) return DataRes.failed('Không tìm thấy lịch xem phòng');
    return DataRes.success(booking);
  }

  async getAll(): Promise<DataRes<Booking[]>> {
    const bookings = await this.bookingsRepository.findAll({
      viewing_at: 'DESC',
    });
    return DataRes.success(bookings);
  }
}
