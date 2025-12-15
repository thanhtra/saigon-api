import { BaseEntity } from 'src/common/entities/baseEntity.entity';
import { Entity, Column } from 'typeorm';

@Entity('amenities')
export class Amenity extends BaseEntity {
    @Column()
    name: string;

    @Column({ default: true })
    active: boolean;
}
