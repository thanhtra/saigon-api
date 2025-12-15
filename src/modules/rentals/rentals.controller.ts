import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { PageOptionsDto, DataRes } from 'src/common/dtos/respones.dto';
import { Rental } from './entities/rental.entity';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/config/permissions';
import { RentalCustomerDto } from './dto/rental-customer.dto';

@Controller('rentals')
@UseGuards(PermissionsGuard)
export class RentalsController {
  constructor(private rentalsService: RentalsService) { }

  // ---------- ADMIN ----------
  @Post()
  @Permissions(PERMISSIONS.rentals.create)
  create(@Body() dto: CreateRentalDto): Promise<DataRes<Rental>> {
    return this.rentalsService.create(dto);
  }

  @Get()
  @Permissions(PERMISSIONS.rentals.read_many)
  getAll(@Query() pageOptions: PageOptionsDto): Promise<DataRes<any>> {
    return this.rentalsService.getAll(pageOptions);
  }

  @Get('admin/:id')
  @Permissions(PERMISSIONS.rentals.read_one)
  getOneAdmin(@Param('id') id: string): Promise<DataRes<Rental>> {
    return this.rentalsService.getOneAdmin(id);
  }

  @Put(':id')
  @Permissions(PERMISSIONS.rentals.update)
  update(@Param('id') id: string, @Body() dto: UpdateRentalDto): Promise<DataRes<Rental>> {
    return this.rentalsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions(PERMISSIONS.rentals.delete)
  remove(@Param('id') id: string): Promise<DataRes<null>> {
    return this.rentalsService.remove(id);
  }

  // ---------- CUSTOMER ----------
  @Get(':id')
  getOneCustomer(@Param('id') id: string): Promise<DataRes<RentalCustomerDto>> {
    return this.rentalsService.getOneCustomer(id);
  }
}
