import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Inject, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DataRes, PageDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { PERMISSIONS } from 'src/config/permissions';
import { CommissionsService } from './commissions.service';
import { Commission } from './entities/commission.entity';
import { CreateCommissionDto } from './dto/create-commission.dto';
import { UpdateCommissionDto } from './dto/update-commission.dto';

@Controller('commissions')
@UseInterceptors(ClassSerializerInterceptor)
export class CommissionsController {
  constructor(
    private readonly commissionsService: CommissionsService,
    @Inject(REQUEST) private readonly request: any,
  ) { }

  @Post()
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.commissions.create)
  async create(@Body() dto: CreateCommissionDto): Promise<DataRes<Commission>> {
    return this.commissionsService.create(dto);
  }

  @Get()
  @Public()
  async getAll(@Query() pageOptionsDto: PageOptionsDto): Promise<DataRes<PageDto<Commission>>> {
    return this.commissionsService.getAll(pageOptionsDto);
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.commissions.read)
  async getOne(@Param('id') id: string): Promise<DataRes<Commission>> {
    return this.commissionsService.getOne(id);
  }

  @Put(':id')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.commissions.update)
  async update(@Param('id') id: string, @Body() dto: UpdateCommissionDto): Promise<DataRes<Commission>> {
    return this.commissionsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.commissions.delete)
  async remove(@Param('id') id: string): Promise<DataRes<{ id: string }>> {
    return this.commissionsService.remove(id);
  }

  @Get('/contract/:contractId')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.commissions.read)
  async getByContract(@Param('contractId') contractId: string): Promise<DataRes<Commission[]>> {
    return this.commissionsService.getByContract(contractId);
  }

  @Get('/sale/:saleId')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.commissions.read)
  async getBySale(@Param('saleId') saleId: string): Promise<DataRes<Commission[]>> {
    return this.commissionsService.getBySale(saleId);
  }

  @Get('/collaborator/:collaboratorId')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.commissions.read)
  async getByCollaborator(@Param('collaboratorId') collaboratorId: string): Promise<DataRes<Commission[]>> {
    return this.commissionsService.getByCollaborator(collaboratorId);
  }
}
