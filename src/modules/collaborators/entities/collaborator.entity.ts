import { CollaboratorType, FieldCooperation } from 'src/common/helpers/enum';
import { Rental } from 'src/modules/rentals/entities/rental.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
    Column, Entity,
    Index,
    JoinColumn,
    OneToMany,
    OneToOne
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/baseEntity.entity';

@Entity('collaborators')
@Index(['user_id'], { unique: true })
@Index(['active'])
@Index(['type'])
@Index(['field_cooperation'])
export class Collaborator extends BaseEntity {

    @Column({
        type: 'enum',
        enum: CollaboratorType,
        comment: 'Loại cộng tác viên',
    })
    type: CollaboratorType;

    @Column({ type: 'text', nullable: true })
    note?: string;

    @Column({
        type: 'enum',
        enum: FieldCooperation,
        comment: 'Lĩnh vực hợp tác',
    })
    field_cooperation: FieldCooperation;

    @Column({ default: true })
    active: boolean;

    @OneToOne(() => User, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    user_id: string;

    @OneToMany(() => Rental, r => r.collaborator)
    rentals: Rental[];

    @Column({ default: false })
    is_blacklisted: boolean;

    @Column({ type: 'text', nullable: true })
    blacklist_reason?: string;

    @Column({ type: 'timestamp', nullable: true })
    blacklisted_at?: Date;

}
