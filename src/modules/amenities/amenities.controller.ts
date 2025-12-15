import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/config/permissions';
import { AmenitiesService } from './amenities.service';
import { DataRes } from 'src/common/dtos/respones.dto';
import { CreateAmenityDto } from './dto/create-amenitie.dto';
import { UpdateAmenityDto } from './dto/update-amenitie.dto';

@Controller('amenities')
@UseGuards(PermissionsGuard)
export class AmenitiesController {
  constructor(private readonly amenitiesService: AmenitiesService) { }

  @Post()
  @Permissions(PERMISSIONS.amenities.create)
  create(@Body() dto: CreateAmenityDto): Promise<DataRes<any>> {
    return this.amenitiesService.create(dto);
  }

  @Get()
  @Permissions(PERMISSIONS.amenities.read)
  getAll(): Promise<DataRes<any>> {
    return this.amenitiesService.getAll();
  }

  @Get(':id')
  @Permissions(PERMISSIONS.amenities.read)
  getOne(@Param('id') id: string): Promise<DataRes<any>> {
    return this.amenitiesService.getOne(id);
  }

  @Put(':id')
  @Permissions(PERMISSIONS.amenities.update)
  update(@Param('id') id: string, @Body() dto: UpdateAmenityDto): Promise<DataRes<any>> {
    return this.amenitiesService.update(id, dto);
  }

  @Delete(':id')
  @Permissions(PERMISSIONS.amenities.delete)
  remove(@Param('id') id: string): Promise<DataRes<any>> {
    return this.amenitiesService.remove(id);
  }
}
