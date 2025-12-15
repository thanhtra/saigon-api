import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entities/baseEntity.entity';
import { Commission } from 'src/modules/commissions/entities/commission.entity';
import { UserRole } from 'src/common/helpers/enum';

@Entity('users')
export class User extends BaseEntity {
    @Column()
    name: string;

    @Column({ unique: true })
    phone: string;

    @Column({ nullable: true })
    email?: string;

    @Column()
    @Exclude() // Không trả về khi serialize
    password: string;

    @Column({ nullable: true })
    @Exclude() // Không trả về khi serialize
    refresh_token?: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.Sale,
    })
    role: UserRole;

    @Column({ default: true })
    active: boolean;

    // Quan hệ với Commission: 1 user sale có nhiều commission
    @OneToMany(() => Commission, commission => commission.sale)
    commissions: Commission[];
}
