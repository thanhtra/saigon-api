import { BaseEntity } from 'src/common/entities/baseEntity.entity';
import {
    RentalStatus,
    RentalType
} from 'src/common/helpers/enum';
import { Collaborator } from 'src/modules/collaborators/entities/collaborator.entity';
import { Room } from 'src/modules/rooms/entities/rooms.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';


@Entity('rentals')
@Index(['collaborator_id'])
@Index(['active'])
@Index(['province', 'district'])
export class Rental extends BaseEntity {

    @ManyToOne(() => Collaborator, c => c.rentals, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({ name: 'collaborator_id' })
    collaborator: Collaborator;

    @Column()
    collaborator_id: string;

    @ManyToOne(() => User, user => user.createdRentals, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({ name: 'created_by' })
    createdBy: User;

    @Column()
    created_by: string;

    @OneToMany(() => Room, room => room.rental)
    rooms: Room[];


    @Column({ type: 'enum', enum: RentalType })
    rental_type: RentalType;

    @Column({ nullable: true })
    commission: string;

    @Column({ type: 'text', nullable: true })
    note?: string;

    @Column({
        type: 'enum',
        enum: RentalStatus,
        default: RentalStatus.New
    })
    status: RentalStatus;

    @Column({ default: true })
    active: boolean;


    // ADDRESS

    @Column({ length: 100 })
    province: string;

    @Column({ length: 100 })
    district: string;

    @Column({ length: 100 })
    ward: string;

    @Column({ length: 150, nullable: true })
    street?: string;

    @Column({ length: 50, nullable: true })
    house_number?: string;

    @Column({ type: 'text' })
    address_detail: string;

    @Column({ type: 'text' })
    address_detail_display: string;


    // FEE

    @Column({ type: 'int', default: 0 })
    fee_electric?: number;

    @Column({ type: 'int', default: 0 })
    fee_water?: number;

    @Column({ nullable: true })
    water_unit: string;

    @Column({ type: 'int', default: 0 })
    fee_wifi?: number;

    @Column({ type: 'int', default: 0 })
    fee_service?: number;

    @Column({ type: 'int', default: 0 })
    fee_parking?: number;

    @Column({ type: 'text', nullable: true })
    fee_other?: string;

}