import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TransactionService } from 'src/common/database/transaction.service';
import {
  DataRes,
  PageDto,
  PageOptionsDto,
} from 'src/common/dtos/respones.dto';
import { RoomStatus } from 'src/common/helpers/enum';
import { generateRoomCode, slugifyVN } from 'src/common/helpers/utils';
import { In, IsNull, Not } from 'typeorm';
import { Upload } from '../uploads/entities/upload.entity';
import { UploadsService } from '../uploads/uploads.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { QueryRoomPublicDto } from './dto/query-room-public.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/rooms.entity';
import { RoomsRepository } from './rooms.repository';

@Injectable()
export class RoomsService {
  constructor(
    private readonly roomsRepository: RoomsRepository,
    private readonly transactionService: TransactionService,
    private readonly uploadsService: UploadsService
  ) { }

  /* ================= ADMIN ================= */

  async update(
    id: string,
    dto: UpdateRoomDto,
  ): Promise<DataRes<Room>> {
    try {
      const room = await this.transactionService.runInTransaction(
        async (manager) => {
          /* ===== 1. LOCK ROOM (NO RELATIONS) ===== */
          const room = await manager.findOne(Room, {
            where: { id },
            lock: { mode: 'pessimistic_write' },
          });

          if (!room) {
            throw new NotFoundException('Room không tồn tại');
          }

          /* ===== 2. VALIDATE ===== */
          if (dto.price !== undefined && dto.price <= 0) {
            throw new BadRequestException('Giá thuê không hợp lệ');
          }

          if (dto.cover_index !== undefined && dto.cover_index < 0) {
            throw new BadRequestException('cover_index không hợp lệ');
          }

          const coverIndex = dto.cover_index !== undefined &&
            dto.upload_ids?.length &&
            dto.cover_index >= dto.upload_ids.length
            ? 0
            : dto.cover_index;


          /* ===== 3. UPDATE ROOM ===== */
          manager.merge(Room, room, {
            title: dto.title ?? room.title,
            price: dto.price ?? room.price,
            area: dto.area ?? room.area,
            max_people: dto.max_people ?? room.max_people,
            status: dto.status ?? room.status,
            amenities: dto.amenities ?? room.amenities,
            description: dto.description ?? room.description,
            active: dto.active !== undefined ? dto.active : room.active,
            cover_index: coverIndex !== undefined ? coverIndex : room.cover_index,
          });

          await manager.save(room);

          /* ===== 4. DELETE UPLOADS ===== */
          if (dto.delete_upload_ids?.length) {
            const uploadsToDelete = await manager.find(Upload, {
              where: {
                id: In(dto.delete_upload_ids),
                room: { id: room.id },
              },
            });

            for (const upload of uploadsToDelete) {
              await this.uploadsService.removeFile(upload.file_path);
            }

            await manager.delete(
              Upload,
              uploadsToDelete.map(u => u.id),
            );
          }


          /* ===== ASSIGN UPLOADS (SOURCE OF TRUTH) ===== */
          if (dto.upload_ids !== undefined) {
            if (dto.upload_ids.length === 0) {
              // remove all uploads from room
              await manager.update(
                Upload,
                { room: { id: room.id } },
                { room: null },
              );
            } else {
              // detach uploads not in list
              await manager.update(
                Upload,
                {
                  room: { id: room.id },
                  id: Not(In(dto.upload_ids)),
                },
                { room: null },
              );

              // attach uploads in list (idempotent)
              await manager.update(
                Upload,
                {
                  id: In(dto.upload_ids),
                },
                { room },
              );
            }
          }


          /* ===== 6. LOAD RELATIONS FOR RESPONSE ===== */
          room.uploads = await manager.find(Upload, {
            where: { room: { id: room.id } },
          });

          return room;
        },
      );

      return DataRes.success(room);
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Cập nhật phòng thất bại',
      );
    }
  }


  async create(dto: CreateRoomDto): Promise<DataRes<Room>> {
    try {
      if (!dto.title) {
        throw new BadRequestException('Tiêu đề phòng là bắt buộc');
      }
      if (dto.price == null || dto.price <= 0) {
        throw new BadRequestException('Giá thuê phải lớn hơn 0');
      }

      const room = await this.transactionService.runInTransaction(
        async (manager) => {
          const roomCode = generateRoomCode();
          const slug = slugifyVN(`${dto.title}-${roomCode}`);

          return await manager.save(
            Room,
            manager.create(Room, {
              rental_id: dto.rental_id,
              title: dto.title,
              room_code: roomCode,
              slug,
              price: dto.price,
              status: dto.status ?? RoomStatus.Available,
              floor: dto.floor,
              room_number: dto.room_number,
              area: dto.area,
              max_people: dto.max_people,
              amenities: dto.amenities ?? [],
              description: dto.description,
              cover_index: dto.cover_index ?? 0,
              active: dto.active ?? true,
            }),
          );
        },
      );

      return DataRes.success(room);
    } catch (error) {
      return DataRes.failed(error?.message || 'Tạo phòng thất bại');
    }
  }


  async remove(id: string): Promise<DataRes<boolean>> {
    try {
      const result = await this.transactionService.runInTransaction(async (manager) => {
        // 1. Lấy phòng kèm uploads
        const room = await manager.findOne(Room, {
          where: { id },
          relations: ['uploads'],
          lock: { mode: 'pessimistic_write' },
        });

        if (!room) {
          throw new NotFoundException('Phòng không tồn tại');
        }

        // 2. Xoá tất cả file uploads
        for (const upload of room.uploads) {
          try {
            await this.uploadsService.removeFile(upload.file_path);
          } catch (err) {
            console.error(`Xoá file thất bại: ${upload.file_path}`, err);
            // Không throw để tránh block toàn bộ transaction, nhưng log lại
          }
        }

        // 3. Xoá bản ghi uploads trong DB
        if (room.uploads.length) {
          await manager.delete(Upload, room.uploads.map(u => u.id));
        }

        // 4. Xoá phòng
        await manager.delete(Room, id);

        return true;
      });

      return DataRes.success(result);
    } catch (error) {
      console.error(error);
      return DataRes.failed(error?.message || 'Xoá phòng thất bại');
    }
  }






  /* ================= chua su dung ================= */




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
        'Lấy danh sách phòng thất bại',
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
        'Lấy chi tiết phòng thất bại',
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
        'Lấy danh sách phòng theo nhà thất bại',
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
        'Lấy danh sách phòng thất bại',
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
        'Lấy room detail thất bại',
      );
    }

  }

}
