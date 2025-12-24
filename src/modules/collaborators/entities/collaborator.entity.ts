import { Rental } from 'src/modules/rentals/entities/rental.entity';
import {
    Column, Entity,
    Index,
    JoinColumn,
    OneToMany,
    OneToOne
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/baseEntity.entity';
import { CollaboratorType, FieldCooperation } from 'src/common/helpers/enum';
import { User } from 'src/modules/users/entities/user.entity';

@Entity('collaborators')
@Index(['user_id'], { unique: true })
export class Collaborator extends BaseEntity {

    @OneToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    user_id: string;

    // 👔 Loại cộng tác
    @Column({
        type: 'enum',
        enum: CollaboratorType,
    })
    type: CollaboratorType;

    @Column({ nullable: true })
    note?: string;

    // 🏷️ Lĩnh vực
    @Column({
        type: 'enum',
        enum: FieldCooperation,
    })
    field_cooperation: FieldCooperation;

    // 📌 Trạng thái
    @Column({ default: true })
    active: boolean;

    // 🏠 Bài đăng
    @OneToMany(() => Rental, r => r.collaborator)
    rentals: Rental[];
}
