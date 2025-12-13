import {
    Column, Entity
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/baseEntity.entity';

@Entity('image', {
    orderBy: {
        createdAt: 'DESC',
    },
})

export class Image extends BaseEntity {
    @Column()
    name: string;

    @Column()
    product_id: string;
}
