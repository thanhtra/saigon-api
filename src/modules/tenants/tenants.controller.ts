import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { Permissions } from 'src/common/decorators/permissions.decorator';
import { Enums } from 'src/common/dtos/enum.dto';
import { DataRes, PageDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { PERMISSIONS } from 'src/config/permissions';

import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { Tenant } from './entities/tenant.entity';

@Controller('tenants')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(PermissionsGuard)
export class TenantsController {
  constructor(
    private readonly tenantsService: TenantsService,
  ) { }

  // ---------- CREATE ----------
  @Post()
  @Permissions(PERMISSIONS.tenants.create)
  create(
    @Body() dto: CreateTenantDto,
  ): Promise<DataRes<Tenant>> {
    return this.tenantsService.create(dto);
  }

  // ---------- LIST ----------
  @Get()
  @Permissions(PERMISSIONS.tenants.read_many)
  getTenants(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<DataRes<PageDto<Tenant>>> {
    return this.tenantsService.getTenants(pageOptionsDto);
  }

  // ---------- DETAIL ----------
  @Get(':id')
  @Permissions(PERMISSIONS.tenants.read_one)
  getTenant(
    @Param('id') id: string,
  ): Promise<DataRes<Tenant>> {
    return this.tenantsService.getTenant(id);
  }

  // ---------- ENUMS ----------
  @Get('enums')
  @Permissions(PERMISSIONS.tenants.enums)
  getEnums(): DataRes<Enums[]> {
    return this.tenantsService.getEnums();
  }

  // ---------- UPDATE ----------
  @Put(':id')
  @Permissions(PERMISSIONS.tenants.update)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTenantDto,
  ): Promise<DataRes<Tenant>> {
    return this.tenantsService.update(id, dto);
  }

  // ---------- DELETE ----------
  @Delete(':id')
  @Permissions(PERMISSIONS.tenants.delete)
  remove(
    @Param('id') id: string,
  ): Promise<DataRes<null>> {
    return this.tenantsService.remove(id);
  }
}
