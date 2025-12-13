import { Injectable } from '@nestjs/common';
import { PageDto, PageMetaDto } from 'src/common/dtos/respones.dto';
import { getSkip, slugify } from 'src/common/helpers/utils';
import { Connection, EntityRepository, Repository } from 'typeorm';
import { CreateLandDto } from './dto/create-land.dto';
import { QueryLandDto } from './dto/query.dto';
import { UpdateLandDto } from './dto/update-land.dto';
import { Land } from './entities/land.entity';
import { LandStatus } from 'src/config/landStatus';
import { MyPostsDto } from './dto/my-posts.dto';

@Injectable()
@EntityRepository(Land)
export class LandsRepository {
    private repo: Repository<Land>;


    constructor(private connection: Connection) {
        this.repo = this.connection.getRepository(Land);

    }

    createLand = async (createLandDto: CreateLandDto) => {
        const slug = slugify(createLandDto.title.trim()) + '-' + Math.round(Math.random() * 1000);
        return await this.repo.save({ ...createLandDto, slug: slug });
    };

    getLands = async (pageOptionsDto: QueryLandDto): Promise<PageDto<Land>> => {
        const queryBuilder = this.repo.createQueryBuilder("land");

        queryBuilder
            .orderBy("land.updatedAt", pageOptionsDto.order)
            .select(['land.id', 'land.updatedAt', 'land.title', 'land.price', 'land.acreage', 'land.district', 'land.ward', 'land.image', 'land.slug'])
            .skip(getSkip(pageOptionsDto.page, pageOptionsDto.size))
            .take(pageOptionsDto.size);

        queryBuilder.andWhere("land.active = :active", { active: true })
        queryBuilder.andWhere("land.status = :status", { status: LandStatus.CONFIRMED })

        if (pageOptionsDto.district) {
            queryBuilder.andWhere("land.district = :district", { district: pageOptionsDto.district })
        }
        if (pageOptionsDto.ward) {
            queryBuilder.andWhere('land.ward = :ward', { ward: pageOptionsDto.ward })
        }
        if (pageOptionsDto.categoryId) {
            const arrId = pageOptionsDto.categoryId.split(",");
            queryBuilder.andWhere('land.category_id IN (:...arrId)', { arrId: arrId })
        }
        if (pageOptionsDto.priceLevel) {
            const arrId = pageOptionsDto.priceLevel.split(",");
            queryBuilder.andWhere('land.price_level IN (:...arrId)', { arrId: arrId })
        }
        if (pageOptionsDto.acreageLevel) {
            const arrId = pageOptionsDto.acreageLevel.split(",");
            queryBuilder.andWhere('land.acreage_level IN (:...arrId)', { arrId: arrId })
        }

        const itemCount = await queryBuilder.getCount();
        const { entities } = await queryBuilder.getRawAndEntities();

        const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
        return new PageDto(entities, pageMetaDto);
    };

    findOneLand = async (id: string) => {
        return this.repo.findOneOrFail({
            where: { id }
        });
    };

    findOneLandBySlug = async (slug: string) => {
        return this.repo.findOneOrFail({
            where: { slug, status: LandStatus.CONFIRMED }
        });
    };

    findOneMyLandBySlug = async (slug: string, userId: string) => {
        return this.repo.findOneOrFail({
            where: { slug, user_id: userId }
        });
    };

    findOneLandByImage = async (image: string) => {
        return this.repo.findOneOrFail({
            where: { image }
        });
    };

    updateLand = async (id: string, updateLandDto: UpdateLandDto) => {
        return this.repo.save({ ...updateLandDto, id });
    };

    removeLand = async (id: string) => {
        await this.repo.findOneOrFail({ where: { id } });
        return this.repo.delete(id);
    };

    getMyPosts = async (pageOptionsDto: MyPostsDto, userId: any): Promise<PageDto<Land>> => {
        const queryBuilder = this.repo.createQueryBuilder("land");

        queryBuilder
            .orderBy("land.updatedAt", pageOptionsDto.order)
            .select(['land.id', 'land.updatedAt', 'land.title', 'land.price', 'land.acreage', 'land.district', 'land.ward', 'land.image', 'land.slug', 'land.status'])
            .skip(getSkip(pageOptionsDto.page, pageOptionsDto.size))
            .take(pageOptionsDto.size);

        queryBuilder.andWhere("land.active = :active", { active: true });
        queryBuilder.andWhere("land.user_id = :userId", { userId: userId });
        queryBuilder.andWhere("land.status != :s", { s: LandStatus.CANCELLED });

        if (pageOptionsDto.status) {
            queryBuilder.andWhere("land.status = :status", { status: pageOptionsDto.status });
        }

        const itemCount = await queryBuilder.getCount();
        const { entities } = await queryBuilder.getRawAndEntities();

        const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
        return new PageDto(entities, pageMetaDto);
    };

    //API ADMIN

    getLandsAdmin = async (pageOptionsDto: QueryLandDto): Promise<PageDto<Land>> => {
        const queryBuilder = this.repo.createQueryBuilder("land");

        queryBuilder
            .orderBy("land.createdAt", pageOptionsDto.order)
            .select(['land.id', 'land.createdAt', 'land.title', 'land.price', 'land.acreage', 'land.district', 'land.ward', 'land.active', 'land.category_id', 'land.image', 'land.slug', 'land.status'])
            .skip(getSkip(pageOptionsDto.page, pageOptionsDto.size))
            .take(pageOptionsDto.size);

        if (pageOptionsDto?.keySearch && pageOptionsDto?.multipleSearchEnums === '') {
            queryBuilder.andWhere('land.title like :data OR land.price like :data OR land.status::text like :data', { data: `%${pageOptionsDto.keySearch}%` })
        }

        if (pageOptionsDto?.keySearch && pageOptionsDto?.multipleSearchEnums === 'phone') {
            queryBuilder.leftJoinAndSelect("collaborator", "colla", "colla.id::text = land.collaborator_id")
                .where("colla.phone = :data", { data: pageOptionsDto?.keySearch })
        }

        if (pageOptionsDto?.keySearch && pageOptionsDto?.multipleSearchEnums === 'account_phone') {
            queryBuilder.leftJoinAndSelect("user", "u", "u.id::text = land.user_id")
                .where("u.phone = :data", { data: pageOptionsDto?.keySearch })
        }

        const itemCount = await queryBuilder.getCount();
        const { entities } = await queryBuilder.getRawAndEntities();

        const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
        return new PageDto(entities, pageMetaDto);
    };
}
