import { BaseEntity } from 'src/common/entities/baseEntity.entity';
import { Commission } from 'src/modules/commissions/entities/commission.entity';
import { Rental } from 'src/modules/rentals/entities/rental.entity';
import { Room } from 'src/modules/rooms/entities/rooms.entity';
import { Tenant } from 'src/modules/tenants/entities/tenant.entity';
import { Entity, Column, ManyToOne, OneToOne, JoinColumn, Index } from 'typeorm';


@Entity('contracts')
@Index(['rental_id'])
@Index(['room_id'])
@Index(['tenant_id'])
export class Contract extends BaseEntity {
    @ManyToOne(() => Rental, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({ name: 'rental_id' })
    rental: Rental;

    @Column()
    rental_id: string;

    @ManyToOne(() => Room, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'room_id' })
    room?: Room;

    @Column({ nullable: true })
    room_id?: string;

    @ManyToOne(() => Tenant, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;

    @Column()
    tenant_id: string;

    @Column({ type: 'date' })
    start_date: Date;

    @Column({ type: 'date', nullable: true })
    end_date?: Date;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    rent_price: number;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    deposit: number;

    @OneToOne(() => Commission, c => c.contract)
    commission: Commission;
}
