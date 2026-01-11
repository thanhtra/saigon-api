import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TransactionService } from 'src/common/database/transaction.service';
import {
  DataRes,
  PageDto,
  PageOptionsDto,
} from 'src/common/dtos/respones.dto';
import { isUnitRental } from 'src/common/helpers/constants';
import { RoomStatus } from 'src/common/helpers/enum';
import { generateRoomCode, slugifyVN } from 'src/common/helpers/utils';
import { Room } from '../rooms/entities/rooms.entity';
import { User } from '../users/entities/user.entity';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { Rental } from './entities/rental.entity';
import { RentalsRepository } from './rentals.repository';
import { Collaborator } from '../collaborators/entities/collaborator.entity';

@Injectable()
export class RentalsService {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly rentalsRepository: RentalsRepository,
  ) { }

  /* ================= ADMIN ================= */
  async getListRentals(
    pageOptions: PageOptionsDto,
  ): Promise<DataRes<PageDto<Rental>>> {
    try {
      const data = await this.rentalsRepository.getListRentals(
        pageOptions,
      );

      return DataRes.success(data);
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Lấy danh sách rental thất bại',
      );
    }
  }

  async create(
    dto: CreateRentalDto,
    user: User,
  ): Promise<DataRes<any>> {
    try {
      const result = await this.transactionService.runInTransaction(
        async (manager) => {
          const rental = await manager.save(
            Rental,
            manager.create(Rental, {
              collaborator_id: dto.collaborator_id,
              created_by: user.id,

              rental_type: dto.rental_type,
              province: dto.province,
              district: dto.district,
              ward: dto.ward,
              street: dto.street,
              house_number: dto.house_number,
              address_detail: dto.address_detail,
              address_detail_display: dto.address_detail_display,

              commission_value: dto.commission_value,
              description: dto.description,
              active: dto.active,

              status: dto.status
            }),
          );

          let room: Room | null = null;

          if (isUnitRental(dto.rental_type)) {
            if (dto.price == null) {
              throw new BadRequestException('Giá thuê là bắt buộc');
            }

            const roomCode = generateRoomCode();

            room = await manager.save(
              Room,
              manager.create(Room, {
                rental_id: rental.id,

                title: dto.title,
                room_code: roomCode,
                slug: slugifyVN(`${dto.title}-${roomCode}`),

                price: dto.price,
                status: RoomStatus.Available,

                floor: dto.floor,
                room_number: dto.room_number,
                area: dto.area,
                max_people: dto.max_people,

                amenities: dto.amenities,
                description: dto.description_detail,
                active: true,
              }),
            );
          }

          return {
            rental,
            room,
          };
        },
      );

      return DataRes.success(result);
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Tạo rental thất bại',
      );
    }
  }

  async findOneAdmin(id: string): Promise<DataRes<Rental>> {
    try {
      const rental = await this.rentalsRepository.findOneAdmin(id);

      if (!rental) {
        return DataRes.failed('Rental không tồn tại');
      }

      return DataRes.success(rental);
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Lấy chi tiết rental thất bại',
      );
    }
  }

  async update(
    id: string,
    dto: UpdateRentalDto,
  ): Promise<DataRes<any>> {
    try {
      const result = await this.transactionService.runInTransaction(
        async (manager) => {
          /* ================= FIND RENTAL (LOCK) ================= */
          const rental = await manager.findOne(Rental, {
            where: { id },
            lock: { mode: 'pessimistic_write' },
          });

          if (!rental) {
            throw new NotFoundException('Rental không tồn tại');
          }

          /* ================= LOAD ROOMS ================= */
          const rooms = await manager.find(Room, {
            where: { rental_id: rental.id },
          });

          rental.rooms = rooms;


          /* ================= UPDATE RENTAL ================= */
          await manager.update(Rental, id, {
            collaborator_id: dto.collaborator_id ?? rental.collaborator_id,

            province: dto.province ?? rental.province,
            district: dto.district ?? rental.district,
            ward: dto.ward ?? rental.ward,
            street: dto.street ?? rental.street,
            house_number: dto.house_number ?? rental.house_number,

            address_detail: dto.address_detail ?? rental.address_detail,
            address_detail_display:
              dto.address_detail_display ?? rental.address_detail_display,

            commission_value: dto.commission_value ?? rental.commission_value,
            description: dto.description ?? rental.description,

            active: dto.active ?? rental.active,
            status: dto.status ?? rental.status,
          });

          /* ================= ROOM LOGIC ================= */
          let room: Room | null = null;

          if (isUnitRental(rental.rental_type)) {
            room =
              rental.rooms?.find((r) => r.active) ??
              rental.rooms?.[0] ??
              null;

            /* ===== VALIDATE ===== */
            if (!room && dto.price == null) {
              throw new BadRequestException('Giá thuê là bắt buộc');
            }

            if (dto.price !== undefined && dto.price <= 0) {
              throw new BadRequestException('Giá thuê không hợp lệ');
            }

            /* ===== CREATE ===== */
            if (!room) {
              if (!dto.title) {
                throw new BadRequestException('Tiêu đề là bắt buộc');
              }

              const roomCode = generateRoomCode();

              room = await manager.save(
                Room,
                manager.create(Room, {
                  rental_id: rental.id,

                  title: dto.title,
                  room_code: roomCode,
                  slug: slugifyVN(`${dto.title}-${roomCode}`),

                  price: dto.price!,
                  status: RoomStatus.Available,

                  floor: dto.floor,
                  room_number: dto.room_number,
                  area: dto.area,
                  max_people: dto.max_people,

                  amenities: dto.amenities ?? [],
                  description: dto.description_detail,

                  active: true,
                }),
              );
            }
            /* ===== UPDATE ===== */
            else {
              await manager.update(Room, room.id, {
                title: dto.title ?? room.title,
                price: dto.price ?? room.price,

                floor: dto.floor ?? room.floor,
                room_number: dto.room_number ?? room.room_number,
                area: dto.area ?? room.area,
                max_people: dto.max_people ?? room.max_people,

                amenities: dto.amenities ?? room.amenities,
                description: dto.description_detail ?? room.description,
              });

              // reload room để trả data chính xác
              room = await manager.findOne(Room, {
                where: { id: room.id },
              });
            }
          }

          return {
            rental_id: rental.id,
            room_id: room?.id ?? null,
          };
        },
      );

      return DataRes.success(result);
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Cập nhật rental thất bại',
      );
    }
  }



  /* =================  chua su dung ================= */


  async remove(id: string): Promise<DataRes<boolean>> {
    try {
      await this.transactionService.runInTransaction(
        async (manager) => {
          /* ===== CHECK RENTAL ===== */
          const rental = await manager.findOne(Rental, {
            where: { id },
          });

          if (!rental) {
            throw new BadRequestException('Rental không tồn tại');
          }

          /* ===== DELETE ROOMS ===== */
          await manager.delete(Room, {
            rental_id: id,
          });

          /* ===== SOFT DELETE RENTAL ===== */
          await manager.update(
            Rental,
            { id },
            { active: false },
          );
        },
      );

      return DataRes.success(true);
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Xóa rental thất bại',
      );
    }
  }

  async forceDelete(id: string): Promise<DataRes<boolean>> {
    try {
      await this.transactionService.runInTransaction(
        async (manager) => {
          /* ===== FIND RENTAL ===== */
          const rental = await manager.findOne(Rental, {
            where: { id },
            relations: ['collaborator'],
          });

          if (!rental) {
            throw new BadRequestException('Rental không tồn tại');
          }

          const collaboratorId = rental.collaborator_id;

          /* ===== DELETE ROOMS ===== */
          await manager.delete(Room, {
            rental_id: id,
          });

          /* ===== FORCE DELETE RENTAL ===== */
          await manager.delete(Rental, { id });

          /* ===== BLACKLIST COLLABORATOR ===== */
          await manager.update(
            Collaborator,
            { id: collaboratorId },
            {
              is_blacklisted: true,
              active: false,
              blacklist_reason: `Force delete rental ${id}`,
            },
          );
        },
      );

      return DataRes.success(true);
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Force delete rental thất bại',
      );
    }
  }

  async getByCollaborator(
    collaboratorId: string,
    active?: boolean,
  ): Promise<DataRes<Rental[]>> {
    try {
      const rentals = await this.rentalsRepository.findByCollaborator(
        collaboratorId,
        active,
      );

      return DataRes.success(rentals);
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Lấy danh sách nhà theo chủ nhà thất bại',
      );
    }
  }



  /* ================= CUSTOMER ================= */

  // async getOneCustomer(
  //   id: string,
  // ): Promise<DataRes<RentalCustomerDto>> {
  //   try {
  //     const rental = await this.rentalsRepository.findOne(
  //       id,
  //     );
  //     if (!rental || !rental.active) {
  //       return DataRes.failed('Tin không tồn tại');
  //     }

  //     const dto: RentalCustomerDto = {
  //       title: rental.title,
  //       rental_type: rental.rental_type,
  //       address_detail: rental.address_detail_display || rental.address_detail,
  //       price: rental.price,
  //       amenities: rental.amenities || [],
  //       uploads: rental.uploads || [],
  //     };

  //     return DataRes.success(dto);
  //   } catch (error) {
  //     return DataRes.failed(
  //        'Lấy chi tiết rental thất bại',
  //     );
  //   }
  // }
}
