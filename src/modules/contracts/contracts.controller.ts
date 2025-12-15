import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Inject, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DataRes, PageDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/config/permissions';
import { ContractsService } from './contracts.service';
import { Contract } from './entities/contract.entity';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@Controller('contracts')
@UseInterceptors(ClassSerializerInterceptor)
export class ContractsController {
  constructor(
    private contractsService: ContractsService,
    @Inject(REQUEST) private request,
  ) { }

  // ---------- CREATE ----------
  @Post()
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.contracts.create)
  async create(@Body() createContractDto: CreateContractDto): Promise<DataRes<Contract>> {
    return this.contractsService.create(createContractDto);
  }

  // ---------- LIST (Customer) ----------
  @Get()
  @Public()
  async getContracts(@Query() pageOptionsDto: PageOptionsDto): Promise<DataRes<PageDto<Contract>>> {
    return this.contractsService.getAll(pageOptionsDto);
  }

  // ---------- LIST (Admin) ----------
  @Get('/admin')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.contracts.read)
  async getContractsAdmin(@Query() pageOptionsDto: PageOptionsDto): Promise<DataRes<PageDto<Contract>>> {
    return this.contractsService.getAll(pageOptionsDto); // admin cũng dùng getAll, có thể thêm filter nếu cần
  }

  // ---------- GET ONE ----------
  @Get(':id')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.contracts.read)
  async getContract(@Param('id') id: string): Promise<DataRes<Contract>> {
    return this.contractsService.getOne(id);
  }

  // ---------- UPDATE ----------
  @Put(':id')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.contracts.update)
  async update(
    @Param('id') id: string,
    @Body() updateContractDto: UpdateContractDto,
  ): Promise<DataRes<Contract>> {
    return this.contractsService.update(id, updateContractDto);
  }

  // ---------- DELETE ----------
  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.contracts.delete)
  async remove(@Param('id') id: string): Promise<DataRes<{ id: string }>> {
    return this.contractsService.remove(id);
  }

  // ---------- FILTER BY TENANT ----------
  @Get('/tenant/:tenantId')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.contracts.read)
  async getByTenant(@Param('tenantId') tenantId: string): Promise<DataRes<Contract[]>> {
    return this.contractsService.getByTenant(tenantId);
  }

  // ---------- FILTER BY RENTAL ----------
  @Get('/rental/:rentalId')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.contracts.read)
  async getByRental(@Param('rentalId') rentalId: string): Promise<DataRes<Contract[]>> {
    return this.contractsService.getByRental(rentalId);
  }

  // ---------- FILTER BY ROOM ----------
  @Get('/room/:roomId')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.contracts.read)
  async getByRoom(@Param('roomId') roomId: string): Promise<DataRes<Contract[]>> {
    return this.contractsService.getByRoom(roomId);
  }
}
