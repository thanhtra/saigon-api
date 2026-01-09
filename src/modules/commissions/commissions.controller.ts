import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { DataRes, PageDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { PERMISSIONS } from 'src/config/permissions';
import { CommissionsService } from './commissions.service';
import { CreateCommissionDto } from './dto/create-commission.dto';
import { UpdateCommissionDto } from './dto/update-commission.dto';
import { Commission } from './entities/commission.entity';

@Controller('commissions')
export class CommissionsController {
  constructor(
    private readonly commissionsService: CommissionsService,
    @Inject(REQUEST) private readonly request: any,
  ) { }

  @Post()
  @Auth(PERMISSIONS.commissions.create)
  async create(@Body() dto: CreateCommissionDto): Promise<DataRes<Commission>> {
    return this.commissionsService.create(dto);
  }

  @Get()
  @Auth(PERMISSIONS.commissions.read)
  async getAll(@Query() pageOptionsDto: PageOptionsDto): Promise<DataRes<PageDto<Commission>>> {
    return this.commissionsService.getAll(pageOptionsDto);
  }

  @Get(':id')
  @Auth(PERMISSIONS.commissions.read)
  async getOne(@Param('id') id: string): Promise<DataRes<Commission>> {
    return this.commissionsService.getOne(id);
  }

  @Put(':id')
  @Auth(PERMISSIONS.commissions.update)
  async update(@Param('id') id: string, @Body() dto: UpdateCommissionDto): Promise<DataRes<Commission>> {
    return this.commissionsService.update(id, dto);
  }

  @Delete(':id')
  @Auth(PERMISSIONS.commissions.delete)
  async remove(@Param('id') id: string): Promise<DataRes<{ id: string }>> {
    return this.commissionsService.remove(id);
  }

  @Get('/contract/:contractId')
  @Auth(PERMISSIONS.commissions.read)
  async getByContract(@Param('contractId') contractId: string): Promise<DataRes<Commission[]>> {
    return this.commissionsService.getByContract(contractId);
  }

  @Get('/sale/:saleId')
  @Auth(PERMISSIONS.commissions.read)
  async getBySale(@Param('saleId') saleId: string): Promise<DataRes<Commission[]>> {
    return this.commissionsService.getBySale(saleId);
  }

  @Get('/collaborator/:collaboratorId')
  @Auth(PERMISSIONS.commissions.read)
  async getByCollaborator(@Param('collaboratorId') collaboratorId: string): Promise<DataRes<Commission[]>> {
    return this.commissionsService.getByCollaborator(collaboratorId);
  }
}
