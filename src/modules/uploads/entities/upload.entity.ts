import { BaseEntity } from 'src/common/entities/baseEntity.entity';
import { Contract } from 'src/modules/contracts/entities/contract.entity';
import { Room } from 'src/modules/rooms/entities/rooms.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('uploads')
export class Upload extends BaseEntity {
    @Column()
    file_url: string;

    @Column()
    file_type: string; // image / video

    @ManyToOne(() => Room, { nullable: true })
    room?: Room;

    @ManyToOne(() => Contract, { nullable: true })
    contract?: Contract;
}
