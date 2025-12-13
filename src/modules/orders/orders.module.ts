import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrderRepository } from './orders.repository';
import { UsersRepository } from '../users/users.repository';

@Module({
  controllers: [OrdersController],
  exports: [OrdersService],
  providers: [OrdersService, OrderRepository, UsersRepository]
})
export class OrdersModule { }