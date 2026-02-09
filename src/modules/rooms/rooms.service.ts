import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { TransactionService } from 'src/common/database/transaction.service';
import {
  DataRes,
  PageDto
} from 'src/common/dtos/respones.dto';
import { isUnitRental } from 'src/common/helpers/constants';
import { RentalStatus, RoomStatus } from 'src/common/helpers/enum';
import { ErrorResponse, RoomErrorCode } from 'src/common/helpers/errorMessage';
import { generateCode, slugifyVN } from 'src/common/helpers/utils';
import { EntityManager, In, Not } from 'typeorm';
import { Collaborator } from '../collaborators/entities/collaborator.entity';
import { Rental } from '../rentals/entities/rental.entity';
import { Upload } from '../uploads/entities/upload.entity';
import { UploadsService } from '../uploads/uploads.service';
import { User } from '../users/entities/user.entity';
import { CreateRoomDto, CustomerCreateRoomDto } from './dto/create-room.dto';
import { QueryRoomPublicDto } from './dto/query-room-public.dto';
import { QueryRoomDto } from './dto/query-room.dto';
import { CustomerUpdateRoomDto, UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/rooms.entity';
import { RoomsRepository } from './rooms.repository';
import { QueryMyRoomsDto } from './dto/query-my-rooms.dto';

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

          const room = await manager.findOne(Room, {
            where: { id },
            lock: { mode: 'pessimistic_write' },
          });

          if (!room) {
            throw new NotFoundException('Room không tồn tại');
          }

          const rental = await manager.findOne(Rental, {
            where: { id: room.rental_id },
            lock: { mode: 'pessimistic_read' },
          });

          if (!rental) {
            throw new NotFoundException('Rental không tồn tại');
          }

          /* ===== 2. VALIDATE ===== */
          if (dto.price !== undefined && dto.price <= 0) {
            throw new BadRequestException('Giá thuê không hợp lệ');
          }

          const isChangeToAvailable =
            dto.status === RoomStatus.Available &&
            room.status !== RoomStatus.Available;

          if (
            isChangeToAvailable &&
            rental.status === RentalStatus.New
          ) {
            throw new BadRequestException(ErrorResponse(RoomErrorCode.RENTAL_NOT_CONFIRMED));
          }

          const ctvCollaboratorId =
            dto.ctv_collaborator_id === ''
              ? null
              : dto.ctv_collaborator_id;

          manager.merge(Room, room, {
            title: dto.title ?? room.title,
            price: dto.price ?? room.price,
            deposit: dto.deposit ?? room.deposit,
            floor: dto.floor ? Number(dto.floor) : room.floor,
            area: dto.area ?? room.area,
            max_people: dto.max_people ?? room.max_people,
            status: dto.status ?? room.status,
            amenities: dto.amenities ?? room.amenities,
            description: dto.description ?? room.description,
            room_number: dto.room_number ?? room.room_number,
            video_url: dto.video_url ?? room.video_url,
            active: dto.active !== undefined ? dto.active : room.active,
            ctv_collaborator_id:
              dto.ctv_collaborator_id !== undefined
                ? ctvCollaboratorId
                : room.ctv_collaborator_id,
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

          /* ===== UPDATE COVER ===== */
          if (dto?.cover_upload_id) {
            // reset all covers of this room
            await manager.update(
              Upload,
              { room: { id: room.id } },
              { is_cover: false },
            );

            // set new cover
            await manager.update(
              Upload,
              {
                id: dto.cover_upload_id,
                room: { id: room.id },
              },
              { is_cover: true },
            );
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
      const response = error?.response;

      return DataRes.failed(
        response?.message || error?.message || 'Cập nhật phòng thất bại',
        response?.code || '',
      );
    }
  }

  async create(dto: CreateRoomDto): Promise<DataRes<Room>> {
    try {
      const room = await this.transactionService.runInTransaction(
        async (manager) => {

          if (!dto.title) {
            throw new BadRequestException('Tiêu đề phòng là bắt buộc');
          }

          if (dto.price == null || dto.price <= 0) {
            throw new BadRequestException('Giá thuê phải lớn hơn 0');
          }

          const rental = await manager.findOne(Rental, {
            where: { id: dto.rental_id },
            lock: { mode: 'pessimistic_write' },
          });

          if (!rental) {
            throw new NotFoundException('Rental không tồn tại');
          }

          if (!rental.active) {
            throw new BadRequestException(
              'Không thể tạo phòng khi rental đang bị tắt',
            );
          }

          if (isUnitRental(rental.rental_type)) {
            const existingRoom = await manager.findOne(Room, {
              where: { rental_id: rental.id },
              select: ['id'],
            });

            if (existingRoom) {
              throw new BadRequestException(
                'Rental dạng unit chỉ được phép có 1 phòng',
              );
            }
          }

          const roomCode = generateCode();
          const slug = slugifyVN(`${dto.title}-${roomCode}`);

          const room = manager.create(Room, {
            rental_id: rental.id,

            title: dto.title,
            room_code: roomCode,
            slug,

            price: dto.price,
            deposit: dto.deposit,
            status: dto.status ?? RoomStatus.Available,

            floor: dto.floor,
            room_number: dto.room_number,
            area: dto.area,
            max_people: dto.max_people,

            amenities: dto.amenities ?? [],
            description: dto.description,

            video_url: dto.video_url,

            active: rental.active,
          });

          return await manager.save(Room, room);
        },
      );

      return DataRes.success(room);
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Tạo phòng thất bại',
      );
    }
  }

  // CUSTOMER
  async customerCreateRoom(
    dto: CustomerCreateRoomDto,
    user: User,
  ): Promise<DataRes<any>> {
    try {
      const room = await this.transactionService.runInTransaction(
        async (manager) => {

          /* ================= VALIDATE INPUT ================= */
          if (!dto.title?.trim()) {
            throw new BadRequestException('Tiêu đề phòng là bắt buộc');
          }

          if (dto.price == null || dto.price <= 0) {
            throw new BadRequestException('Giá thuê phải lớn hơn 0');
          }

          const collaborator = await this.getActiveCollaboratorOrFail(
            manager,
            user.id,
          );

          /* ================= LOCK RENTAL ================= */
          const rental = await manager.findOne(Rental, {
            where: {
              id: dto.rental_id,
              collaborator_id: collaborator.id,
            },
          });

          if (!rental) {
            throw new NotFoundException(
              'Nhà cho thuê không tồn tại hoặc không thuộc quyền quản lý',
            );
          }

          if (!rental.active) {
            throw new BadRequestException(
              'Không thể tạo phòng khi nhà cho thuê đang bị tắt',
            );
          }

          /* ================= UNIT RENTAL VALIDATION ================= */
          if (isUnitRental(rental.rental_type)) {
            const existingRoom = await manager.findOne(Room, {
              where: { rental_id: rental.id },
              select: ['id'],
            });

            if (existingRoom) {
              throw new BadRequestException(
                'Loại hình này chỉ được phép có 1 phòng',
              );
            }
          }

          /* ================= CREATE ROOM ================= */
          const roomCode = generateCode();
          const slug = slugifyVN(`${dto.title}-${roomCode}`);

          const room = manager.create(Room, {
            rental_id: rental.id,
            title: dto.title.trim(),
            room_code: roomCode,
            slug,
            price: dto.price,
            floor: dto.floor,
            room_number: dto.room_number,
            area: dto.area,
            max_people: dto.max_people,
            amenities: dto.amenities ?? [],
            description: dto.description,
            status: RoomStatus.PendingApproval,
            active: rental.active,
          });

          return await manager.save(Room, room);
        },
      );

      return DataRes.success({ id: room.id });
    } catch (error) {
      return DataRes.failed('Tạo phòng thất bại');
    }
  }

  // CUSTOMER
  async customerUpdate(
    id: string,
    dto: CustomerUpdateRoomDto,
    user: User
  ): Promise<DataRes<any>> {
    try {
      const room = await this.transactionService.runInTransaction(
        async (manager) => {

          /* ===== 1. LOCK ROOM ===== */
          const room = await manager.findOne(Room, {
            where: { id },
            lock: { mode: 'pessimistic_write' },
          });

          if (!room) {
            throw new NotFoundException('Phòng không tồn tại');
          }

          const collaborator = await this.getActiveCollaboratorOrFail(
            manager,
            user.id,
          );

          await manager.findOneOrFail(Rental, {
            where: {
              id: room.rental_id,
              collaborator_id: collaborator.id,
            },
          });

          /* ===== 2. VALIDATE INPUT ===== */
          if (dto.price !== undefined && dto.price <= 0) {
            throw new BadRequestException('Giá thuê không hợp lệ');
          }

          /* ===== 2. VALIDATE STATUS ===== */
          if (dto.status !== undefined) {

            // 1. Không cho đổi khi đang chờ duyệt
            if (room.status === RoomStatus.PendingApproval) {
              throw new BadRequestException(
                'Phòng đang chờ xét duyệt, không thể thay đổi trạng thái',
              );
            }

            // 2. Không cho đổi ngược về PendingApproval
            if (dto.status === RoomStatus.PendingApproval) {
              throw new BadRequestException(
                'Không thể chuyển phòng về trạng thái chờ xét duyệt',
              );
            }
          }

          /* ===== 3. UPDATE ROOM (LIMITED FIELDS) ===== */
          manager.merge(Room, room, {
            title: dto.title ?? room.title,
            price: dto.price ?? room.price,
            area: dto.area ?? room.area,
            max_people: dto.max_people ?? room.max_people,
            amenities: dto.amenities ?? room.amenities,
            description: dto.description ?? room.description,
            status: dto.status ?? room.status,
          });

          await manager.save(room);

          /* ===== 6. LOAD UPLOADS FOR RESPONSE ===== */
          room.uploads = await manager.find(Upload, {
            where: { room: { id: room.id } },
          });

          return room;
        },
      );

      return DataRes.success({ id: room.id });
    } catch (error) {
      return DataRes.failed('Cập nhật phòng thất bại');
    }
  }

  async getRooms(
    query: QueryRoomDto,
  ): Promise<DataRes<PageDto<Room>>> {
    try {
      const data = await this.roomsRepository.getRooms(query);
      return DataRes.success(data);
    } catch (error) {
      // log thật sự (quan trọng)
      console.error('[RoomsService][getRooms]', error);

      return DataRes.failed('Lấy danh sách phòng thất bại');
    }
  }

  async getOneAdmin(
    id: string,
  ): Promise<DataRes<Room>> {
    try {
      const room = await this.roomsRepository.getOneAdmin(id);
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

  async remove(id: string): Promise<DataRes<boolean>> {
    /**
     * Danh sách file & folder cần xoá sau transaction
     */
    const uploadFilePaths: string[] = [];
    const roomFolderPaths = new Set<string>();

    try {
      await this.transactionService.runInTransaction(async (manager) => {
        /* ===== 1. Lấy room ===== */
        const room = await manager.findOne(Room, {
          where: { id },
          lock: { mode: 'pessimistic_write' },
        });

        if (!room) {
          throw new NotFoundException('Phòng không tồn tại');
        }

        /* ===== 2. Thu thập uploads ===== */
        const uploads = await manager.find(Upload, {
          where: { room_id: id },
          select: ['id', 'file_path'],
        });

        uploads.forEach(u => uploadFilePaths.push(u.file_path));

        /* ===== 3. Thu thập folder room ===== */
        roomFolderPaths.add(`/rooms/${id}`);

        /* ===== 4. Xoá uploads (DB) ===== */
        if (uploads.length) {
          await manager.delete(
            Upload,
            uploads.map(u => u.id),
          );
        }

        /* ===== 5. Xoá room ===== */
        await manager.delete(Room, { id });
      });

      /* ===== 6. Xoá file vật lý ===== */
      for (const filePath of uploadFilePaths) {
        try {
          await this.uploadsService.removeFile(filePath);
        } catch (err) {
          console.error(`Không xoá được file: ${filePath}`, err);
        }
      }

      /* ===== 7. Xoá folder room ===== */
      for (const folderPath of roomFolderPaths) {
        try {
          await this.uploadsService.removeFolder(folderPath);
        } catch (err) {
          console.error(`Không xoá được folder: ${folderPath}`, err);
        }
      }

      return DataRes.success(true);
    } catch (error) {
      console.error(error);
      return DataRes.failed(
        error?.message || 'Xoá phòng thất bại',
      );
    }
  }


  // CUSTOMER

  async getMyRooms(
    user: User,
    query: QueryMyRoomsDto,
  ): Promise<DataRes<PageDto<any>>> {
    try {
      const data = await this.roomsRepository.getMyRooms(
        user.id,
        query,
      );

      return DataRes.success(data);
    } catch (error) {
      return DataRes.failed('Lấy danh sách phòng thất bại');
    }
  }

  /* ================= CUSTOMER / COMMON ================= */

  // async getByRental(
  //   rental_id: string,
  // ): Promise<DataRes<Room[]>> {
  //   try {
  //     const rooms = await this.roomsRepository.findByRental(
  //       rental_id,
  //     );
  //     return DataRes.success(rooms);
  //   } catch (error) {
  //     return DataRes.failed(
  //       'Lấy danh sách phòng theo nhà thất bại',
  //     );
  //   }
  // }

  /* ================= CUSTOMER ================= */

  async getPublicRooms(
    query: QueryRoomPublicDto,
  ): Promise<DataRes<PageDto<any>>> {
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

  private async getActiveCollaboratorOrFail(
    manager: EntityManager,
    userId: string,
  ): Promise<Collaborator> {
    const collaborator = await manager.findOne(Collaborator, {
      where: {
        user_id: userId,
        active: true,
        is_blacklisted: false,
      },
      select: ['id', 'user_id', 'active', 'is_blacklisted'],
    });

    if (!collaborator) {
      throw new ForbiddenException(
        'Tài khoản không có quyền tạo phòng cho thuê',
      );
    }

    return collaborator;
  }


}
