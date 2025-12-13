import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Inject, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Enums } from 'src/common/dtos/enum.dto';
import { DataRes, PageDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { PERMISSIONS } from 'src/config/permissions';
import { Public } from '../../common/decorators/public.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { QueryOrderDto } from './dto/query.dto';

@Controller('orders')
@UseInterceptors(ClassSerializerInterceptor)
export class OrdersController {
  constructor(private ordersService: OrdersService,
    @Inject(REQUEST) private request,) { }


  @Post()
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.orders.create)
  async create(@Body() createOrderDto: CreateOrderDto): Promise<DataRes<Order>> {
    return await this.ordersService.create(createOrderDto);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.orders.read)
  getOrders(@Query() pageOptionsDto: PageOptionsDto): Promise<DataRes<PageDto<Order>>> {
    return this.ordersService.getOrders(pageOptionsDto);
  }

  @Get('/order-by-user')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.orders.read)
  getOrderByUser(@Query() queryOrderDto: QueryOrderDto): Promise<DataRes<PageDto<Order>>> {
    return this.ordersService.getOrderByUser(queryOrderDto);
  }

  @Get('/enums')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.orders.enums)
  getEnums(): DataRes<Enums[]> {
    return this.ordersService.getEnums();
  }

  @Get(':id/detail')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.orders.read)
  async findOne(@Param('id') id: string): Promise<DataRes<any>> {
    return await this.ordersService.getOrder(id);
  }

  @Put(':id/update')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.orders.update)
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<DataRes<Partial<Order>>> {
    return await this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id/delete')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.orders.delete)
  async remove(@Param('id') id: string): Promise<DataRes<any>> {
    return await this.ordersService.remove(id);
  }

}
