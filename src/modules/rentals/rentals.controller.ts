import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
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
  constructor(private rentalsService: RentalsService) { }

  // ---------- ADMIN ----------

  @Post()
  @Permissions(PERMISSIONS.rentals.create)
  async create(
    @Body() dto: CreateRentalDto,
    @Req() req,
  ) {
    const rental = await this.rentalsService.create(
      dto,
      req.user,
    );
    return DataRes.success(rental);
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
  remove(@Param('id') id: string): Promise<DataRes<boolean>> {
    return this.rentalsService.remove(id);
  }

  // ---------- CUSTOMER ----------
  // @Get(':id')
  // getOneCustomer(@Param('id') id: string): Promise<DataRes<RentalCustomerDto>> {
  //   return this.rentalsService.getOneCustomer(id);
  // }
}
