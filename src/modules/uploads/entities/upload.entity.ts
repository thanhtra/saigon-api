import { BaseEntity } from 'src/common/entities/baseEntity.entity';
import { UploadDomain, FileType } from 'src/common/helpers/enum';
import { Contract } from 'src/modules/contracts/entities/contract.entity';
import { Land } from 'src/modules/lands/entities/land.entity';
import { Room } from 'src/modules/rooms/entities/rooms.entity';
import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
} from 'typeorm';

@Entity('uploads')
@Index(['domain'])
@Index(['room_id'])
@Index(['contract_id'])
export class Upload extends BaseEntity {

    @Column()
    file_path: string;

    @Column({
        type: 'enum',
        enum: FileType,
    })
    file_type: FileType;

    @Column({
        type: 'enum',
        enum: UploadDomain,
        comment: 'Phân loại file theo nghiệp vụ',
    })
    domain: UploadDomain;


    /* ========== ROOM ========== */
    @ManyToOne(() => Room, {
        nullable: true,
        onDelete: 'CASCADE', // 🔥 xoá room → xoá file
    })
    @JoinColumn({ name: 'room_id' })
    room?: Room;

    @Column({ nullable: true })
    room_id?: string;


    /* ========== LAND ========== */
    @ManyToOne(() => Land, {
        nullable: true,
        onDelete: 'CASCADE', // 🔥 xoá land → xoá file
    })
    @JoinColumn({ name: 'land_id' })
    land?: Land;

    @Column({ nullable: true })
    land_id?: string;

    /* ========== CONTRACT ========== */
    @ManyToOne(() => Contract, {
        nullable: true,
        onDelete: 'CASCADE', // 🔥 xoá contract → xoá file
    })
    @JoinColumn({ name: 'contract_id' })
    contract?: Contract;

    @Column({ nullable: true })
    contract_id?: string;

    @Column({ default: false })
    is_cover: boolean;
}
