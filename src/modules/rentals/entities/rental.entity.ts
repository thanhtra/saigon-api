import { BaseEntity } from 'src/common/entities/baseEntity.entity';
import {
    RentalAmenity,
    RentalStatus,
    RentalType,
} from 'src/common/helpers/enum';
import { Collaborator } from 'src/modules/collaborators/entities/collaborator.entity';
import { Room } from 'src/modules/rooms/entities/rooms.entity';
import { Upload } from 'src/modules/uploads/entities/upload.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('rentals')
export class Rental extends BaseEntity {

    @ManyToOne(() => Collaborator, c => c.rentals)
    @JoinColumn({ name: 'collaborator_id' })
    collaborator: Collaborator;

    @Column()
    collaborator_id: string;

    @Column()
    created_by: string;

    @Column()
    title: string;

    @Column({ type: 'enum', enum: RentalType })
    rental_type: RentalType;

    @Column({ length: 100 })
    province: string; // Tỉnh / Thành phố

    @Column({ length: 100 })
    district: string; // Quận / Huyện

    @Column({ length: 100 })
    ward: string; // Phường / Xã

    @Column({ length: 150, nullable: true })
    street?: string; // Đường / Phố

    @Column({ length: 50, nullable: true })
    house_number?: string; // Số nhà

    @Column({ type: 'text' })
    address_detail: string; // địa chỉ hiển thị đầy đủ

    @Column({ type: 'text' })
    address_detail_display: string;

    @Column()
    commission_value: string;

    @Column({ default: true })
    active: boolean;

    @Column({ nullable: true })
    description?: string;

    @Column({
        type: 'simple-array',
        nullable: true,
    })
    amenities?: RentalAmenity[];

    @Column({
        type: 'enum',
        enum: RentalStatus,
        default: RentalStatus.New,
    })
    status: RentalStatus;

    @Column({
        nullable: true,
        default: 0
    })
    cover_index?: number;

    @OneToMany(() => Room, room => room.rental)
    rooms: Room[];

    @OneToMany(() => Upload, u => u.rental)
    uploads: Upload[];
}
