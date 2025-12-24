import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/entities/baseEntity.entity';
import { UserRole } from 'src/common/helpers/enum';
import { Column, Entity, Index } from 'typeorm';


@Entity('users')
@Index(['phone'], { unique: true })
@Index(['email'], { unique: true, where: `"email" IS NOT NULL` })
@Index(['cccd'], { unique: true, where: `"cccd" IS NOT NULL` })
export class User extends BaseEntity {

    // 🔐 Phân quyền hệ thống
    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.Tenant,
    })
    role: UserRole;

    // 🧾 Thông tin cơ bản
    @Column()
    name: string;

    @Column()
    phone: string;

    @Column({ nullable: true })
    email?: string;

    @Column({ nullable: true })
    cccd?: string;

    // 🔒 Auth
    @Column()
    @Exclude()
    password: string;

    @Column({ nullable: true })
    @Exclude()
    refresh_token?: string;

    // 📌 Trạng thái
    @Column({ default: true })
    active: boolean;

    // 📞 Liên hệ
    @Column({ nullable: true })
    zalo?: string;

    @Column({ nullable: true })
    link_facebook?: string;

    @Column({ type: 'text', nullable: true })
    address?: string;

    @Column({ type: 'text', nullable: true })
    note?: string;
}
