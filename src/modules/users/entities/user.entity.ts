import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/entities/baseEntity.entity';
import { UserRole } from 'src/common/helpers/enum';
import { Column, Entity, Index } from 'typeorm';


// Xác thực, phân quyền
@Entity('users')
export class User extends BaseEntity {
    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.Tenant,
    })
    role: UserRole;

    @Column()
    name: string;

    @Index({ unique: true })
    @Column()
    phone: string;

    @Column({ nullable: true })
    email?: string;

    @Index({ unique: true })
    @Column({ nullable: true })
    cccd?: string;

    @Column()
    @Exclude()
    password: string;

    @Column({ nullable: true })
    @Exclude()
    refresh_token?: string;

    @Column({ default: true })
    active: boolean;

    @Column({ nullable: true })
    zalo?: string;

    @Column({ nullable: true })
    link_facebook: string;

    @Column({ type: 'text', nullable: true })
    address?: string;

    @Column({ type: 'text', nullable: true })
    note?: string;

}
