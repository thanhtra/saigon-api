import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Inject, Param, Post, Put, Query, UseGuards, UseInterceptors, Request } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Public } from 'src/common/decorators/public.decorator';
import { Enums } from 'src/common/dtos/enum.dto';
import { DataRes, PageDto } from 'src/common/dtos/respones.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { PERMISSIONS } from 'src/config/permissions';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CreateProductCustomerDto } from './dto/customer-create-product.dto';
import { MyPostsDto } from './dto/my-posts.dto';
import { UpdateProductCustomerDto } from './dto/customer-update-product.dto';

@Controller('products')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductsController {
    constructor(private productsService: ProductsService,
        @Inject(REQUEST) private request,) { }


    @Get('/enums')
    @UseGuards(PermissionsGuard)
    @Permissions(PERMISSIONS.products.enums)
    getEnums(): DataRes<Enums[]> {
        return this.productsService.getEnums();
    }

    @Post()
    @UseGuards(PermissionsGuard)
    @Permissions(PERMISSIONS.products.create)
    async create(@Body() createProductDto: CreateProductDto): Promise<DataRes<any>> {
        return await this.productsService.create(createProductDto);
    }

    @Get()
    @Public()
    async getProductsCustomer(@Query() pageOptionsDto: QueryProductDto): Promise<DataRes<PageDto<Product>>> {
        return await this.productsService.getProductsCustomer(pageOptionsDto);
    }

    @Get('/admin')
    @UseGuards(PermissionsGuard)
    @Permissions(PERMISSIONS.products.read)
    async getProducts(@Query() pageOptionsDto: QueryProductDto): Promise<DataRes<PageDto<Product>>> {
        return await this.productsService.getProducts(pageOptionsDto);
    }

    @Get(':id/detail')
    @UseGuards(PermissionsGuard)
    @Permissions(PERMISSIONS.products.read)
    async getProduct(@Param('id') id: string): Promise<DataRes<any>> {
        return await this.productsService.getProductDetail(id);
    }

    @Get(':slug/detail/slug')
    @Public()
    async getProductBySlug(@Param('slug') slug: string): Promise<DataRes<any>> {
        return await this.productsService.getProductDetailBySlug(slug);
    }

    @Put(':id/update')
    @UseGuards(PermissionsGuard)
    @Permissions(PERMISSIONS.products.update)
    async update(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
    ): Promise<DataRes<Partial<Product>>> {
        return await this.productsService.update(id, updateProductDto);
    }

    @Delete(':id/delete')
    @UseGuards(PermissionsGuard)
    @Permissions(PERMISSIONS.products.delete)
    async removeProduct(@Param('id') id: string): Promise<DataRes<any>> {
        return await this.productsService.removeProduct(id);
    }

    @Get(':slug/my-post/slug')
    @UseGuards(PermissionsGuard)
    @Permissions(PERMISSIONS.products.get_my_post)
    async getMyPostSlug(@Param('slug') slug: string): Promise<DataRes<any>> {
        return await this.productsService.getMyPostSlug(slug);
    }

    @Post('/customer-post')
    @UseGuards(PermissionsGuard)
    @Permissions(PERMISSIONS.products.customer_create)
    async createProductCustomer(@Body() createProductCustomerDto: CreateProductCustomerDto): Promise<DataRes<any>> {
        return await this.productsService.createProductCustomer(createProductCustomerDto);
    }

    @Get('/my-posts')
    @UseGuards(PermissionsGuard)
    @Permissions(PERMISSIONS.products.customer_create)
    async getMyPosts(@Query() pageOptionsDto: MyPostsDto): Promise<DataRes<PageDto<Product>>> {
        return await this.productsService.getMyPosts(pageOptionsDto);
    }

    @Put(':id/remove-my-post')
    @UseGuards(PermissionsGuard)
    @Permissions(PERMISSIONS.products.remove_my_post)
    async removeMyPost(@Param('id') id: string): Promise<DataRes<any>> {
        return await this.productsService.removeMyPost(id);
    }

    @Put(':id/update-my-post')
    @UseGuards(PermissionsGuard)
    @Permissions(PERMISSIONS.lands.remove_my_post)
    async updateMyPost(
        @Param('id') id: string,
        @Body() updateProductCustomerDto: UpdateProductCustomerDto,
    ): Promise<DataRes<any>> {
        return await this.productsService.updateMyPost(id, updateProductCustomerDto);
    }
}
