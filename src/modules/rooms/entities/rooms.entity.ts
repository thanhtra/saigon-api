import { BaseEntity } from 'src/common/entities/baseEntity.entity';
import { RoomStatus } from 'src/common/helpers/enum';
import { Collaborator } from 'src/modules/collaborators/entities/collaborator.entity';
import { Contract } from 'src/modules/contracts/entities/contract.entity';
import { Rental } from 'src/modules/rentals/entities/rental.entity';
import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';


@Entity('rooms')
@Index(['room_code'], { unique: true })
export class Room extends BaseEntity {

    @Column()
    rental_id: string;

    @ManyToOne(() => Rental, r => r.rooms, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'rental_id' })
    rental: Rental;

    @ManyToOne(() => Collaborator, c => c.rentals)
    @JoinColumn({ name: 'collaborator_id' })
    collaborator: Collaborator;

    @Column()
    collaborator_id: string;

    @Column()
    created_by: string;

    @Column()
    room_code: string;

    @Column({ nullable: true })
    floor?: number;

    @Column({ nullable: true })
    room_number?: string;

    @Column()
    price: number;

    @Column({ nullable: true })
    area?: number;

    @Column({ nullable: true })
    max_people?: number;

    @Column({ unique: true })
    slug: string;

    @Column({
        type: 'enum',
        enum: RoomStatus,
        default: RoomStatus.Available,
    })
    status: RoomStatus;

    @OneToMany(() => Contract, c => c.room)
    contracts: Contract[];
}
