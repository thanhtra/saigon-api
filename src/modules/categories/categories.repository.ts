import { Category } from './entities/category.entity';
import { Connection, EntityRepository, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { getSkip } from 'src/common/helpers/utils';


@Injectable()
@EntityRepository(Category)
export class CategoriesRepository {
  private repo: Repository<Category>;

  constructor(private connection: Connection) {
    this.repo = this.connection.getRepository(Category);
  }

  createCategory = async (createCategoryDto: CreateCategoryDto) => {
    return this.repo.save(createCategoryDto);
  };

  getCategories = async (pageOptionsDto: PageOptionsDto): Promise<PageDto<Category>> => {
    const queryBuilder = this.repo.createQueryBuilder("category");

    queryBuilder
      .orderBy("category.createdAt", pageOptionsDto.order)
      .orderBy("category.type", pageOptionsDto.order)
      .select(['category.id', 'category.name', 'category.type', 'category.active'])

    if (pageOptionsDto?.keySearch && pageOptionsDto?.multipleSearchEnums === '') {
      queryBuilder.andWhere('category.name like :data', { data: `%${pageOptionsDto.keySearch}%` })
    }

    if (pageOptionsDto?.keySearch && pageOptionsDto?.multipleSearchEnums === 'type') {
      queryBuilder.andWhere('category.type::text like :data', { data: `%${pageOptionsDto.keySearch}%` })
    }

    if (pageOptionsDto.isPagin === 'true') {
      queryBuilder.skip(getSkip(pageOptionsDto.page, pageOptionsDto.size))
        .take(pageOptionsDto.size);
    }

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  };

  getCategoriesCustomer = async (pageOptionsDto: PageOptionsDto): Promise<PageDto<Category>> => {
    const queryBuilder = this.repo.createQueryBuilder("category");

    queryBuilder
      .orderBy("category.createdAt", pageOptionsDto.order)
      .select(['category.id', 'category.name', 'category.type'])

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  };


  find = async () => {
    return this.repo.find();
  };

  findOneCategory = async (id: string) => {
    return this.repo.findOneOrFail({ where: { id } });
  };

  updateCategory = async (
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ) => {
    return this.repo.save({ ...updateCategoryDto, id: String(id) });
  };

  removeCategory = async (id: string) => {
    await this.repo.findOneOrFail({ where: { id } });
    return this.repo.delete(id);
  };

}
