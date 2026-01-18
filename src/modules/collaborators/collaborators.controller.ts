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
} from 'src/common/dtos/respones.dto';
import { PERMISSIONS } from 'src/config/permissions';

import { Auth } from 'src/common/decorators/auth.decorator';
import { CollaboratorsService } from './collaborators.service';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { GetAvailableCollaboratorsDto } from './dto/get-available-collaborators.dto';
import { QueryCollaboratorDto } from './dto/query-collaborator.dto';
import { UpdateCollaboratorDto } from './dto/update-collaborator.dto';
import { Collaborator } from './entities/collaborator.entity';

@Controller('collaborators')
export class CollaboratorsController {
  constructor(
    private readonly collaboratorsService: CollaboratorsService,
  ) { }


  @Post('admintra')
  @Auth(PERMISSIONS.collaborators.create)
  async create(
    @Body() dto: CreateCollaboratorDto,
  ): Promise<DataRes<Collaborator>> {
    return await this.collaboratorsService.create(dto);
  }

  @Get('admintra')
  @Auth(PERMISSIONS.collaborators.read_many)
  async getCollaborators(
    @Query() query: QueryCollaboratorDto,
  ): Promise<DataRes<PageDto<Collaborator>>> {
    return await this.collaboratorsService.getCollaborators(query);
  }

  @Get('available/admintra')
  @Auth(PERMISSIONS.collaborators.read_many)
  async getAvailableCollaborators(
    @Query() query: GetAvailableCollaboratorsDto,
  ) {
    return this.collaboratorsService.getAvailableCollaborators(query);
  }

  @Get(':id/admintra')
  @Auth(PERMISSIONS.collaborators.read_one)
  async getCollaborator(
    @Param('id') id: string,
  ): Promise<DataRes<Collaborator>> {
    return await this.collaboratorsService.getOne(id);
  }

  @Put(':id/admintra')
  @Auth(PERMISSIONS.collaborators.update)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCollaboratorDto,
  ): Promise<DataRes<Collaborator>> {
    return await this.collaboratorsService.update(id, dto);
  }

  @Delete(':id/admintra')
  @Auth(PERMISSIONS.collaborators.delete)
  async remove(
    @Param('id') id: string,
  ): Promise<DataRes<null>> {
    return await this.collaboratorsService.remove(id);
  }

}
