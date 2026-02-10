import { BaseEntity } from 'src/common/entities/baseEntity.entity';
import { FurnitureStatus, HouseDirection, LandAmenity, LandType, LegalStatus } from 'src/common/helpers/enum';
import { Collaborator } from 'src/modules/collaborators/entities/collaborator.entity';
import { Upload } from 'src/modules/uploads/entities/upload.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';


@Index(['province', 'district', 'ward'])
@Index(['land_type'])
@Index(['price'])
@Index(['area'])
@Index(['legal_status'])
@Index(['bedrooms'])
@Index(['toilets'])
@Index(['createdAt'])
@Entity('lands')
export class Land extends BaseEntity {
    @Column({ unique: true })
    land_code: string;

    @Column({ type: 'enum', enum: LandType })
    land_type: LandType;

    @Column()
    title: string;

    @Column({ unique: true })
    slug: string;

    @Column({ nullable: true, unique: true })
    daitheky_link?: string;

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

    // PARAMETER

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    area?: number;                  // Diện tích

    @Column({ nullable: true })
    structure?: string;      // Kết cấu: C4, 2 tầng,...

    @Column({ type: 'int', nullable: true })
    bedrooms?: number;              // Số phòng ngủ

    @Column({ type: 'int', nullable: true })
    toilets?: number;               // Số WC

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    width_top?: number;         // Ngang trên (m)

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    width_bottom?: number;     // Ngang dưới (m)

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    length_left?: number;      // Dài trái (m)

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    length_right?: number;     // Dài phải (m)

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    price: number;

    @ManyToOne(() => Collaborator, c => c.rentals, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({ name: 'collaborator_id' })
    collaborator: Collaborator;

    @Column()
    collaborator_id: string;

    @Column({ nullable: true })
    commission: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'text', nullable: true })
    private_note?: string;

    @OneToMany(() => Upload, u => u.land)
    uploads: Upload[];

    @Column({ nullable: true })
    video_url?: string;

    @Column({ default: true })
    active: boolean;

    @Column({
        type: 'text',
        array: true,
        nullable: true,
        default: () => 'ARRAY[]::text[]',
    })
    amenities?: LandAmenity[];

    @Column({
        type: 'enum',
        enum: HouseDirection,
        nullable: true,
    })
    house_direction?: HouseDirection;

    @Column({
        type: 'enum',
        enum: LegalStatus,
        nullable: true,
    })
    legal_status?: LegalStatus;   // Pháp lý

    @Column({
        type: 'enum',
        enum: FurnitureStatus,
        default: FurnitureStatus.Updating,
    })
    furniture_status: FurnitureStatus;   // Nội thất

}