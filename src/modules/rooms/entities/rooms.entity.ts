import { BaseEntity } from 'src/common/entities/baseEntity.entity';
import { RentalAmenity, RoomStatus } from 'src/common/helpers/enum';
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

    @Column({ default: 0 })
    cover_index?: number;

    @Column({
        type: 'text',
        array: true,
        nullable: true,
        default: () => 'ARRAY[]::text[]',
    })
    amenities?: RentalAmenity[];

    @OneToMany(() => Upload, u => u.room)
    uploads: Upload[];
}