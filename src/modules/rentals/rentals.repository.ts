import { BadRequestException, Injectable } from '@nestjs/common';
import {
    PageDto,
    PageMetaDto,
    PageOptionsDto,
} from 'src/common/dtos/respones.dto';
import { isUnitRental } from 'src/common/helpers/constants';
import { generateRoomCode, getSkip, slugifyVN } from 'src/common/helpers/utils';
import { Upload } from 'src/modules/uploads/entities/upload.entity';
import { Connection, DataSource, In, Repository } from 'typeorm';
import { Room } from '../rooms/entities/rooms.entity';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { Rental } from './entities/rental.entity';

@Injectable()
export class RentalsRepository {
    private rentalRepo: Repository<Rental>;
    private uploadRepo: Repository<Upload>;
    private roomRepo: Repository<Room>;

    constructor(
        private readonly connection: Connection,
        private readonly dataSource: DataSource
    ) {
        this.rentalRepo = this.connection.getRepository(Rental);
        this.uploadRepo = this.connection.getRepository(Upload);
        this.roomRepo = this.connection.getRepository(Room);
    }


    async create(
        dto: CreateRentalDto,
        user: any,
    ): Promise<any> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const rental = queryRunner.manager.create(Rental, {
                province: dto.province,
                district: dto.district,
                ward: dto.ward,
                street: dto.street,
                house_number: dto.house_number,
                address_detail: dto.address_detail,
                address_detail_display: dto.address_detail_display,
                commission_value: dto.commission_value,
                rental_type: dto.rental_type,
                description: dto.description,
                active: dto.active,
                collaborator_id: dto.collaborator_id,
                createdBy: user.id,
            });

            await queryRunner.manager.save(rental);
            let room = {};

            if (isUnitRental(dto.rental_type)) {
                if (dto.price == null) {
                    throw new BadRequestException('Giá thuê là bắt buộc');
                }

                room = queryRunner.manager.create(Room, {
                    rental_id: rental.id,
                    collaborator_id: dto.collaborator_id,
                    created_by: user.id,
                    title: dto.title,
                    room_code: generateRoomCode(),
                    slug: slugifyVN(`${dto.title}-${Date.now()}`),
                    price: dto.price,
                    amenities: dto.amenities,
                    description: dto.description_detail,
                    floor: dto.floor,
                    area: dto.area,
                    room_number: dto.room_number,
                    cover_index: 0,
                });

                await queryRunner.manager.save(room);
            }

            await queryRunner.commitTransaction();
            return { ...rental, room };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async update(
        id: string,
        dto: UpdateRentalDto,
    ): Promise<Rental | null> {
        const rental = await this.rentalRepo.preload({
            id,
            ...dto,
        });

        if (!rental) return null;

        // cập nhật upload nếu có
        // if (dto.upload_ids) {
        //     await this.uploadRepo.update(
        //         { rental: { id } },
        //         { rental: null },
        //     );

        //     if (dto.upload_ids.length) {
        //         await this.uploadRepo.update(
        //             { id: In(dto.upload_ids) },
        //             { rental },
        //         );
        //     }
        // }

        return this.rentalRepo.save(rental);
    }

    async remove(id: string): Promise<boolean> {
        const { affected } = await this.rentalRepo.delete(id);
        return affected === 1;
    }

    async findOne(id: string): Promise<Rental | null> {
        return this.rentalRepo.findOne({
            where: { id },
            relations: [
                'posted_by',
                'posted_by.user',
                'uploads',
            ],
        });
    }

    async getListRentals(
        pageOptions: PageOptionsDto,
    ): Promise<PageDto<Rental>> {
        const {
            page,
            size,
            order,
            key_search,
        } = pageOptions;

        const qb = this.rentalRepo
            .createQueryBuilder('rental')
            .leftJoin('rental.collaborator', 'collaborator')
            .leftJoin('collaborator.user', 'collaborator_user')
            .leftJoin('rental.createdBy', 'created_by_user')

            .addSelect([
                'collaborator.id',
                'collaborator.type',

                'collaborator_user.id',
                'collaborator_user.name',
                'collaborator_user.phone',

                'created_by_user.id',
                'created_by_user.name',
                'created_by_user.email',
                'created_by_user.phone',
            ])

            .orderBy('rental.createdAt', order)
            .skip(getSkip(page, size))
            .take(Math.min(size, 50));

        if (key_search?.trim()) {
            qb.andWhere(
                `
                (
                    rental.title ILIKE :q
                    OR rental.address_detail ILIKE :q
                )
                `,
                { q: `%${key_search.trim()}%` },
            );
        }

        const [entities, itemCount] = await qb.getManyAndCount();

        return new PageDto(
            entities,
            new PageMetaDto({
                itemCount,
                pageOptionsDto: pageOptions,
            }),
        );
    }


    async findByCollaborator(
        collaboratorId: string,
        active?: boolean,
    ): Promise<Rental[]> {
        const qb = this.rentalRepo
            .createQueryBuilder('rental')
            .leftJoin('rental.collaborator', 'collaborator')
            .leftJoin('collaborator.user', 'collaborator_user')
            .addSelect([
                'collaborator.id',
                'collaborator_user.id',
                'collaborator_user.name',
                'collaborator_user.phone',
            ])
            .where('rental.collaborator_id = :collaboratorId', {
                collaboratorId,
            })
            .orderBy('rental.createdAt', 'DESC');

        if (active !== undefined) {
            qb.andWhere('rental.active = :active', { active });
        }

        return qb.getMany();
    }

}
