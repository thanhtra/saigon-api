import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractsService } from './contracts.service';
import { ContractsRepository } from './contracts.repository';
import { Contract } from './entities/contract.entity';
import { CommissionsModule } from '../commissions/commissions.module';

@Module({
  imports: [TypeOrmModule.forFeature([Contract]), CommissionsModule],
  providers: [ContractsRepository, ContractsService],
  exports: [ContractsService],
})
export class ContractsModule { }
