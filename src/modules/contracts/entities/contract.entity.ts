import { BaseEntity } from 'src/common/entities/baseEntity.entity';
import { Commission } from 'src/modules/commissions/entities/commission.entity';
import { Rental } from 'src/modules/rentals/entities/rental.entity';
import { Room } from 'src/modules/rooms/entities/rooms.entity';
import { Tenant } from 'src/modules/tenants/entities/tenant.entity';
import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';


@Entity('contracts')
export class Contract extends BaseEntity {
    @ManyToOne(() => Rental)
    rental: Rental;

    @ManyToOne(() => Room, { nullable: true })
    room?: Room;

    @ManyToOne(() => Tenant)
    tenant: Tenant;

    @Column({ type: 'date' })
    start_date: Date;

    @Column({ type: 'date', nullable: true })
    end_date?: Date;

    @Column()
    rent_price: number;

    @Column()
    deposit: number;

    @OneToOne(() => Commission, c => c.contract)
    commission: Commission;
}
