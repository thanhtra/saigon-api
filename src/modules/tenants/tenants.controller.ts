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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { Permissions } from 'src/common/decorators/permissions.decorator';
import {
  DataRes,
  PageDto,
  PageOptionsDto,
} from 'src/common/dtos/respones.dto';
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

  /* ================= CREATE ================= */

  @Post()
  @Permissions(PERMISSIONS.tenants.create)
  async create(
    @Body() dto: CreateTenantDto,
  ): Promise<DataRes<Tenant>> {
    return await this.tenantsService.create(dto);
  }

  /* ================= LIST ================= */

  @Get()
  @Permissions(PERMISSIONS.tenants.read_many)
  async getTenants(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<DataRes<PageDto<Tenant>>> {
    return await this.tenantsService.getTenants(
      pageOptionsDto,
    );
  }

  /* ================= DETAIL ================= */

  @Get(':id')
  @Permissions(PERMISSIONS.tenants.read_one)
  async getTenant(
    @Param('id') id: string,
  ): Promise<DataRes<Tenant>> {
    return await this.tenantsService.getTenant(id);
  }

  /* ================= UPDATE ================= */

  @Put(':id')
  @Permissions(PERMISSIONS.tenants.update)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTenantDto,
  ): Promise<DataRes<Tenant>> {
    return await this.tenantsService.update(id, dto);
  }

  /* ================= DELETE ================= */

  @Delete(':id')
  @Permissions(PERMISSIONS.tenants.delete)
  async remove(
    @Param('id') id: string,
  ): Promise<DataRes<null>> {
    return await this.tenantsService.remove(id);
  }
}
