import { BaseEntity } from 'src/common/entities/baseEntity.entity';
import { CommissionType, RentalAmenity, RentalStatus, RentalType } from 'src/common/helpers/enum';
import { Collaborator } from 'src/modules/collaborators/entities/collaborator.entity';
import { Room } from 'src/modules/rooms/entities/rooms.entity';
import { Upload } from 'src/modules/uploads/entities/upload.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity('rentals')
export class Rental extends BaseEntity {
    @ManyToOne(() => Collaborator, c => c.rentals)
    posted_by: Collaborator;

    @Column()
    title: string;

    @Column({ type: 'enum', enum: RentalType })
    rental_type: RentalType;

    @Column({ type: 'text' })
    address_detail: string;

    @Column({ type: 'int', nullable: true })
    price?: number;

    @Column({ type: 'int', default: 0 })
    total_rooms: number;

    /* 🔥 HOA HỒNG THOẢ THUẬN */
    @Column({
        type: 'enum',
        enum: CommissionType,
        nullable: true,
    })
    commission_type?: CommissionType;

    @Column({ type: 'int', nullable: true })
    commission_value?: number;
    // FIXED: số tiền
    // PERCENT: %

    @Column({ default: true })
    active: boolean;

    @Column({ unique: true })
    slug: string;

    @Column({ nullable: true })
    user_id?: string;

    @Column({ nullable: true })
    description?: string;

    @Column({
        type: 'simple-array', // hoặc json / jsonb
        nullable: true,
    })
    amenities: RentalAmenity[];

    @Column({ type: 'enum', enum: RentalStatus, default: RentalStatus.NEW })
    status: RentalStatus;


    @OneToMany(() => Room, room => room.rental)
    rooms: Room[];

    @OneToMany(() => Upload, u => u.rental)
    uploads: Upload[];
}
