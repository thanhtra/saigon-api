import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
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
import { UserRole } from 'src/common/helpers/enum';

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

    /* ================= CREATE ================= */

    async create(
        dto: CreateRentalDto,
        user: any
    ): Promise<Rental> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const rental = queryRunner.manager.create(Rental, {
                title: dto.title,
                rental_type: dto.rental_type,
                province: dto.province,
                district: dto.district,
                ward: dto.ward,
                street: dto.street,
                house_number: dto.house_number,
                address_detail: dto.address_detail,
                address_detail_display: dto.address_detail_display,
                commission_value: dto.commission_value,
                amenities: dto.amenities,
                description: dto.description,
                active: dto.active,
                cover_index: dto.cover_index ?? 0,
                collaborator_id: dto.collaborator_id,
                created_by: user.id,
            });

            await queryRunner.manager.save(rental);

            if (isUnitRental(dto.rental_type)) {
                if (dto?.price == null) {
                    throw new BadRequestException('Giá thuê là bắt buộc cho loại hình này');
                }

                const room = queryRunner.manager.create(Room, {
                    rental_id: rental.id,
                    room_code: generateRoomCode(),
                    price: dto.price,
                    slug: slugifyVN(`${dto.title}-${new Date().getTime()}`),
                    collaborator_id: dto.collaborator_id,
                    created_by: user.id,
                });

                await queryRunner.manager.save(room);
            }


            if (dto.upload_ids?.length) {
                await queryRunner.manager.update(
                    Upload,
                    { id: In(dto.upload_ids) },
                    { rental },
                );
            }

            await queryRunner.commitTransaction();
            return rental;

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    /* ================= UPDATE ================= */

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
        if (dto.upload_ids) {
            await this.uploadRepo.update(
                { rental: { id } },
                { rental: null },
            );

            if (dto.upload_ids.length) {
                await this.uploadRepo.update(
                    { id: In(dto.upload_ids) },
                    { rental },
                );
            }
        }

        return this.rentalRepo.save(rental);
    }

    /* ================= REMOVE ================= */

    async remove(id: string): Promise<boolean> {
        const { affected } = await this.rentalRepo.delete(id);
        return affected === 1;
    }

    /* ================= FIND ONE ================= */

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

    /* ================= FIND ALL ================= */

    async findAll(
        pageOptions: PageOptionsDto,
    ): Promise<PageDto<Rental>> {
        const qb = this.rentalRepo
            .createQueryBuilder('rental')
            .leftJoinAndSelect('rental.collaborator', 'collaborator')
            .leftJoinAndSelect('collaborator.user', 'user')
            .leftJoinAndSelect('rental.uploads', 'uploads')
            .orderBy('rental.createdAt', pageOptions.order)
            .skip(getSkip(pageOptions.page, pageOptions.size))
            .take(Math.min(pageOptions.size, 50));

        if (pageOptions.keySearch) {
            qb.andWhere(
                '(rental.title ILIKE :q OR rental.address_detail ILIKE :q)',
                { q: `%${pageOptions.keySearch}%` },
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
}
