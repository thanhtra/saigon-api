import { BaseEntity } from 'src/common/entities/baseEntity.entity';
import { CommissionStatus } from 'src/common/helpers/enum';
import { Contract } from 'src/modules/contracts/entities/contract.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity('commissions')
@Index(['contract_id'])
@Index(['status'])
export class Commission extends BaseEntity {

    @OneToOne(() => Contract, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({ name: 'contract_id' })
    contract: Contract;

    @Column()
    contract_id: string;

    @ManyToOne(() => User, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({ name: 'sale_id' })
    sale: User;

    @Column()
    sale_id: string;

    @Column({ type: 'int' })
    amount: number;

    @Column({
        type: 'enum',
        enum: CommissionStatus,
        default: CommissionStatus.Pending,
    })
    status: CommissionStatus;
}
