import { BaseEntity } from 'src/common/entities/baseEntity.entity';
import { Contract } from 'src/modules/contracts/entities/contract.entity';
import { Entity, Column, OneToMany, Index } from 'typeorm';

@Entity('tenants')
export class Tenant extends BaseEntity {
    @Column()
    name: string;

    @Index()
    @Column()
    phone: string;

    @Index({ unique: true })
    @Column({ nullable: true })
    cccd?: string;

    @Column({ type: 'text', nullable: true })
    note?: string;

    @OneToMany(() => Contract, c => c.tenant)
    contracts: Contract[];
}
