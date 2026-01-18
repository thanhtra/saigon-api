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
import { Auth } from 'src/common/decorators/auth.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { DataRes, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { PERMISSIONS } from 'src/config/permissions';
import { User } from '../users/entities/user.entity';
import { CreateRentalDto, CustomerCreateBoardingHousesDto, CustomerCreateUnitRentalDto } from './dto/create-rental.dto';
import { GetRentalsByCollaboratorDto } from './dto/get-rentals-by-collaborator.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { Rental } from './entities/rental.entity';
import { RentalsService } from './rentals.service';

@Controller('rentals')
export class RentalsController {
  constructor(
    private readonly rentalsService: RentalsService,
  ) { }

  /* ================= ADMIN ================= */
  @Post('admintra')
  @Auth(PERMISSIONS.rentals.create)
  async create(
    @Body() dto: CreateRentalDto,
    @CurrentUser() user: User,
  ): Promise<DataRes<any>> {
    return await this.rentalsService.create(dto, user);
  }

  @Get('admintra')
  @Auth(PERMISSIONS.rentals.read_many)
  async getListRentals(
    @Query() pageOptions: PageOptionsDto,
  ): Promise<DataRes<any>> {
    return await this.rentalsService.getListRentals(pageOptions);
  }

  @Get('by-collaborator/admintra')
  @Auth(PERMISSIONS.rentals.read_many)
  async getByCollaborator(
    @Query() query: GetRentalsByCollaboratorDto,
  ): Promise<DataRes<Rental[]>> {
    return this.rentalsService.getByCollaborator(
      query.collaborator_id,
      query.active,
    );
  }

  @Get(':id/admintra')
  @Auth(PERMISSIONS.rentals.read_one)
  async findOneAdmin(
    @Param('id') id: string,
  ): Promise<DataRes<Rental>> {
    return await this.rentalsService.findOneAdmin(id);
  }

  @Put(':id/admintra')
  @Auth(PERMISSIONS.rentals.update)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRentalDto,
  ): Promise<DataRes<Rental>> {
    return await this.rentalsService.update(id, dto);
  }

  @Delete(':id/force/admintra')
  @Auth(PERMISSIONS.rentals.force_delete)
  async forceDelete(
    @Param('id') id: string,
  ): Promise<DataRes<boolean>> {
    return await this.rentalsService.forceDelete(id);
  }


  // CUSTOMER

  @Get('customer/my-boarding-houses')
  @Auth(PERMISSIONS.rentals.my_boarding_houses)
  async getMyBoardingHouses(
    @CurrentUser() user: User,
  ): Promise<DataRes<any>> {
    return await this.rentalsService.getMyBoardingHouses(user);
  }

  @Post('customer/create-boarding-houses')
  @Auth(PERMISSIONS.rentals.create_boarding_houses)
  async customerCreateBoardingHouses(
    @Body() dto: CustomerCreateBoardingHousesDto,
    @CurrentUser() user: User,
  ): Promise<DataRes<any>> {
    return await this.rentalsService.customerCreateBoardingHouses(dto, user);
  }

  @Post('customer/create-unit-rental')
  @Auth(PERMISSIONS.rentals.create_unit_rental)
  async customerCreateUnitRental(
    @Body() dto: CustomerCreateUnitRentalDto,
    @CurrentUser() user: User,
  ): Promise<DataRes<any>> {
    return await this.rentalsService.customerCreateUnitRental(dto, user);
  }



}
