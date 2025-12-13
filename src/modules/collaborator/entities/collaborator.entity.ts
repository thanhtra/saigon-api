import {
    Column, Entity
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/baseEntity.entity';

@Entity('collaborator', {
    orderBy: {
        createdAt: 'DESC',
    },
})

export class Collaborator extends BaseEntity {
    @Column()
    name: string;

    @Column({ unique: true })
    phone: string;

    @Column({ nullable: true })
    zalo: string;

    @Column({ nullable: true })
    link_facebook: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    age: string;

    @Column({ nullable: true })
    gender: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    field_cooperation: string;

    @Column({ nullable: true })
    position: string;

    @Column({ nullable: true })
    avatar: string;

    @Column({ default: true })
    active: boolean;
}
