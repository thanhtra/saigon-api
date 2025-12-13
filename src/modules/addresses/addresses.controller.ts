import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Inject, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { DataRes, PageDto } from 'src/common/dtos/respones.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { PERMISSIONS } from 'src/config/permissions';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { QueryAddressDto } from './dto/query.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';


@Controller('addresses')
@UseInterceptors(ClassSerializerInterceptor)
export class AddressesController {
  constructor(private addressesService: AddressesService,
    @Inject(REQUEST) private request,) { }


  @Post()
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.addresses.create)
  async create(@Body() createAddressDto: CreateAddressDto): Promise<DataRes<Address>> {
    return await this.addressesService.create(createAddressDto);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.addresses.read)
  getAddresses(@Query() query: QueryAddressDto): Promise<DataRes<PageDto<Address>>> {
    return this.addressesService.getAddresses(query);
  }

  @Get(':id/detail')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.addresses.read)
  async findOne(@Param('id') id: string): Promise<DataRes<Address>> {
    return await this.addressesService.getAddress(id);
  }

  @Put(':id/update')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.addresses.update)
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<DataRes<Partial<Address>>> {
    return await this.addressesService.update(id, updateAddressDto);
  }

  @Delete(':id/delete')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.addresses.delete)
  async remove(@Param('id') id: string): Promise<DataRes<any>> {
    return await this.addressesService.remove(id);
  }

}
