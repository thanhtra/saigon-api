import { Injectable } from '@nestjs/common';
import { RoomsRepository } from './rooms.repository';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import {
  PageOptionsDto,
  DataRes,
  PageDto,
} from 'src/common/dtos/respones.dto';
import { Room } from './entities/rooms.entity';
import { QueryRoomPublicDto } from './dto/query-room-public.dto';

@Injectable()
export class RoomsService {
  constructor(
    private readonly roomsRepository: RoomsRepository,
  ) { }

  /* ================= ADMIN ================= */

  async create(
    dto: CreateRoomDto,
    user: any,
  ): Promise<DataRes<Room>> {
    try {
      const room = await this.roomsRepository.create(dto, user);
      return DataRes.success(room);
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Tạo phòng thất bại',
      );
    }
  }

  async update(
    id: string,
    dto: UpdateRoomDto,
  ): Promise<DataRes<Room>> {
    try {
      const room = await this.roomsRepository.update(id, dto);
      if (!room) {
        return DataRes.failed('Phòng không tồn tại');
      }
      return DataRes.success(room);
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Cập nhật phòng thất bại',
      );
    }
  }

  async remove(
    id: string,
  ): Promise<DataRes<boolean>> {
    try {
      const success = await this.roomsRepository.remove(id);
      if (!success) {
        return DataRes.failed('Phòng không tồn tại');
      }
      return DataRes.success(true);
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Xóa phòng thất bại',
      );
    }
  }

  async getAll(
    pageOptions: PageOptionsDto,
  ): Promise<DataRes<PageDto<Room>>> {
    try {
      const data = await this.roomsRepository.findAll(
        pageOptions,
      );
      return DataRes.success(data);
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Lấy danh sách phòng thất bại',
      );
    }
  }

  async getOneAdmin(
    id: string,
  ): Promise<DataRes<Room>> {
    try {
      const room = await this.roomsRepository.findOne(id);
      if (!room) {
        return DataRes.failed('Phòng không tồn tại');
      }
      return DataRes.success(room);
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Lấy chi tiết phòng thất bại',
      );
    }
  }

  /* ================= CUSTOMER / COMMON ================= */

  async getByRental(
    rental_id: string,
  ): Promise<DataRes<Room[]>> {
    try {
      const rooms = await this.roomsRepository.findByRental(
        rental_id,
      );
      return DataRes.success(rooms);
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Lấy danh sách phòng theo nhà thất bại',
      );
    }
  }

  /* ================= CUSTOMER ================= */

  async getPublicRooms(
    query: QueryRoomPublicDto,
  ): Promise<DataRes<PageDto<Room>>> {
    try {
      const page = await this.roomsRepository.findPublicRooms(query);
      return DataRes.success(page);
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Lấy danh sách phòng thất bại',
      );
    }
  }

  async getPublicRoomBySlug(slug: string): Promise<DataRes<Room>> {
    try {
      const room = await this.roomsRepository.findPublicRoomBySlug(slug);

      if (!room) {
        return DataRes.failed('Room not found');
      }

      return DataRes.success(room);
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Lấy room detail thất bại',
      );
    }

  }

}
