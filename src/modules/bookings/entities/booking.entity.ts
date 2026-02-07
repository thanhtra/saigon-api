import { BaseEntity } from 'src/common/entities/baseEntity.entity';
import { BookingStatus } from 'src/common/helpers/enum';
import { Room } from 'src/modules/rooms/entities/rooms.entity';
import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
} from 'typeorm';

@Entity('bookings')
@Index(['rental_id'])
@Index(['room_id'])
@Index(['status'])
@Index(['viewing_at'])
@Index(['room_id', 'viewing_at'])
@Index(['is_paid_commission'])
export class Booking extends BaseEntity {

    @Column()
    rental_id: string;

    @Column()
    room_id: string;

    @ManyToOne(() => Room, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({ name: 'room_id' })
    room: Room;

    @Column({ length: 150 })
    customer_name: string;

    @Column({ length: 20 })
    customer_phone: string;

    @Column({ type: 'text', nullable: true })
    customer_note?: string | null;

    @Column({ type: 'text', nullable: true })
    admin_note?: string | null;

    @Column({ type: 'varchar', length: 16 })
    viewing_at: string;
    // format: "YYYY-MM-DDTHH:mm"

    @Column({ length: 20, nullable: true })
    referrer_phone?: string | null;

    @Column({
        type: 'enum',
        enum: BookingStatus,
        default: BookingStatus.Pending,
    })
    status: BookingStatus;

    @Column({
        type: 'boolean',
        default: false,
    })
    is_paid_commission: boolean;
}
