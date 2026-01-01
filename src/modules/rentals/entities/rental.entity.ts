import { BaseEntity } from 'src/common/entities/baseEntity.entity';
import {
    RentalStatus,
    RentalType
} from 'src/common/helpers/enum';
import { Collaborator } from 'src/modules/collaborators/entities/collaborator.entity';
import { Room } from 'src/modules/rooms/entities/rooms.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('rentals')
export class Rental extends BaseEntity {

    @ManyToOne(() => Collaborator, c => c.rentals)
    @JoinColumn({ name: 'collaborator_id' })
    collaborator: Collaborator;

    @Column()
    collaborator_id: string;

    @ManyToOne(() => User, user => user.created_rentals, {
        nullable: false,
        eager: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({ name: 'created_by' })
    created_by_user: User;

    @Column({ nullable: false })
    created_by: string;

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

    @OneToMany(() => Room, room => room.rental)
    rooms: Room[];
}
