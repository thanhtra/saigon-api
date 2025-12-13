import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { Enums } from 'src/common/dtos/enum.dto';
import { DataRes, PageDto } from 'src/common/dtos/respones.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { PERMISSIONS } from 'src/config/permissions';
import { DiscoveriesService } from './discoveries.service';
import { CreateDiscoveryDto } from './dto/create-discovery.dto';
import { QueryDiscoveryDto } from './dto/query.dto';
import { UpdateDiscoveryDto } from './dto/update-discovery.dto';
import { Discovery } from './entities/discovery.entity';

@Controller('discoveries')
export class DiscoveriesController {
  constructor(private discoveriesService: DiscoveriesService) { }

  @Get('/enums')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.discoveries.enums)
  getEnums(): DataRes<Enums[]> {
    return this.discoveriesService.getEnums();
  }

  @Post()
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.discoveries.create)
  async create(@Body() createDiscoveryDto: CreateDiscoveryDto): Promise<DataRes<any>> {
    return await this.discoveriesService.create(createDiscoveryDto);
  }

  @Get()
  @Public()
  async getDiscoveries(@Query() queryDiscoveryDto: QueryDiscoveryDto): Promise<DataRes<PageDto<Discovery>>> {
    return await this.discoveriesService.getDiscoveries(queryDiscoveryDto);
  }

  @Get(':id/detail')
  @Public()
  async getDiscoveryDetailById(@Param('id') id: string): Promise<DataRes<any>> {
    return await this.discoveriesService.getDiscoveryDetailById(id);
  }

  @Get(':slug/detail/slug')
  @Public()
  async getDiscoveryBySlug(@Param('slug') slug: string): Promise<DataRes<any>> {
    return await this.discoveriesService.getDiscoveryDetailBySlug(slug);
  }

  @Put(':id/update')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.discoveries.update)
  async update(
    @Param('id') id: string,
    @Body() updateDiscoveryDto: UpdateDiscoveryDto,
  ): Promise<DataRes<Partial<Discovery>>> {
    return await this.discoveriesService.update(id, updateDiscoveryDto);
  }

  @Delete(':id/delete')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.discoveries.delete)
  async removeDiscovery(@Param('id') id: string): Promise<DataRes<any>> {
    return await this.discoveriesService.removeDiscovery(id);
  }

}
