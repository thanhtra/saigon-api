import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesRepository } from './categories.repository';
import { DataRes, PageDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { Category } from './entities/category.entity';
import { ErrorMes } from 'src/common/helpers/errorMessage';
import { Enums } from 'src/common/dtos/enum.dto';

@Injectable()
export class CategoriesService {
  constructor(private categoriesRepository: CategoriesRepository) { }

  async create(createCategoryDto: CreateCategoryDto): Promise<DataRes<Category>> {
    var res = new DataRes<Category>();

    try {
      const categoryCreated = await this.categoriesRepository.createCategory(createCategoryDto);

      if (!categoryCreated) {
        res.setFailed(ErrorMes.CATEGORY_REMOVE);
      } else {
        res.setSuccess(categoryCreated);
      }
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async getCategories(pageOptionsDto: PageOptionsDto): Promise<DataRes<PageDto<Category>>> {
    var res = new DataRes<PageDto<Category>>;

    try {
      const categories = await this.categoriesRepository.getCategories(pageOptionsDto);

      if (!categories) {
        res.setFailed(ErrorMes.CATEGORY_GET_ALL);
        return res;
      }

      res.setSuccess(categories);
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async getCategoriesCustomer(pageOptionsDto: PageOptionsDto): Promise<DataRes<PageDto<Category>>> {
    var res = new DataRes<PageDto<Category>>;

    try {
      const categories = await this.categoriesRepository.getCategoriesCustomer(pageOptionsDto);

      if (!categories) {
        res.setFailed(ErrorMes.CATEGORY_GET_ALL);
        return res;
      }

      res.setSuccess(categories);
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  getEnums(): DataRes<Enums[]> {
    var res = new DataRes<Enums[]>;

    try {
      let arr: Array<Enums> = [];
      Object.entries(CreateCategoryDto.getEnums()).forEach(item => {
        arr.push({
          label: item[1],
          value: item[0]
        })
      });

      if (!arr.length) {
        res.setFailed(ErrorMes.ENUMS_GET_ALL);
      }
      res.setSuccess(arr);
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async getCategory(id: string): Promise<DataRes<Category>> {
    var res = new DataRes<Category>();

    try {
      const category = await this.categoriesRepository.findOneCategory(id);

      if (!category) {
        res.setFailed(ErrorMes.CATEGORY_GET_DETAIL);
      }

      res.setSuccess(category);
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<DataRes<Partial<Category>>> {
    var res = new DataRes<Partial<Category>>();

    try {
      const categoryUpdated = await this.categoriesRepository.updateCategory(id, updateCategoryDto);

      if (!categoryUpdated) {
        res.setFailed(ErrorMes.CATEGORY_UPDATE);
      } else {
        res.setSuccess(categoryUpdated);
      }
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async remove(id: string): Promise<DataRes<any>> {
    var res = new DataRes<any>();

    try {
      const { affected } = await this.categoriesRepository.removeCategory(id);

      if (affected === 1) {
        res.setSuccess(null);
      } else {
        res.setFailed(ErrorMes.CATEGORY_REMOVE);
      }
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

}
