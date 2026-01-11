import { BaseEntity } from 'src/common/entities/baseEntity.entity';
import { BookingStatus } from 'src/common/helpers/enum';
import { Room } from 'src/modules/rooms/entities/rooms.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Entity('bookings')
@Index(['rental_id'])
@Index(['room_id'])
@Index(['status'])
@Index(['viewing_at'])
export class Booking extends BaseEntity {
    @Column({ nullable: true })
    rental_id?: string;

    @ManyToOne(() => Room, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'room_id' })
    room?: Room;

    @Column({ nullable: true })
    room_id?: string;

    @Column({ length: 150 })
    customer_name: string;

    @Column({ length: 20 })
    customer_phone: string;

    @Column({ type: 'text', nullable: true })
    customer_note?: string;

    @Column({ type: 'text', nullable: true })
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
