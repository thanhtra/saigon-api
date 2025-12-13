import {
    Column, Entity
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/baseEntity.entity';

@Entity('address', {
    orderBy: {
        createdAt: 'DESC',
    },
})

export class Address extends BaseEntity {
    @Column()
    name: string;

    @Column()
    phone: string;

    @Column()
    province: string;

    @Column()
    district: string;

    @Column()
    ward: string;

    @Column()
    address_detail: string;

    @Column()
    user_id: string;
}
