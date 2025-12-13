import { Injectable } from '@nestjs/common';
import { PageDto, PageMetaDto } from 'src/common/dtos/respones.dto';
import { getSkip, slugify } from 'src/common/helpers/utils';
import { Connection, EntityRepository, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductStatus } from 'src/config/productStatus';
import { MyPostsDto } from './dto/my-posts.dto';
import { LandStatus } from 'src/config/landStatus';

@Injectable()
@EntityRepository(Product)
export class ProductsRepository {
  private repo: Repository<Product>;

  constructor(private connection: Connection) {
    this.repo = this.connection.getRepository(Product);
  }

  createProduct = async (createProductDto: CreateProductDto) => {
    const slug = slugify(createProductDto.name.trim()) + '-' + Math.round(Math.random() * 1000);
    return await this.repo.save({ ...createProductDto, slug: slug });
  };

  getProducts = async (pageOptionsDto: QueryProductDto): Promise<PageDto<Product>> => {
    const queryBuilder = this.repo.createQueryBuilder("product");

    queryBuilder
      .orderBy("product.createdAt", pageOptionsDto.order)
      .select(['product.id', 'product.createdAt', 'product.name', 'product.slug',
        'product.category_id', 'product.price_from', 'product.image', 'product.brief_description',
        'product.status', 'product.image', 'product.slug', 'product.active'])
      .skip(getSkip(pageOptionsDto.page, pageOptionsDto.size))
      .take(pageOptionsDto.size);


    if (pageOptionsDto?.keySearch && pageOptionsDto?.multipleSearchEnums === '') {
      queryBuilder.andWhere('product.name like :data OR product.price_from::text like :data OR product.status::text like :data', { data: `%${pageOptionsDto.keySearch}%` })
    }

    if (pageOptionsDto?.keySearch && pageOptionsDto?.multipleSearchEnums === 'phone') {
      queryBuilder.leftJoinAndSelect("collaborator", "colla", "colla.id::text = product.collaborator_id")
        .where("colla.phone = :data", { data: pageOptionsDto?.keySearch })
    }

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  };

  getProductsCustomer = async (pageOptionsDto: QueryProductDto): Promise<PageDto<Product>> => {
    const queryBuilder = this.repo.createQueryBuilder("product");

    queryBuilder
      .orderBy("product.updatedAt", pageOptionsDto.order)
      .select(['product.id', 'product.name', 'product.slug', 'product.price_from', 'product.image', 'product.status'])
      .skip(getSkip(pageOptionsDto.page, pageOptionsDto.size))
      .take(pageOptionsDto.size);

    queryBuilder.where("product.active = :active", { active: true })
    queryBuilder.andWhere("product.status_post = :status_post", { status_post: ProductStatus.CONFIRMED })

    if (pageOptionsDto?.keySearch && pageOptionsDto?.keySearch.length) {
      queryBuilder.andWhere('LOWER(product.name) like :data', { data: `%${pageOptionsDto?.keySearch.toLowerCase()}%` })
    }

    if (pageOptionsDto.categoryId) {
      const arrId = pageOptionsDto.categoryId.split(",");
      queryBuilder.andWhere('product.category_id IN (:...arrId)', { arrId: arrId })
    }
    if (pageOptionsDto.status) {
      const arrStatus = pageOptionsDto.status.split(",");
      queryBuilder.andWhere('product.status IN (:...arrStatus)', { arrStatus: arrStatus })
    }

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  };

  findOneProduct = async (id: string) => {
    return this.repo.findOneOrFail({
      where: { id }
    });
  };

  findOneProductBySlug = async (slug: string) => {
    return this.repo.findOneOrFail({
      where: { slug }
    });
  };

  findOneProductByImage = async (image: string) => {
    return this.repo.findOneOrFail({
      where: { image }
    });
  };

  updateProduct = async (id: string, updateProductDto: UpdateProductDto) => {
    return this.repo.save({ ...updateProductDto, id });
  };

  removeProduct = async (id: string) => {
    await this.repo.findOneOrFail({ where: { id } });
    return this.repo.delete(id);
  };

  findOneMyProductBySlug = async (slug: string, userId: string) => {
    return this.repo.findOneOrFail({
      where: { slug, user_id: userId }
    });
  };

  getMyPosts = async (pageOptionsDto: MyPostsDto, userId: any): Promise<PageDto<Product>> => {
    const queryBuilder = this.repo.createQueryBuilder("product");

    queryBuilder
      .orderBy("product.updatedAt", pageOptionsDto.order)
      .select(['product.id', 'product.updatedAt', 'product.name', 'product.packs', 'product.image', 'product.slug', 'product.status', 'product.status_post'])
      .skip(getSkip(pageOptionsDto.page, pageOptionsDto.size))
      .take(pageOptionsDto.size);

    queryBuilder.andWhere("product.active = :active", { active: true });
    queryBuilder.andWhere("product.user_id = :userId", { userId: userId });
    queryBuilder.andWhere("product.status_post != :s", { s: LandStatus.CANCELLED });

    if (pageOptionsDto.status_post) {
      queryBuilder.andWhere("product.status_post = :status_post", { status_post: pageOptionsDto.status_post });
    }

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  };


}
