import { BaseEntity } from 'src/common/entities/baseEntity.entity';
import { Contract } from 'src/modules/contracts/entities/contract.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
    Entity,
    OneToMany,
    OneToOne,
    JoinColumn,
    Column,
    Index,
} from 'typeorm';

@Entity('tenants')
@Index(['user_id'], { unique: true })
export class Tenant extends BaseEntity {

    /* ================= USER ================= */
    @OneToOne(() => User, {
        eager: true,        // 🔥 ADMIN LIST CẦN
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    user_id: string;

    /* ================= CONTRACTS ================= */
    @OneToMany(() => Contract, c => c.tenant)
    contracts: Contract[];

    // 👉 field ảo – không lưu DB
    contractCount?: number;

    /* ================= BUSINESS ================= */
    @Column({ type: 'text', nullable: true })
    note?: string;

    // 👉 trạng thái theo nghiệp vụ tenant
    @Column({ default: true })
    active: boolean;
}
