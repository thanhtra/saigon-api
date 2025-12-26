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
} from 'src/common/dtos/respones.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { PERMISSIONS } from 'src/config/permissions';

import { CollaboratorsService } from './collaborators.service';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { UpdateCollaboratorDto } from './dto/update-collaborator.dto';
import { QueryCollaboratorDto } from './dto/query-collaborator.dto';
import { Collaborator } from './entities/collaborator.entity';

@Controller('collaborators')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(PermissionsGuard)
export class CollaboratorsController {
  constructor(
    private readonly collaboratorsService: CollaboratorsService,
  ) { }

  /* ================= CREATE ================= */

  @Post()
  @Permissions(PERMISSIONS.collaborators.create)
  async create(
    @Body() dto: CreateCollaboratorDto,
  ): Promise<DataRes<Collaborator>> {
    return await this.collaboratorsService.create(dto);
  }

  /* ================= LIST ================= */

  @Get()
  @Permissions(PERMISSIONS.collaborators.read_many)
  async getCollaborators(
    @Query() query: QueryCollaboratorDto,
  ): Promise<DataRes<PageDto<Collaborator>>> {
    return await this.collaboratorsService.getPaginated(query);
  }

  /* ================= DETAIL ================= */

  @Get(':id')
  @Permissions(PERMISSIONS.collaborators.read_one)
  async getCollaborator(
    @Param('id') id: string,
  ): Promise<DataRes<Collaborator>> {
    return await this.collaboratorsService.getOne(id);
  }

  /* ================= UPDATE ================= */

  @Put(':id')
  @Permissions(PERMISSIONS.collaborators.update)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCollaboratorDto,
  ): Promise<DataRes<Collaborator>> {
    return await this.collaboratorsService.update(id, dto);
  }

  /* ================= DELETE ================= */

  @Delete(':id')
  @Permissions(PERMISSIONS.collaborators.delete)
  async remove(
    @Param('id') id: string,
  ): Promise<DataRes<null>> {
    return await this.collaboratorsService.remove(id);
  }
}
