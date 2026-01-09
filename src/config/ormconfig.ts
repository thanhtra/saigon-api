const SnakeNamingStrategy =
    require('typeorm-naming-strategies').SnakeNamingStrategy;

import { Booking } from 'src/modules/bookings/entities/booking.entity';
import { User } from '../modules/users/entities/user.entity';
import { DataSourceOptions } from 'typeorm';
import { Collaborator } from 'src/modules/collaborators/entities/collaborator.entity';
import { Commission } from 'src/modules/commissions/entities/commission.entity';
import { Contract } from 'src/modules/contracts/entities/contract.entity';
import { Rental } from 'src/modules/rentals/entities/rental.entity';
import { Room } from 'src/modules/rooms/entities/rooms.entity';
import { Tenant } from 'src/modules/tenants/entities/tenant.entity';
import { Upload } from 'src/modules/uploads/entities/upload.entity';


const config: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
    entities: [User, Booking, Collaborator, Commission, Contract, Rental, Room, Tenant, Upload],
    synchronize: true,
    namingStrategy: new SnakeNamingStrategy(),
}


export default config;