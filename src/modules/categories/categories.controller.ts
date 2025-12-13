import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Inject, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Enums } from 'src/common/dtos/enum.dto';
import { DataRes, PageDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Public } from '../../common/decorators/public.decorator';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/config/permissions';


@Controller('categories')
@UseInterceptors(ClassSerializerInterceptor)
export class CategoriesController {
  constructor(private categoriesService: CategoriesService,
    @Inject(REQUEST) private request,) { }


  @Post()
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.categories.create)
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<DataRes<Category>> {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @Public()
  getCategoriesCustomer(@Query() pageOptionsDto: PageOptionsDto): Promise<DataRes<PageDto<Category>>> {
    return this.categoriesService.getCategoriesCustomer(pageOptionsDto);
  }

  @Get('/admin')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.categories.read)
  getCategories(@Query() pageOptionsDto: PageOptionsDto): Promise<DataRes<PageDto<Category>>> {
    return this.categoriesService.getCategories(pageOptionsDto);
  }

  @Get('/enums')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.categories.enums)
  getEnums(): DataRes<Enums[]> {
    return this.categoriesService.getEnums();
  }

  @Get(':id/detail')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.categories.read)
  async findOne(@Param('id') id: string): Promise<DataRes<Category>> {
    return await this.categoriesService.getCategory(id);
  }

  @Put(':id/update')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.categories.update)
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<DataRes<Partial<Category>>> {
    return await this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id/delete')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.categories.delete)
  async remove(@Param('id') id: string): Promise<DataRes<any>> {
    return await this.categoriesService.remove(id);
  }

}
