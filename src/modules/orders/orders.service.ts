import { Injectable } from '@nestjs/common';
import { Enums } from 'src/common/dtos/enum.dto';
import { DataRes, PageDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { ErrorMes } from 'src/common/helpers/errorMessage';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderRepository } from './orders.repository';
import { OrderStatus } from 'src/config/orderStatus';
import { generateOrderCode } from 'src/common/helpers/utils';
import { QueryOrderDto } from './dto/query.dto';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class OrdersService {
  constructor(private orderRepository: OrderRepository, private usersRepository: UsersRepository) { }

  async create(createOrderDto: CreateOrderDto): Promise<DataRes<Order>> {
    var res = new DataRes<Order>();

    try {
      const payload = {
        ...createOrderDto,
        order_code: generateOrderCode(),
        status: OrderStatus.NEW
      }
      const created = await this.orderRepository.createOrder(payload);

      if (!created) {
        res.setFailed(ErrorMes.ORDER_CREATE);
      } else {
        res.setSuccess(created);
      }
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async getOrders(pageOptionsDto: PageOptionsDto): Promise<DataRes<PageDto<Order>>> {
    var res = new DataRes<PageDto<Order>>;

    try {
      const list = await this.orderRepository.getOrders(pageOptionsDto);

      if (!list) {
        res.setFailed(ErrorMes.ORDER_GET_ALL);
        return res;
      }

      res.setSuccess(list);
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async getOrderByUser(queryOrderDto: QueryOrderDto): Promise<DataRes<PageDto<Order>>> {
    var res = new DataRes<PageDto<Order>>;

    try {
      const list = await this.orderRepository.getOrderByUser(queryOrderDto);

      if (!list) {
        res.setFailed(ErrorMes.ORDER_GET_ALL);
        return res;
      }

      res.setSuccess(list);
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  getEnums(): DataRes<Enums[]> {
    var res = new DataRes<Enums[]>;

    try {
      let arr: Array<Enums> = [];
      Object.entries(CreateOrderDto.getEnums()).forEach(item => {
        arr.push({
          label: item[1],
          value: item[0]
        })
      });

      if (!arr.length) {
        res.setFailed(ErrorMes.ENUMS_GET_ALL);
      }
      res.setSuccess(arr);
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async getOrder(id: string): Promise<DataRes<any>> {
    var res = new DataRes<any>();

    try {
      const order = await this.orderRepository.findOneOrder(id);

      if (!order) {
        res.setFailed(ErrorMes.ORDER_GET_DETAIL);
      }

      const user = await this.usersRepository.findOneUser(order?.user_id);
      if (!user) {
        res.setFailed(ErrorMes.ORDER_GET_DETAIL);
      }

      res.setSuccess({ ...order, user });
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<DataRes<Partial<Order>>> {
    var res = new DataRes<Partial<Order>>();

    try {
      const updated = await this.orderRepository.updateOrder(id, updateOrderDto);

      if (!updated) {
        res.setFailed(ErrorMes.ORDER_UPDATE);
      } else {
        res.setSuccess(updated);
      }
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async remove(id: string): Promise<DataRes<any>> {
    var res = new DataRes<any>();

    try {
      const { affected } = await this.orderRepository.removeOrder(id);

      if (affected === 1) {
        res.setSuccess(null);
      } else {
        res.setFailed(ErrorMes.ORDER_REMOVE);
      }
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

}
