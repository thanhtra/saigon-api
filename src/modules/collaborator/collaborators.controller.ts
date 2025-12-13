import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Inject, Param, Post, Query, UseInterceptors } from '@nestjs/common';
import { Put, UseGuards } from '@nestjs/common/decorators';
import { REQUEST } from '@nestjs/core';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { Enums } from 'src/common/dtos/enum.dto';
import { DataRes, PageDto, PageOptionsDto } from "src/common/dtos/respones.dto";
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { PERMISSIONS } from 'src/config/permissions';
import { CollaboratorsService } from './collaborators.service';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { UpdateCollaboratorDto } from './dto/update-collaborator.dto';
import { Collaborator } from './entities/collaborator.entity';

@Controller('collaborators')
@UseInterceptors(ClassSerializerInterceptor)
export class CollaboratorsController {
  constructor(private collaboratorsService: CollaboratorsService,
    @Inject(REQUEST) private request,) { }

  @Post()
  async create(
    @Body() createCollaboratorDto: CreateCollaboratorDto,
  ): Promise<DataRes<Collaborator>> {
    return await this.collaboratorsService.create(createCollaboratorDto);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.collaborators.read_many)
  async getCollaborators(@Query() pageOptionsDto: PageOptionsDto): Promise<DataRes<PageDto<Collaborator>>> {
    return await this.collaboratorsService.getCollaborators(pageOptionsDto);
  }

  @Get('/getall')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.collaborators.read_many)
  async getAllCollaborators(@Query() pageOptionsDto: PageOptionsDto): Promise<DataRes<PageDto<Collaborator>>> {
    return await this.collaboratorsService.getAllCollaborators(pageOptionsDto);
  }

  @Get(':id/detail')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.collaborators.read_one)
  async getCollaborator(@Param('id') id: string): Promise<DataRes<Collaborator>> {
    return this.collaboratorsService.getCollaborator(id);
  }

  @Get(':id/contact-detail')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.collaborators.read_one)
  async getContactDetail(@Param('id') id: string): Promise<DataRes<any>> {
    return this.collaboratorsService.getContactDetail(id);
  }

  @Get('/enums')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.collaborators.enums)
  getEnums(): DataRes<Enums[]> {
    return this.collaboratorsService.getEnums();
  }

  @Put(':id/update')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.collaborators.update)
  async update(
    @Param('id') id: string,
    @Body() updateCollaboratorDto: UpdateCollaboratorDto,
  ): Promise<DataRes<Collaborator>> {
    return this.collaboratorsService.update(id, updateCollaboratorDto);
  }

  @Delete(':id/delete')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.collaborators.delete)
  async remove(@Param('id') id: string): Promise<DataRes<Collaborator>> {
    return this.collaboratorsService.removeCollaborator(id);
  }

}
