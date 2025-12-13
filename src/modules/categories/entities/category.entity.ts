import {
    Column, Entity
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/baseEntity.entity';
import { CategoryType } from '../../../config/categoryType';

@Entity('category', {
    orderBy: {
        createdAt: 'DESC',
    },
})

export class Category extends BaseEntity {
    @Column()
    name: string;

    @Column({
        type: 'enum',
        enum: CategoryType
    })
    type: string;

    @Column()
    description: string;

    @Column({
        type: 'boolean',
        default: true
    })
    active: boolean

    // @OneToMany(() => Land, (item) => item.category)
    // public lands: Land[];

}
