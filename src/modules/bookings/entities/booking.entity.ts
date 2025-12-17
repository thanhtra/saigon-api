import { BaseEntity } from 'src/common/entities/baseEntity.entity';
import { BookingStatus } from 'src/common/helpers/enum';
import { Collaborator } from 'src/modules/collaborators/entities/collaborator.entity';
import { Room } from 'src/modules/rooms/entities/rooms.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('bookings')
export class Booking extends BaseEntity {

    // 🏠 Phòng được xem
    @Column()
    room_id: string;

    @ManyToOne(() => Room)
    @JoinColumn({ name: 'room_id' })
    room: Room;

    // 👤 Sale / người dẫn khách
    @ManyToOne(() => Collaborator)
    guide: Collaborator;

    // 👤 Khách xem phòng
    @Column()
    customer_name: string;

    @Column()
    customer_phone: string;

    @Column({ nullable: true })
    customer_note?: string;

    // 📅 Thời gian xem
    @Column({ type: 'timestamp' })
    viewing_at: Date;

    // 📝 Lưu ý khi xem phòng
    @Column({ type: 'text', nullable: true })
    note?: string;

    // 📌 Trạng thái lịch xem
    @Column({
        type: 'enum',
        enum: BookingStatus,
        default: BookingStatus.PENDING,
    })
    status: BookingStatus;
}
