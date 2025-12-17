import { Rental } from 'src/modules/rentals/entities/rental.entity';
import {
    Column, Entity,
    JoinColumn,
    OneToMany,
    OneToOne
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/baseEntity.entity';
import { CollaboratorType, FieldCooperation } from 'src/common/helpers/enum';
import { User } from 'src/modules/users/entities/user.entity';


// Chủ trọ hoặc môi giới
@Entity('collaborator')

export class Collaborator extends BaseEntity {
    @OneToOne(() => User, { eager: true })
    @JoinColumn()
    user: User;

    @Column({
        type: 'enum',
        enum: CollaboratorType,
    })
    type: CollaboratorType;

    @Column({ type: 'enum', enum: FieldCooperation })
    field_cooperation: FieldCooperation;

    @Column({ default: true })
    active: boolean;

    @OneToMany(() => Rental, r => r.posted_by)
    rentals: Rental[];
}