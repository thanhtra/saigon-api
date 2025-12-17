import { BaseEntity } from 'src/common/entities/baseEntity.entity';
import { Contract } from 'src/modules/contracts/entities/contract.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
    Entity,
    OneToMany,
    OneToOne,
    JoinColumn,
    Column,
} from 'typeorm';

@Entity('tenants')
export class Tenant extends BaseEntity {

    // 🔑 Gắn với user (1-1)
    @OneToOne(() => User, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    user_id: string;

    // 🏠 Lịch sử hợp đồng
    @OneToMany(() => Contract, c => c.tenant)
    contracts: Contract[];

    // 📌 Thông tin nghiệp vụ (tuỳ mở rộng)
    @Column({ type: 'text', nullable: true })
    note?: string;
}
