import { BaseEntity } from 'src/common/entities/baseEntity.entity';
import { RentalAmenity, RoomStatus } from 'src/common/helpers/enum';
import { Collaborator } from 'src/modules/collaborators/entities/collaborator.entity';
import { Contract } from 'src/modules/contracts/entities/contract.entity';
import { Rental } from 'src/modules/rentals/entities/rental.entity';
import { Upload } from 'src/modules/uploads/entities/upload.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';


@Entity('rooms')
@Index(['room_code'], { unique: true })
@Index(['slug'], { unique: true })
@Index(['rental_id'])
@Index(['status'])
@Index(['price'])
@Index(['active'])
@Index('idx_rooms_amenities', { synchronize: false })
@Index(['ctv_collaborator_id'])
export class Room extends BaseEntity {

    @Column()
    title: string;

    @Column({ unique: true })
    room_code: string;

    @Column({ unique: true })
    slug: string;

    @Column({ nullable: true })
    floor?: number;

    @Column({ nullable: true })
    room_number?: string;

    @Column({ type: 'int' })
    price: number;

    @Column({ type: 'int', nullable: true })
    deposit?: number;

    @Column({ nullable: true })
    area?: number;

    @Column({ nullable: true })
    max_people?: number;

    @Column({
        type: 'enum',
        enum: RoomStatus,
        default: RoomStatus.PendingApproval,
    })
    status: RoomStatus;

    @Column({ type: 'text' })
    description: string;

    @Column({ default: true })
    active: boolean;

    @ManyToOne(() => Rental, rental => rental.rooms, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'rental_id' })
    rental: Rental;

    @Column()
    rental_id: string;

    @OneToMany(() => Contract, c => c.room)
    contracts: Contract[];

    @Column({
        type: 'text',
        array: true,
        nullable: true,
        default: () => 'ARRAY[]::text[]',
    })
    amenities?: RentalAmenity[];

    @OneToMany(() => Upload, u => u.room)
    uploads: Upload[];

    @Column({ nullable: true })
    video_url?: string;



    @ManyToOne(() => Collaborator, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'ctv_collaborator_id' })
    ctv_collaborator?: Collaborator;

    @Column({ nullable: true })
    ctv_collaborator_id?: string;
}