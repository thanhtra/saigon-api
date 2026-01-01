import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { DataRes, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { PERMISSIONS } from 'src/config/permissions';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { Rental } from './entities/rental.entity';
import { RentalsService } from './rentals.service';

@Controller('rentals')
@UseGuards(PermissionsGuard)
export class RentalsController {
  constructor(
    private readonly rentalsService: RentalsService,
  ) { }

  /* ================= ADMIN ================= */

  @Post()
  @Permissions(PERMISSIONS.rentals.create)
  async create(
    @Body() dto: CreateRentalDto,
    @Req() req,
  ): Promise<DataRes<any>> {
    return await this.rentalsService.create(dto, req.user);
  }

  @Get()
  @Permissions(PERMISSIONS.rentals.read_many)
  async getAll(
    @Query() pageOptions: PageOptionsDto,
  ): Promise<DataRes<any>> {
    return await this.rentalsService.getAll(pageOptions);
  }

  @Get('by-collaborator')
  @Permissions(PERMISSIONS.rentals.read_many)
  async getByCollaborator(
    @Query('collaborator_id') collaboratorId: string,
    @Query('active') active?: boolean,
  ): Promise<DataRes<Rental[]>> {
    return await this.rentalsService.getByCollaborator(
      collaboratorId,
      active,
    );
  }

  @Get('admin/:id')
  @Permissions(PERMISSIONS.rentals.read_one)
  async getOneAdmin(
    @Param('id') id: string,
  ): Promise<DataRes<Rental>> {
    return await this.rentalsService.getOneAdmin(id);
  }

  @Put(':id')
  @Permissions(PERMISSIONS.rentals.update)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRentalDto,
  ): Promise<DataRes<Rental>> {
    return await this.rentalsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions(PERMISSIONS.rentals.delete)
  async remove(
    @Param('id') id: string,
  ): Promise<DataRes<boolean>> {
    return await this.rentalsService.remove(id);
  }

  /* ================= CUSTOMER ================= */
  // async getOneCustomer(...) {}
}
