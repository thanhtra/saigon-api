import { BaseEntity } from 'src/common/entities/baseEntity.entity';
import { BookingStatus } from 'src/common/helpers/enum';
import { Room } from 'src/modules/rooms/entities/rooms.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('bookings')
export class Booking extends BaseEntity {

    @Column()
    room_id: string;

    @ManyToOne(() => Room)
    @JoinColumn({ name: 'room_id' })
    room: Room;

    @Column()
    customer_name: string;

    @Column()
    customer_phone: string;

    @Column({ nullable: true })
    customer_note?: string;

    @Column({ nullable: true })
    admin_note?: string;

    @Column({ type: 'timestamp' })
    viewing_at: Date;

    @Column({
        type: 'enum',
        enum: BookingStatus,
        default: BookingStatus.Pending,
    })
    status: BookingStatus;
}
