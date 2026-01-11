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

import {
  DataRes,
  PageDto,
  PageOptionsDto,
} from 'src/common/dtos/respones.dto';
import { PERMISSIONS } from 'src/config/permissions';

import { Auth } from 'src/common/decorators/auth.decorator';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { Tenant } from './entities/tenant.entity';
import { TenantsService } from './tenants.service';

@Controller('tenants')
export class TenantsController {
  constructor(
    private readonly tenantsService: TenantsService,
  ) { }

  @Post()
  @Auth(PERMISSIONS.tenants.create)
  async create(
    @Body() dto: CreateTenantDto,
  ): Promise<DataRes<Tenant>> {
    return await this.tenantsService.create(dto);
  }

  @Get()
  @Auth(PERMISSIONS.tenants.read_many)
  async getTenants(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<DataRes<PageDto<Tenant>>> {
    return await this.tenantsService.getTenants(
      pageOptionsDto,
    );
  }

  @Get(':id')
  @Auth(PERMISSIONS.tenants.read_one)
  async getTenant(
    @Param('id') id: string,
  ): Promise<DataRes<Tenant>> {
    return await this.tenantsService.getTenant(id);
  }


  @Put(':id')
  @Auth(PERMISSIONS.tenants.update)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTenantDto,
  ): Promise<DataRes<Tenant>> {
    return await this.tenantsService.update(id, dto);
  }

  @Delete(':id')
  @Auth(PERMISSIONS.tenants.delete)
  async remove(
    @Param('id') id: string,
  ): Promise<DataRes<null>> {
    return await this.tenantsService.remove(id);
  }
}
