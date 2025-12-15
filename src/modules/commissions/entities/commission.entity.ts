// commissions.entity.ts
import { BaseEntity } from 'src/common/entities/baseEntity.entity';
import { CommissionStatus } from 'src/common/helpers/enum';
import { Collaborator } from 'src/modules/collaborators/entities/collaborator.entity';
import { Contract } from 'src/modules/contracts/entities/contract.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';

@Entity('commissions')
export class Commission extends BaseEntity {
    @OneToOne(() => Contract)
    @JoinColumn()
    contract: Contract;

    @ManyToOne(() => User)
    sale: User;

    @ManyToOne(() => Collaborator)
    collaborator: Collaborator;

    @Column()
    amount: number;

    @Column({
        type: 'enum',
        enum: CommissionStatus,
        default: CommissionStatus.Pending,
    })
    status: CommissionStatus;
}
