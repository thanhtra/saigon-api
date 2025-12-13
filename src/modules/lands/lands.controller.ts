import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Inject, Param, Post, Put, Query, UseGuards, UseInterceptors, Request } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Public } from 'src/common/decorators/public.decorator';
import { Enums } from 'src/common/dtos/enum.dto';
import { DataRes, PageDto } from 'src/common/dtos/respones.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { PERMISSIONS } from 'src/config/permissions';
import { CreateLandDto } from './dto/create-land.dto';
import { QueryLandDto } from './dto/query.dto';
import { UpdateLandDto } from './dto/update-land.dto';
import { Land } from './entities/land.entity';
import { LandsService } from './lands.service';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CreateLandCustomerDto } from './dto/customer-create-land.dto';
import { MyPostsDto } from './dto/my-posts.dto';
import { UpdateLandCustomerDto } from './dto/customer-update-land.dto';

@Controller('lands')
@UseInterceptors(ClassSerializerInterceptor)
export class LandsController {
  constructor(private landsService: LandsService,
    @Inject(REQUEST) private request,) { }


  @Get('/enums')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.lands.enums)
  getEnums(): DataRes<Enums[]> {
    return this.landsService.getEnums();
  }

  @Post()
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.lands.create)
  async create(@Body() createLandDto: CreateLandDto): Promise<DataRes<any>> {
    return await this.landsService.create(createLandDto);
  }

  @Get()
  @Public()
  async getLands(@Query() pageOptionsDto: QueryLandDto): Promise<DataRes<PageDto<Land>>> {
    return await this.landsService.getLands(pageOptionsDto);
  }

  @Get('/admin')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.lands.read_admin)
  async getLandsAdmin(@Query() pageOptionsDto: QueryLandDto): Promise<DataRes<PageDto<Land>>> {
    return await this.landsService.getLandsAdmin(pageOptionsDto);
  }

  @Get(':id/detail')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.lands.read_admin)
  async getLand(@Param('id') id: string): Promise<DataRes<any>> {
    return await this.landsService.getLandDetail(id);
  }

  @Get(':slug/detail/slug')
  @Public()
  async getLandBySlug(@Param('slug') slug: string): Promise<DataRes<any>> {
    return await this.landsService.getLandDetailBySlug(slug);
  }

  @Put(':id/update')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.lands.update)
  async update(
    @Param('id') id: string,
    @Body() updateLandDto: UpdateLandDto,
  ): Promise<DataRes<Partial<Land>>> {
    return await this.landsService.update(id, updateLandDto);
  }

  @Delete(':id/delete')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.lands.delete)
  async removeLand(@Param('id') id: string): Promise<DataRes<any>> {
    return await this.landsService.removeLand(id);
  }


  @Post('/customer-post')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.lands.customer_create)
  async createLandCustomer(@Body() createLandCustomerDto: CreateLandCustomerDto, @Request() req): Promise<DataRes<any>> {
    return await this.landsService.createLandCustomer(createLandCustomerDto, req.user);
  }


  @Get('/my-posts')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.lands.read)
  async getMyPosts(@Query() pageOptionsDto: MyPostsDto, @Request() req): Promise<DataRes<PageDto<Land>>> {
    return await this.landsService.getMyPosts(pageOptionsDto, req?.user);
  }

  @Get(':slug/my-post/slug')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.lands.read)
  async getMyPostSlug(@Request() req, @Param('slug') slug: string): Promise<DataRes<any>> {
    return await this.landsService.getMyPostSlug(slug, req?.user);
  }

  @Put(':id/remove-my-post')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.lands.remove_my_post)
  async removeMyPost(@Request() req, @Param('id') id: string): Promise<DataRes<any>> {
    return await this.landsService.removeMyPost(id, req?.user);
  }

  @Put(':id/update-my-post')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.lands.remove_my_post)
  async updateMyPost(
    @Param('id') id: string,
    @Body() updateLandCustomerDto: UpdateLandCustomerDto,
    @Request() req
  ): Promise<DataRes<any>> {
    return await this.landsService.updateMyPost(id, updateLandCustomerDto, req?.user);
  }
}
