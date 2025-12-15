import { Injectable } from '@nestjs/common';
import { RoomsRepository } from './rooms.repository';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { DataRes, PageDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { Room } from './entities/rooms.entity';

@Injectable()
export class RoomsService {
  constructor(private roomsRepository: RoomsRepository) { }

  private async handle<T>(callback: () => Promise<T>, errorMessage: string): Promise<DataRes<T>> {
    try {
      const data = await callback();
      if (!data) return DataRes.failed(errorMessage);
      return DataRes.success(data);
    } catch (error) {
      return DataRes.failed(error?.message || errorMessage);
    }
  }

  // Admin
  create(dto: CreateRoomDto): Promise<DataRes<Room>> {
    return this.handle(() => this.roomsRepository.create(dto), 'Tạo phòng thất bại');
  }

  update(id: string, dto: UpdateRoomDto): Promise<DataRes<Room>> {
    return this.handle(() => this.roomsRepository.update(id, dto), 'Cập nhật phòng thất bại');
  }


  // ---------------- DELETE ----------------
  remove(id: string): Promise<DataRes<{ id: string }>> {
    return this.handle(async () => {
      const success = await this.roomsRepository.remove(id);
      if (!success) return undefined;
      return { id };
    }, 'Xóa phòng thất bại');
  }

  getAll(pageOptions: PageOptionsDto): Promise<DataRes<PageDto<Room>>> {
    return this.handle(() => this.roomsRepository.findAll(pageOptions), 'Lấy danh sách phòng thất bại');
  }

  getOne(id: string): Promise<DataRes<Room>> {
    return this.handle(() => this.roomsRepository.findOne(id), 'Lấy chi tiết phòng thất bại');
  }

  // Customer
  getByRental(rental_id: string): Promise<DataRes<Room[]>> {
    return this.handle(() => this.roomsRepository.findByRental(rental_id), 'Lấy phòng theo rental thất bại');
  }
}
