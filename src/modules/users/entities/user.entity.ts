import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/entities/baseEntity.entity';
import { UserRole } from 'src/common/helpers/enum';
import { Rental } from 'src/modules/rentals/entities/rental.entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';


@Entity('users')
@Index(['phone'], { unique: true })
@Index(['email'], { unique: true, where: `"email" IS NOT NULL` })
@Index(['role'])
@Index(['active'])
export class User extends BaseEntity {

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.Tenant,
    })
    role: UserRole;

    @Column({ length: 150 })
    name: string;

    @Column({ length: 20 })
    phone: string;

    @Column({ length: 150, nullable: true })
    email?: string;

    @Column({ length: 255 })
    @Exclude()
    password: string;

    @Column({ length: 300, nullable: true })
    @Exclude()
    refresh_token?: string;

    @Column({ default: 1 })
    password_version: number;

    @Column({ default: true })
    active: boolean;

    @Column({ length: 50, nullable: true })
    zalo?: string;

    @Column({ length: 500, nullable: true })
    link_facebook?: string;

    @Column({ type: 'text', nullable: true })
    address?: string;

    @Column({ type: 'text', nullable: true })
    note?: string;

    @OneToMany(() => Rental, rental => rental.createdBy)
    createdRentals: Rental[];

}
