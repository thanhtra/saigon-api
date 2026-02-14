import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import {
  DataRes,
  PageDto
} from 'src/common/dtos/respones.dto';
import { PERMISSIONS } from 'src/config/permissions';
import { CreateLandDto } from './dto/create-land.dto';
import { QueryLandPublicDto } from './dto/query-land-public.dto';
import { QueryLandDto } from './dto/query-land.dto';
import { UpdateLandDto } from './dto/update-land.dto';
import { Land } from './entities/land.entity';
import { LandsService } from './lands.service';
import { CheckLinkDaithekyDto } from './dto/check-link-daitheky.dto';

@Controller('lands')
export class LandsController {
  constructor(
    private readonly landsService: LandsService,
  ) { }


  @Post('admintra')
  @Auth(PERMISSIONS.lands.create)
  async create(
    @Body() dto: CreateLandDto
  ): Promise<DataRes<Land>> {
    return await this.landsService.create(dto);
  }

  @Post('check-link-daitheky/admintra')
  @Auth(PERMISSIONS.lands.check_link)
  async checkLinkDaitheky(
    @Body() dto: CheckLinkDaithekyDto
  ): Promise<DataRes<boolean>> {
    return await this.landsService.checkLinkDaitheky(dto);
  }

  @Get('customer')
  @Public()
  async getPublicLands(
    @Query() query: QueryLandPublicDto,
  ): Promise<DataRes<PageDto<any>>> {
    return await this.landsService.getPublicLands(query);
  }

  @Get('customer/:slug')
  @Public()
  async getLandBySlug(
    @Param('slug') slug: string,
  ): Promise<DataRes<Land>> {
    return await this.landsService.getPublicLandBySlug(slug);
  }

  @Get('admintra')
  @Auth(PERMISSIONS.lands.read_many)
  async getLands(
    @Query() query: QueryLandDto,
  ): Promise<DataRes<PageDto<Land>>> {
    return this.landsService.getLands(query);
  }

  @Get(':id/admintra')
  @Auth(PERMISSIONS.lands.read_one)
  async getOneAdmin(
    @Param('id') id: string,
  ): Promise<DataRes<Land>> {
    return await this.landsService.getOneAdmin(id);
  }

  @Put(':id/admintra')
  @Auth(PERMISSIONS.lands.update)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateLandDto,
  ): Promise<DataRes<Land>> {
    return await this.landsService.update(id, dto);
  }

  @Delete(':id/admintra')
  @Auth(PERMISSIONS.lands.delete)
  async remove(
    @Param('id') id: string,
  ): Promise<DataRes<boolean>> {
    return await this.landsService.remove(id);
  }

}
