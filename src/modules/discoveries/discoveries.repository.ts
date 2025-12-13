import { Injectable } from '@nestjs/common';
import { PageDto, PageMetaDto } from 'src/common/dtos/respones.dto';
import { slugify, getSkip } from 'src/common/helpers/utils';
import { Connection, EntityRepository, Repository } from 'typeorm';
import { Image } from '../images/entities/image.entity';
import { CreateDiscoveryDto } from './dto/create-discovery.dto';
import { QueryDiscoveryDto } from './dto/query.dto';
import { UpdateDiscoveryDto } from './dto/update-discovery.dto';
import { Discovery } from './entities/discovery.entity';
import { Category } from '../categories/entities/category.entity';


@Injectable()
@EntityRepository(Discovery)
export class DiscoveriesRepository {
  private repo: Repository<Discovery>;
  private imageRepo: Repository<Image>;

  constructor(private connection: Connection) {
    this.repo = this.connection.getRepository(Discovery);
  }

  createDiscovery = async (createDiscoveryDto: CreateDiscoveryDto) => {
    return await this.repo.save({ ...createDiscoveryDto, slug: slugify(createDiscoveryDto.title) });
  };

  getDiscoveries = async (pageOptionsDto: QueryDiscoveryDto): Promise<PageDto<Discovery>> => {
    const queryBuilder = this.repo.createQueryBuilder("discovery");

    queryBuilder
      .select(['discovery.id', 'discovery.createdAt', 'discovery.title', 'discovery.brief_description', 'discovery.image', 'discovery.slug', 'discovery.district', 'discovery.active', 'discovery.category_id'])
      .orderBy("discovery.updatedAt", pageOptionsDto.order)
      .skip(getSkip(pageOptionsDto.page, pageOptionsDto.size))
      .take(pageOptionsDto.size);

    if (pageOptionsDto.active === 'true') {
      queryBuilder.andWhere("discovery.active = :active", { active: true })
    }
    if (pageOptionsDto.active === 'false') {
      queryBuilder.andWhere("discovery.active = :active", { active: false })
    }

    if (pageOptionsDto.district) {
      queryBuilder.andWhere("discovery.district = :district", { district: pageOptionsDto.district })
    }
    if (pageOptionsDto.categoryId) {
      const arrId = pageOptionsDto.categoryId.split(",");
      queryBuilder.andWhere('discovery.category_id IN (:...arrId)', { arrId: arrId })
    }

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  };

  findOneDiscoveryBySlug = async (slug: string) => {
    return this.repo.findOneOrFail({
      where: { slug }
    });
  };

  findOneDiscoveryById = async (id: string) => {
    return this.repo.findOneOrFail({
      where: { id }
    });
  };

  findOneDiscoveryByImage = async (image: string) => {
    return this.repo.findOneOrFail({
      where: { image }
    });
  };

  updateDiscovery = async (id: string, updateDiscoveryDto: UpdateDiscoveryDto) => {
    return this.repo.save({ ...updateDiscoveryDto, id });
  };

  removeDiscovery = async (id: string) => {
    await this.repo.findOneOrFail({ where: { id } });
    return this.repo.delete(id);
  };

}
