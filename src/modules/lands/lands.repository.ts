import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto, PageMetaDto } from 'src/common/dtos/respones.dto';
import { ACREAGE_LAND_LEVEL_MAP, PRICE_LAND_LEVEL_MAP } from 'src/common/helpers/constants';
import { getSkip } from 'src/common/helpers/utils';
import { Repository } from 'typeorm';
import { QueryLandPublicDto } from './dto/query-land-public.dto';
import { QueryLandDto } from './dto/query-land.dto';
import { Land } from './entities/land.entity';

@Injectable()
export class LandsRepository {
    constructor(
        @InjectRepository(Land)
        private readonly repo: Repository<Land>,
    ) { }


    async findPublicLandBySlug(slug: string): Promise<Land | null> {
        return this.repo
            .createQueryBuilder('land')
            .leftJoin('land.uploads', 'upload')

            .select([
                // ===== LAND =====
                'land.id',
                'land.slug',
                'land.title',
                'land.land_code',
                'land.land_type',

                'land.price',
                'land.area',

                'land.width_top',
                'land.width_bottom',
                'land.length_left',
                'land.length_right',

                'land.province',
                'land.district',
                'land.ward',
                'land.street',
                'land.house_number',
                'land.address_detail_display',

                'land.video_url',
                'land.structure',
                'land.description',
                'land.updatedAt',
            ])

            .addSelect([
                // ===== UPLOAD =====
                'upload.id',
                'upload.file_path',
                'upload.file_type',
                'upload.is_cover',
                'upload.createdAt',
            ])

            .where('land.slug = :slug', { slug })
            .andWhere('land.active = true')

            .orderBy('upload.is_cover', 'DESC')
            .addOrderBy('upload.createdAt', 'ASC')

            .getOne();
    }

    async findPublicLands(
        query: QueryLandPublicDto,
    ): Promise<PageDto<Partial<Land>>> {

        const qb = this.repo
            .createQueryBuilder('land')
            .leftJoin('land.uploads', 'upload')

            .where('land.active = true')

            .select([
                'land.id',
                'land.title',
                'land.slug',
                'land.price',
                'land.area',
                'land.structure',
                'land.createdAt',
                'land.land_type',
                'land.land_code',
                'land.address_detail_display',
                'land.video_url',
                'land.width_top',
                'land.width_bottom',
                'land.length_left',
                'land.length_right',
            ])

            .addSelect([
                'upload.id',
                'upload.file_path',
                'upload.file_type',
                'upload.is_cover',
            ])

            .orderBy('land.createdAt', query.order);

        if (query.is_pagin) {
            qb.skip(getSkip(query.page, query.size))
                .take(query.size);
        }

        if (query.key_search?.trim()) {
            const q = `%${query.key_search.trim().toLowerCase()}%`;

            qb.andWhere(
                `
                (
                    LOWER(land.title) LIKE :q
                    OR LOWER(land.address_detail_display) LIKE :q
                    OR LOWER(land.land_code) LIKE :q
                )
                `,
                { q },
            );
        }

        if (query.province) {
            qb.andWhere('land.province = :province', {
                province: query.province,
            });
        }

        if (query.district) {
            qb.andWhere('land.district = :district', {
                district: query.district,
            });
        }

        if (query.ward) {
            qb.andWhere('land.ward = :ward', {
                ward: query.ward,
            });
        }

        if (query.land_type?.length) {
            qb.andWhere('land.land_type IN (:...types)', {
                types: query.land_type,
            });
        }

        if (query.price_level) {
            const range = PRICE_LAND_LEVEL_MAP[query.price_level];

            if (range?.min != null) {
                qb.andWhere('land.price >= :minPrice', {
                    minPrice: range.min,
                });
            }

            if (range?.max != null) {
                qb.andWhere('land.price <= :maxPrice', {
                    maxPrice: range.max,
                });
            }
        }

        if (query.acreage_level) {
            const range = ACREAGE_LAND_LEVEL_MAP[query.acreage_level];

            if (range?.min != null) {
                qb.andWhere('land.area >= :minArea', {
                    minArea: range.min,
                });
            }

            if (range?.max != null) {
                qb.andWhere('land.area <= :maxArea', {
                    maxArea: range.max,
                });
            }
        }

        const [entities, itemCount] = await qb.getManyAndCount();

        return new PageDto(
            entities,
            new PageMetaDto({
                itemCount,
                pageOptionsDto: query,
            }),
        );
    }

    async getLands(query: QueryLandDto): Promise<PageDto<Land>> {
        const qb = this.repo
            .createQueryBuilder('land')
            .leftJoinAndSelect('land.collaborator', 'collaborator')
            .leftJoinAndSelect('collaborator.user', 'collaborator_user');

        // ===== active =====
        if (query.active !== undefined) {
            qb.where('land.active = :active', { active: query.active });
        }

        // ===== land_type =====
        if (query.land_type) {
            qb.andWhere('land.land_type = :land_type', {
                land_type: query.land_type,
            });
        }

        // ===== land_code =====
        if (query.land_code) {
            qb.andWhere('land.land_code ILIKE :land_code', {
                land_code: `%${query.land_code.trim()}%`,
            });
        }

        // ===== search =====
        if (query.key_search) {
            const q = `%${query.key_search.trim().toLowerCase()}%`;

            qb.andWhere(
                `
                (
                    LOWER(land.land_code) LIKE :q
                    OR land.price::text LIKE :q
                    OR LOWER(land.address_detail) LIKE :q
                    OR collaborator_user.phone LIKE :q
                )
                `,
                { q },
            );
        }

        // ===== sort =====
        qb.orderBy('land.createdAt', query.order ?? 'DESC');

        // ===== pagination =====
        if (query.is_pagin) {
            qb.skip(getSkip(query.page, query.size))
                .take(query.size);
        }

        const [entities, itemCount] = await qb.getManyAndCount();

        return new PageDto(
            entities,
            new PageMetaDto({
                itemCount,
                pageOptionsDto: query,
            }),
        );
    }

    async getOneAdmin(id: string): Promise<Land | null> {
        return this.repo
            .createQueryBuilder('land')
            .leftJoinAndSelect('land.uploads', 'upload')
            .where('land.id = :id', { id })
            .orderBy('upload.created_at', 'ASC')
            .getOne();
    }

}
