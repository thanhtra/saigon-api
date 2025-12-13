import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/baseEntity.entity';

@Entity('land', {
    orderBy: {
        createdAt: 'ASC',
    },
})
export class Land extends BaseEntity {
    @Column({ unique: true })
    title: string;

    @Column()
    price: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    acreage: string;

    @Column()
    district: string;

    @Column()
    ward: string;

    @Column({ nullable: true })
    address_detail: string;

    @Column({ default: true })
    active: boolean;

    @Column()
    category_id: string;

    @Column({ nullable: true })
    image: string;

    @Column()
    slug: string;

    @Column({ nullable: true })
    price_level: string;

    @Column({ nullable: true })
    acreage_level: string;

    @Column({ nullable: true })
    commission: string;

    @Column({ nullable: true })
    collaborator_id: string;

    @Column({ default: 'new' })
    status: string;

    @Column({ nullable: true })
    user_id: string;

    @Column({ nullable: true, default: false })
    is_have_video: boolean;

}
