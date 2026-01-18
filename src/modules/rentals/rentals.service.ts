import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { TransactionService } from 'src/common/database/transaction.service';
import {
  DataRes,
  PageDto,
  PageOptionsDto,
} from 'src/common/dtos/respones.dto';
import { isUnitRental } from 'src/common/helpers/constants';
import { RentalStatus, RentalType, RoomStatus } from 'src/common/helpers/enum';
import { generateRoomCode, slugifyVN } from 'src/common/helpers/utils';
import { EntityManager, In } from 'typeorm';
import { Room } from '../rooms/entities/rooms.entity';
import { Upload } from '../uploads/entities/upload.entity';
import { UploadsService } from '../uploads/uploads.service';
import { User } from '../users/entities/user.entity';
import { CreateRentalDto, CustomerCreateBoardingHousesDto, CustomerCreateUnitRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { Rental } from './entities/rental.entity';
import { RentalsRepository } from './rentals.repository';
import { Collaborator } from '../collaborators/entities/collaborator.entity';

@Injectable()
export class RentalsService {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly rentalsRepository: RentalsRepository,
    private readonly uploadsService: UploadsService
  ) { }

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
              rental_type: dto.rental_type,
              collaborator_id: dto.collaborator_id,
              created_by: user.id,

              province: dto.province,
              district: dto.district,
              ward: dto.ward,
              street: dto.street,
              house_number: dto.house_number,
              address_detail: dto.address_detail,
              address_detail_display: dto.address_detail_display,

              commission: dto.commission,
              note: dto.note,

              active: dto.active,
              status: dto.status,

              fee_electric: dto.fee_electric,
              fee_water: dto.fee_water,
              fee_wifi: dto.fee_wifi,
              fee_service: dto.fee_service,
              fee_parking: dto.fee_parking,
              fee_other: dto.fee_other
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
                status: dto.room_status,

                floor: dto.floor,
                room_number: dto.room_number,
                area: dto.area,
                max_people: dto.max_people,
                deposit: dto.deposit,

                amenities: dto.amenities,
                description: dto.description,
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

  async update(
    id: string,
    dto: UpdateRentalDto,
  ): Promise<DataRes<any>> {
    try {
      const result = await this.transactionService.runInTransaction(
        async (manager) => {

          const rental = await manager.findOne(Rental, {
            where: { id },
            lock: { mode: 'pessimistic_write' },
          });

          if (!rental) {
            throw new NotFoundException('Rental không tồn tại');
          }

          const nextActive = dto.active ?? rental.active;
          const isDeactivate = rental.active === true && nextActive === false;

          await manager.update(Rental, id, {
            collaborator_id: dto.collaborator_id ?? rental.collaborator_id,

            province: dto.province ?? rental.province,
            district: dto.district ?? rental.district,
            ward: dto.ward ?? rental.ward,
            street: dto.street ?? rental.street,
            house_number: dto.house_number ?? rental.house_number,
            address_detail: dto.address_detail ?? rental.address_detail,
            address_detail_display: dto.address_detail_display ?? rental.address_detail_display,

            commission: dto.commission ?? rental.commission,
            note: dto.note ?? rental.note,

            active: nextActive,
            status: dto.status ?? rental.status,

            fee_electric: dto.fee_electric ?? rental.fee_electric,
            fee_water: dto.fee_water ?? rental.fee_water,
            fee_wifi: dto.fee_wifi ?? rental.fee_wifi,
            fee_service: dto.fee_service ?? rental.fee_service,
            fee_parking: dto.fee_parking ?? rental.fee_parking,
            fee_other: dto.fee_other ?? rental.fee_other,
          });


          if (isUnitRental(rental.rental_type)) {

            const room = await manager.findOne(Room, {
              where: { rental_id: rental.id },
              lock: { mode: 'pessimistic_write' },
            });

            if (!room) {
              throw new NotFoundException(
                'Không tìm thấy phòng của rental này',
              );
            }

            if (dto.price !== undefined && dto.price <= 0) {
              throw new BadRequestException('Giá thuê không hợp lệ');
            }

            manager.merge(Room, room, {
              title: dto.title ?? room.title,
              price: dto.price ?? room.price,
              area: dto.area ?? room.area,
              max_people: dto.max_people ?? room.max_people,
              status: dto.room_status ?? room.status,
              amenities: dto.amenities ?? room.amenities,
              description: dto.description ?? room.description,
              active: dto.active !== undefined ? dto.active : room.active,
              floor: dto.floor ?? room.floor,
              room_number: dto.room_number ?? room.room_number,
              deposit: dto.deposit ?? room.deposit,
            });

            await manager.save(room);
          }

          if (isDeactivate) {
            await manager.update(
              Room,
              {
                rental_id: rental.id,
                active: true,
              },
              {
                active: false,
                status: RoomStatus.Disabled,
              },
            );
          }

          rental.rooms = await manager.find(Room, {
            where: { rental_id: rental.id },
          });

          return rental;
        },
      );

      return DataRes.success(result);
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Cập nhật rental thất bại',
      );
    }
  }

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

  async forceDelete(id: string): Promise<DataRes<boolean>> {
    /**
     * Lưu danh sách folder room cần xoá
     * VD: uploads/rooms/{roomId}
     */
    const roomFolderPaths = new Set<string>();
    const uploadFilePaths: string[] = [];

    try {
      await this.transactionService.runInTransaction(async (manager) => {
        const rental = await manager.findOne(Rental, { where: { id } });
        if (!rental) {
          throw new BadRequestException('Rental không tồn tại');
        }

        /* ===== 1. Lấy room + upload ===== */
        const rooms = await manager.find(Room, {
          where: { rental_id: id },
          select: ['id'],
        });

        if (rooms.length) {
          rooms.forEach(room => {
            roomFolderPaths.add(`/rooms/${room.id}`);
          });

          const uploads = await manager.find(Upload, {
            where: { room_id: In(rooms.map(r => r.id)) },
            select: ['id', 'file_path'],
          });

          uploads.forEach(u => uploadFilePaths.push(u.file_path));

          /* ===== 2. Xoá uploads (DB) ===== */
          if (uploads.length) {
            await manager.delete(
              Upload,
              uploads.map(u => u.id),
            );
          }

          /* ===== 3. Xoá rooms ===== */
          await manager.delete(Room, {
            id: In(rooms.map(r => r.id)),
          });
        }

        /* ===== 4. Xoá rental ===== */
        await manager.delete(Rental, { id });
      });

      /* ===== 5. Xoá file vật lý ===== */
      for (const filePath of uploadFilePaths) {
        await this.uploadsService.removeFile(filePath);
      }

      /* ===== 6. Xoá folder room ===== */
      for (const folderPath of roomFolderPaths) {
        await this.uploadsService.removeFolder(folderPath);
      }

      return DataRes.success(true);
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Force delete rental thất bại',
      );
    }
  }


  /* ================= CUSTOMER ================= */

  async getMyBoardingHouses(user: User): Promise<DataRes<any>> {
    try {
      const data = await this.rentalsRepository.getMyBoardingHouses(user.id);

      return DataRes.success(data);
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Lấy danh sách dãy trọ thất bại',
      );
    }
  }

  async customerCreateBoardingHouses(
    dto: CustomerCreateBoardingHousesDto,
    user: User,
  ): Promise<DataRes<any>> {
    try {
      const result = await this.transactionService.runInTransaction(
        async (manager) => {

          const collaborator = await manager.findOne(Collaborator, {
            where: {
              user_id: user.id,
              active: true,
            },
          });

          if (!collaborator) {
            throw new BadRequestException(
              'USER_IS_NOT_COLLABORATOR',
            );
          }

          if (collaborator.is_blacklisted) {
            throw new BadRequestException(
              'COLLABORATOR_IS_BLACKLISTED',
            );
          }

          const existedRental = await manager.findOne(Rental, {
            where: {
              rental_type: RentalType.BoardingHouse,
              address_detail: dto.address_detail,
              collaborator_id: collaborator.id,
              active: true,
            }
          });

          if (existedRental) {
            throw new BadRequestException(
              'BOARDING_HOUSE_ADDRESS_ALREADY_EXISTS',
            );
          }

          const rental = await manager.save(
            Rental,
            manager.create(Rental, {
              collaborator_id: collaborator.id,
              created_by: user.id,

              rental_type: RentalType.BoardingHouse,
              status: RentalStatus.New,
              active: true,

              province: dto.province,
              district: dto.district,
              ward: dto.ward,
              street: dto.street,
              house_number: dto.house_number,

              address_detail: dto.address_detail,
              address_detail_display: dto.address_detail_display,

              fee_electric: dto.fee_electric ?? 0,
              fee_water: dto.fee_water ?? 0,
              fee_wifi: dto.fee_wifi ?? 0,
              fee_service: dto.fee_service ?? 0,
              fee_parking: dto.fee_parking ?? 0,
              fee_other: dto.fee_other,
            }),
          );

          // XXXXX
          return {
            rental,
          };
        },
      );

      return DataRes.success(result);
    } catch (error) {
      console.error(
        'Error customerCreateBoardingHouses',
        error,
      );

      return DataRes.failed(
        error?.message || 'Tạo dãy trọ thất bại',
      );
    }
  }

  async customerCreateUnitRental(
    dto: CustomerCreateUnitRentalDto,
    user: User,
  ): Promise<DataRes<any>> {
    try {
      const result = await this.transactionService.runInTransaction(
        async (manager) => {

          const collaborator = await this.getActiveCollaboratorOrFail(
            manager,
            user.id,
          );

          if (!isUnitRental(dto.rental_type)) {
            throw new BadRequestException(
              'Loại hình cho thuê không hợp lệ cho chức năng này',
            );
          }

          const rental = await manager.save(
            Rental,
            manager.create(Rental, {
              collaborator_id: collaborator.id,
              created_by: user.id,

              rental_type: dto.rental_type,

              province: dto.province,
              district: dto.district,
              ward: dto.ward,
              street: dto.street,
              house_number: dto.house_number,
              address_detail: dto.address_detail,
              address_detail_display: dto.address_detail_display,

              fee_electric: dto.fee_electric,
              fee_water: dto.fee_water,
              fee_wifi: dto.fee_wifi,
              fee_service: dto.fee_service,
              fee_parking: dto.fee_parking,
              fee_other: dto.fee_other,

              active: true,
              status: RentalStatus.New,
            }),
          );

          if (!dto.price || dto.price <= 0) {
            throw new BadRequestException('Giá thuê là bắt buộc');
          }

          const roomCode = generateRoomCode();
          const slug = slugifyVN(`${dto.title}-${roomCode}`);

          const room = await manager.save(
            Room,
            manager.create(Room, {
              rental_id: rental.id,

              title: dto.title,
              room_code: roomCode,
              slug,

              price: dto.price,
              deposit: dto.deposit,

              floor: dto.floor,
              room_number: dto.room_number,
              area: dto.area,
              max_people: dto.max_people,

              amenities: dto.amenities ?? [],
              description: dto.description,

              status: RoomStatus.PendingApproval,
              active: true,
            }),
          );

          return { roomId: room.id };
        },
      );

      return DataRes.success(result);
    } catch (error) {
      return DataRes.failed('Tạo nhà cho thuê thất bại');
    }
  }


  // HELPER

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
