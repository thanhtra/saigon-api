import { BaseEntity } from 'src/common/entities/baseEntity.entity';
import { RentalStatus, RentalType } from 'src/common/helpers/enum';
import { Amenity } from 'src/modules/amenities/entities/amenitie.entity';
import { Collaborator } from 'src/modules/collaborators/entities/collaborator.entity';
import { Room } from 'src/modules/rooms/entities/rooms.entity';
import { Upload } from 'src/modules/uploads/entities/upload.entity';
import { Entity, Column, ManyToOne, OneToMany, ManyToMany, JoinColumn, JoinTable } from 'typeorm';

@Entity('rentals')
export class Rental extends BaseEntity {
    @Column()
    collaborator_id: string;

    @ManyToOne(() => Collaborator, c => c.rentals, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'collaborator_id' })
    collaborator: Collaborator;

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

    @Column({ default: true })
    active: boolean;

    @Column({ unique: true })
    slug: string;

    @Column({ nullable: true })
    user_id?: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ type: 'enum', enum: RentalStatus, default: RentalStatus.NEW })
    status: RentalStatus;

    @OneToMany(() => Room, room => room.rental)
    rooms: Room[];

    @ManyToMany(() => Amenity)
    @JoinTable({ name: 'rental_amenities' })
    amenities: Amenity[];

    @OneToMany(() => Upload, u => u.rental)
    uploads: Upload[];
}
