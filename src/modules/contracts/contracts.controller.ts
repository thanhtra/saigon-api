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
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { Contract } from './entities/contract.entity';

@Controller('contracts')
export class ContractsController {
  constructor(
    private readonly contractsService: ContractsService,
  ) { }

  /* ================= ADMIN ================= */

  @Post()
  @Auth(PERMISSIONS.contracts.create)
  async create(
    @Body() dto: CreateContractDto,
  ): Promise<DataRes<Contract>> {
    return await this.contractsService.create(dto);
  }

  @Get()
  @Auth(PERMISSIONS.contracts.read)
  async getContracts(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<DataRes<PageDto<Contract>>> {
    return await this.contractsService.getAll(pageOptionsDto);
  }

  @Get(':id')
  @Auth(PERMISSIONS.contracts.read)
  async getContract(
    @Param('id') id: string,
  ): Promise<DataRes<Contract>> {
    return await this.contractsService.getOne(id);
  }

  @Put(':id')
  @Auth(PERMISSIONS.contracts.update)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateContractDto,
  ): Promise<DataRes<Contract>> {
    return await this.contractsService.update(id, dto);
  }

  @Delete(':id')
  @Auth(PERMISSIONS.contracts.delete)
  async remove(
    @Param('id') id: string,
  ): Promise<DataRes<null>> {
    return await this.contractsService.remove(id);
  }

  @Get('tenant/:tenantId')
  @Auth(PERMISSIONS.contracts.read)
  async getByTenant(
    @Param('tenantId') tenantId: string,
  ): Promise<DataRes<Contract[]>> {
    return await this.contractsService.getByTenant(tenantId);
  }

  @Get('rental/:rentalId')
  @Auth(PERMISSIONS.contracts.read)
  async getByRental(
    @Param('rentalId') rentalId: string,
  ): Promise<DataRes<Contract[]>> {
    return await this.contractsService.getByRental(rentalId);
  }

  @Get('room/:roomId')
  @Auth(PERMISSIONS.contracts.read)
  async getByRoom(
    @Param('roomId') roomId: string,
  ): Promise<DataRes<Contract[]>> {
    return await this.contractsService.getByRoom(roomId);
  }
}
