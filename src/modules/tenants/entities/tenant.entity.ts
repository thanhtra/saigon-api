import { BaseEntity } from 'src/common/entities/baseEntity.entity';
import { Contract } from 'src/modules/contracts/entities/contract.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
    Column,
    Entity,
    Index,
    JoinColumn,
    OneToMany,
    OneToOne,
} from 'typeorm';

@Entity('tenants')
@Index(['user_id'], { unique: true })
@Index(['active'])
export class Tenant extends BaseEntity {

    @OneToOne(() => User, {
        eager: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    user_id: string;

    @OneToMany(() => Contract, c => c.tenant)
    contracts: Contract[];

    contractCount?: number;

    @Column({ type: 'text', nullable: true })
    note?: string;

    @Column({ default: true })
    active: boolean;
}
