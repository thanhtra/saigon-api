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

import {
  DataRes,
  PageDto,
  PageOptionsDto,
} from 'src/common/dtos/respones.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/config/permissions';

import { ContractsService } from './contracts.service';
import { Contract } from './entities/contract.entity';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@Controller('contracts')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(PermissionsGuard)
export class ContractsController {
  constructor(
    private readonly contractsService: ContractsService,
  ) { }

  /* ================= CREATE ================= */

  @Post()
  @Permissions(PERMISSIONS.contracts.create)
  async create(
    @Body() dto: CreateContractDto,
  ): Promise<DataRes<Contract>> {
    return await this.contractsService.create(dto);
  }

  /* ================= LIST ================= */

  @Get()
  @Permissions(PERMISSIONS.contracts.read)
  async getContracts(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<DataRes<PageDto<Contract>>> {
    return await this.contractsService.getAll(pageOptionsDto);
  }

  /* ================= DETAIL ================= */

  @Get(':id')
  @Permissions(PERMISSIONS.contracts.read)
  async getContract(
    @Param('id') id: string,
  ): Promise<DataRes<Contract>> {
    return await this.contractsService.getOne(id);
  }

  /* ================= UPDATE ================= */

  @Put(':id')
  @Permissions(PERMISSIONS.contracts.update)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateContractDto,
  ): Promise<DataRes<Contract>> {
    return await this.contractsService.update(id, dto);
  }

  /* ================= DELETE ================= */

  @Delete(':id')
  @Permissions(PERMISSIONS.contracts.delete)
  async remove(
    @Param('id') id: string,
  ): Promise<DataRes<null>> {
    return await this.contractsService.remove(id);
  }

  /* ================= FILTER ================= */

  @Get('tenant/:tenantId')
  @Permissions(PERMISSIONS.contracts.read)
  async getByTenant(
    @Param('tenantId') tenantId: string,
  ): Promise<DataRes<Contract[]>> {
    return await this.contractsService.getByTenant(tenantId);
  }

  @Get('rental/:rentalId')
  @Permissions(PERMISSIONS.contracts.read)
  async getByRental(
    @Param('rentalId') rentalId: string,
  ): Promise<DataRes<Contract[]>> {
    return await this.contractsService.getByRental(rentalId);
  }

  @Get('room/:roomId')
  @Permissions(PERMISSIONS.contracts.read)
  async getByRoom(
    @Param('roomId') roomId: string,
  ): Promise<DataRes<Contract[]>> {
    return await this.contractsService.getByRoom(roomId);
  }
}
