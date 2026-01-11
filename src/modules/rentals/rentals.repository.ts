import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    PageDto,
    PageMetaDto,
    PageOptionsDto,
} from 'src/common/dtos/respones.dto';
import { getSkip } from 'src/common/helpers/utils';
import { Repository } from 'typeorm';
import { Rental } from './entities/rental.entity';
import { RoomStatus } from 'src/common/helpers/enum';

@Injectable()
export class RentalsRepository {
    constructor(
        @InjectRepository(Rental)
        private readonly rentalRepo: Repository<Rental>,
    ) { }


    async getListRentals(
        pageOptions: PageOptionsDto,
    ): Promise<PageDto<Rental>> {
        const {
            page,
            size,
            order,
            key_search,
            active,
        } = pageOptions;

        const qb = this.rentalRepo
            .createQueryBuilder('rental')

            .leftJoinAndSelect('rental.rooms', 'room')

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
            ]);

        if (active !== undefined) {
            qb.andWhere('rental.active = :active', { active });
        }

        if (key_search?.trim()) {
            qb.andWhere(
                `
            (
              rental.address_detail ILIKE :q
              OR rental.address_detail_display ILIKE :q
              OR collaborator_user.name ILIKE :q
              OR collaborator_user.phone ILIKE :q
            )
            `,
                { q: `%${key_search.trim()}%` },
            );
        }

        qb.orderBy(
            'rental.createdAt',
            order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
        );

        qb.skip(getSkip(page, size))
            .take(Math.min(size, 50));

        const [entities, itemCount] = await qb.getManyAndCount();

        return new PageDto(
            entities,
            new PageMetaDto({
                itemCount,
                pageOptionsDto: pageOptions,
            }),
        );
    }

    async findOneAdmin(id: string): Promise<Rental | null> {
        const qb = this.rentalRepo
            .createQueryBuilder('rental')
            .leftJoin('rental.collaborator', 'collaborator')
            .leftJoin('collaborator.user', 'collaborator_user')
            .leftJoin('rental.createdBy', 'created_by_user')
            .leftJoin('rental.rooms', 'rooms')
            .leftJoin('rooms.uploads', 'room_uploads')

            .addSelect([
                'collaborator.id',
                'collaborator.type',
                'collaborator.active',
                'collaborator.is_blacklisted',

                'collaborator_user.id',
                'collaborator_user.name',
                'collaborator_user.phone',

                'created_by_user.id',
                'created_by_user.name',
                'created_by_user.email',
                'created_by_user.phone',

                'rooms.id',
                'rooms.title',
                'rooms.price',
                'rooms.status',
                'rooms.active',
                'rooms.amenities',
                'rooms.area',
                'rooms.description',
                'rooms.cover_index',

                'room_uploads.id',
                'room_uploads.file_path',
                'room_uploads.file_type',
                'room_uploads.domain',
                'room_uploads.room_id',
            ])
            .where('rental.id = :id', { id });

        return qb.getOne();
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
                'collaborator.type',
                'collaborator.active',
                'collaborator.is_blacklisted',

                'collaborator_user.id',
                'collaborator_user.name',
                'collaborator_user.phone',
            ])

            .where('rental.collaborator_id = :collaboratorId', {
                collaboratorId,
            })

            .andWhere('collaborator.active = true')
            .andWhere('collaborator.is_blacklisted = false')

            .orderBy('rental.createdAt', 'DESC')
            .take(100);

        if (active !== undefined) {
            qb.andWhere('rental.active = :active', { active });
        }

        return qb.getMany();
    }


    // async remove(id: string): Promise<boolean> {
    //     const { affected } = await this.rentalRepo.delete(id);
    //     return affected === 1;
    // }


    // async create(dto: Partial<Rental>): Promise<Rental> {
    //     const entity = this.repo.create(dto);
    //     return this.repo.save(entity);
    // }


    // async update(
    //     id: string,
    //     dto: UpdateRentalDto,
    // ): Promise<Rental | null> {
    //     const rental = await this.rentalRepo.preload({
    //         id,
    //         ...dto,
    //     });

    //     if (!rental) return null;

    //     // cập nhật upload nếu có
    //     // if (dto.upload_ids) {
    //     //     await this.uploadRepo.update(
    //     //         { rental: { id } },
    //     //         { rental: null },
    //     //     );

    //     //     if (dto.upload_ids.length) {
    //     //         await this.uploadRepo.update(
    //     //             { id: In(dto.upload_ids) },
    //     //             { rental },
    //     //         );
    //     //     }
    //     // }

    //     return this.rentalRepo.save(rental);
    // }




}
