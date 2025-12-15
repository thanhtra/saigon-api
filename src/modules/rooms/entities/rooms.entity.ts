import { BaseEntity } from 'src/common/entities/baseEntity.entity';
import { RoomStatus } from 'src/common/helpers/enum';
import { Contract } from 'src/modules/contracts/entities/contract.entity';
import { Rental } from 'src/modules/rentals/entities/rental.entity';
import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';


@Entity('rooms')
export class Room extends BaseEntity {
    @Column()
    rental_id: string;

    @ManyToOne(() => Rental, r => r.rooms, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'rental_id' })
    rental: Rental;

    @Column()
    room_code: string;

    @Column()
    price: number;

    @Column({ nullable: true })
    area?: number;

    @Column({ default: 1 })
    max_people: number;

    @Column({
        type: 'enum',
        enum: RoomStatus,
        default: RoomStatus.Available,
    })
    status: RoomStatus;

    @OneToMany(() => Contract, c => c.room)
    contracts: Contract[];
}
