// uploads.entity.ts
import { BaseEntity } from 'src/common/entities/baseEntity.entity';
import { Rental } from 'src/modules/rentals/entities/rental.entity';
import { Room } from 'src/modules/rooms/entities/rooms.entity';
import { Contract } from 'src/modules/contracts/entities/contract.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity('uploads')
export class Upload extends BaseEntity {
    @Column()
    file_url: string;

    @Column()
    file_type: string; // image / video

    @ManyToOne(() => Rental, { nullable: true })
    rental?: Rental;

    @ManyToOne(() => Room, { nullable: true })
    room?: Room;

    @ManyToOne(() => Contract, { nullable: true })
    contract?: Contract;
}
