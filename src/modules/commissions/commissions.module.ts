import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommissionsRepository } from './commissions.repository';
import { CommissionsService } from './commissions.service';
import { Commission } from './entities/commission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Commission])],
  providers: [CommissionsRepository, CommissionsService],
  exports: [CommissionsRepository, CommissionsService],
})
export class CommissionsModule { }
