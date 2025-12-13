import { BaseEntity } from 'src/common/entities/baseEntity.entity';
import {
    Column, Entity
} from 'typeorm';

@Entity('product', {
    orderBy: {
        createdAt: 'DESC',
    },
})

export class Product extends BaseEntity {
    @Column()
    slug: string;

    @Column()
    name: string;

    @Column()
    category_id: string;

    @Column({ nullable: true })
    price_from: number;

    @Column()
    packs: string;

    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true })
    brief_description: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    collaborator_id: string;

    @Column({ nullable: true })
    note: string;

    @Column()
    status: string;

    @Column({ nullable: true })
    status_post: string;

    @Column({ nullable: true })
    user_id: string;

    @Column({ default: true })
    active: boolean;

    @Column({ nullable: true, default: false })
    is_have_video: boolean;
}
