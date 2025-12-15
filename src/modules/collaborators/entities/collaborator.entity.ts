import { Rental } from 'src/modules/rentals/entities/rental.entity';
import {
    Column, Entity,
    OneToMany
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/baseEntity.entity';
import { FieldCooperation } from 'src/common/helpers/enum';


// chủ trọ, cộng tác bds
@Entity('collaborator')

export class Collaborator extends BaseEntity {
    @Column()
    name: string;

    @Column({ unique: true })
    phone: string;

    @Column({ nullable: true })
    zalo: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    link_facebook: string;

    @Column({ type: 'text', nullable: true })
    address?: string;

    @Column({ type: 'text', nullable: true })
    note?: string;

    @Column({
        type: 'enum',
        enum: FieldCooperation,
        nullable: true,
    })
    field_cooperation?: FieldCooperation;

    @Column({ default: true })
    active: boolean;

    @OneToMany(() => Rental, rental => rental.collaborator)
    rentals: Rental[];
}