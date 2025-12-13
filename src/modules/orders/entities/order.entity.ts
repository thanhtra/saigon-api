import {
    Column, Entity
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/baseEntity.entity';

@Entity('order', {
    orderBy: {
        createdAt: 'DESC',
    },
})

export class Order extends BaseEntity {
    @Column()
    order_code: string;

    @Column()
    user_id: string;

    @Column()
    order_detail: string;

    @Column()
    shipping_address: string;

    @Column({ nullable: true })
    note: string;

    @Column()
    status: string;
}
