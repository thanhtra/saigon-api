import { BaseEntity } from 'src/common/entities/baseEntity.entity';
import { CommissionStatus } from 'src/common/helpers/enum';
import { Collaborator } from 'src/modules/collaborators/entities/collaborator.entity';
import { Contract } from 'src/modules/contracts/entities/contract.entity';
import { Rental } from 'src/modules/rentals/entities/rental.entity';
import { Room } from 'src/modules/rooms/entities/rooms.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';

@Entity('commissions')
export class Commission extends BaseEntity {
    @ManyToOne(() => Contract)
    contract: Contract;

    @ManyToOne(() => Rental)
    rental: Rental;

    @ManyToOne(() => Room)
    room: Room;

    @ManyToOne(() => User)
    sale: User;

    @Column()
    amount: number;

    @Column({
        type: 'enum',
        enum: CommissionStatus,
        default: CommissionStatus.Pending,
    })
    status: CommissionStatus;

    @ManyToOne(() => Collaborator)
    collaborator: Collaborator;

}
