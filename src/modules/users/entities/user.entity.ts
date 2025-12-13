import { Exclude } from 'class-transformer';
import {
    Column, Entity, Index
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/baseEntity.entity';
import { UserRoles } from '../../../config/userRoles';

@Entity('user', {
    orderBy: {
        createdAt: 'DESC',
    },
})
export class User extends BaseEntity {
    @Column()
    full_name: string;

    @Column({ unique: true })
    @Index()
    phone: string;

    @Column()
    @Exclude()
    password: string;

    @Column({ nullable: true })
    @Exclude()
    refresh_token: string;

    @Column({ unique: true, nullable: true })
    email: string;

    @Column({
        type: 'enum',
        enum: UserRoles,
        default: UserRoles.User,
    })
    role: string;

    @Column({ default: true })
    active: boolean;

    @Column({ nullable: true })
    avatar: string;

    @Column({ nullable: true })
    address_default: string;
}
