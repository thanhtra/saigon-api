import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/entities/baseEntity.entity';
import { UserRole } from 'src/common/helpers/enum';
import { Rental } from 'src/modules/rentals/entities/rental.entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';


@Entity('users')
@Index(['phone'], { unique: true })
@Index(['email'], { unique: true, where: `"email" IS NOT NULL` })
export class User extends BaseEntity {

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.Tenant,
    })
    role: UserRole;

    @Column()
    name: string;

    @Column()
    phone: string;

    @Column({ nullable: true })
    email?: string;

    @Column()
    @Exclude()
    password: string;

    @Column({ nullable: true })
    @Exclude()
    refresh_token?: string;

    @Column({ default: 1 })
    password_version: number;

    @Column({ default: true })
    active: boolean;

    @Column({ nullable: true })
    zalo?: string;

    @Column({ nullable: true })
    link_facebook?: string;

    @Column({ type: 'text', nullable: true })
    address?: string;

    @Column({ type: 'text', nullable: true })
    note?: string;

    @OneToMany(() => Rental, rental => rental.createdBy)
    createdRentals: Rental[];

}
