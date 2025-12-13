import { Injectable } from '@nestjs/common';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { getSkip } from 'src/common/helpers/utils';
import { Connection, EntityRepository, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { QueryOrderDto } from './dto/query.dto';


@Injectable()
@EntityRepository(Order)
export class OrderRepository {
  private repo: Repository<Order>;

  constructor(private connection: Connection) {
    this.repo = this.connection.getRepository(Order);
  }

  createOrder = async (createOrderDto: CreateOrderDto) => {
    return this.repo.save(createOrderDto);
  };

  getOrders = async (pageOptionsDto: PageOptionsDto): Promise<PageDto<Order>> => {
    const queryBuilder = this.repo.createQueryBuilder("order");

    queryBuilder
      .orderBy("order.createdAt", pageOptionsDto.order)
      .select(['order.id', 'order.createdAt', 'order.shipping_address', 'order.order_code', 'order.status'])
      .skip(getSkip(pageOptionsDto.page, pageOptionsDto.size))
      .take(pageOptionsDto.size);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  };

  getOrderByUser = async (pageOptionsDto: QueryOrderDto): Promise<PageDto<Order>> => {
    const queryBuilder = this.repo.createQueryBuilder("order");

    queryBuilder
      .where("order.user_id = :userId", { userId: pageOptionsDto.userId })
      .orderBy("order.createdAt", pageOptionsDto.order)
      .skip(getSkip(pageOptionsDto.page, pageOptionsDto.size))
      .take(pageOptionsDto.size);

    if (pageOptionsDto.status) {
      queryBuilder.andWhere("order.status = :status", { status: pageOptionsDto.status })
    }

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  };

  find = async () => {
    return this.repo.find();
  };

  findOneOrder = async (id: string) => {
    return this.repo.findOneOrFail({ where: { id } });
  };

  updateOrder = async (
    id: string,
    updateOrderDto: UpdateOrderDto,
  ) => {
    return this.repo.save({ ...updateOrderDto, id: String(id) });
  };

  removeOrder = async (id: string) => {
    await this.repo.findOneOrFail({ where: { id } });
    return this.repo.delete(id);
  };

}
