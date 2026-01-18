// import { Module } from '@nestjs/common';
// import { RentalsController } from './rentals.controller';
// import { RentalsService } from './rentals.service';
// import { RentalsRepository } from './rentals.repository';

// @Module({
//   controllers: [RentalsController],
//   providers: [RentalsService, RentalsRepository],
//   exports: [RentalsService],
// })
// export class RentalsModule { }


import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rental } from './entities/rental.entity';
import { User } from '../users/entities/user.entity';
import { RentalsController } from './rentals.controller';
import { RentalsService } from './rentals.service';
import { RentalsRepository } from './rentals.repository';
import { UsersModule } from '../users/users.module';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rental, User]),
    forwardRef(() => UsersModule),
    UploadsModule
  ],
  controllers: [RentalsController],
  providers: [RentalsService, RentalsRepository],
  exports: [RentalsService],
})
export class RentalsModule { }
