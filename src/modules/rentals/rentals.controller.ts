import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req
} from '@nestjs/common';
import { Auth } from 'src/common/decorators/auth.decorator';
import { DataRes, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { PERMISSIONS } from 'src/config/permissions';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { Rental } from './entities/rental.entity';
import { RentalsService } from './rentals.service';
import { User } from '../users/entities/user.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('rentals')
export class RentalsController {
  constructor(
    private readonly rentalsService: RentalsService,
  ) { }

  /* ================= ADMIN ================= */

  @Post()
  @Auth(PERMISSIONS.rentals.create)
  async create(
    @Body() dto: CreateRentalDto,
    @CurrentUser() user: User,
  ): Promise<DataRes<any>> {
    return await this.rentalsService.create(dto, user);
  }

  @Get()
  @Auth(PERMISSIONS.rentals.read_many)
  async getListRentals(
    @Query() pageOptions: PageOptionsDto,
  ): Promise<DataRes<any>> {
    return await this.rentalsService.getListRentals(pageOptions);
  }

  @Get('by-collaborator')
  @Auth(PERMISSIONS.rentals.read_many)
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
  @Auth(PERMISSIONS.rentals.read_one)
  async getOneAdmin(
    @Param('id') id: string,
  ): Promise<DataRes<Rental>> {
    return await this.rentalsService.getOneAdmin(id);
  }

  @Put(':id')
  @Auth(PERMISSIONS.rentals.update)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRentalDto,
  ): Promise<DataRes<Rental>> {
    return await this.rentalsService.update(id, dto);
  }

  @Delete(':id')
  @Auth(PERMISSIONS.rentals.delete)
  async remove(
    @Param('id') id: string,
  ): Promise<DataRes<boolean>> {
    return await this.rentalsService.remove(id);
  }

}
