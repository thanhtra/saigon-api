
import { BaseEntity } from '../../../common/entities/baseEntity.entity';
import { Entity, Column } from 'typeorm';


@Entity('discovery', {
    orderBy: {
        createdAt: 'ASC',
    },
})
export class Discovery extends BaseEntity {
    @Column()
    title: string;

    @Column()
    brief_description: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    image: string;

    @Column()
    slug: string;

    @Column({ nullable: true })
    district: string;

    @Column({ default: true })
    active: boolean;

    @Column()
    category_id: string;
}
