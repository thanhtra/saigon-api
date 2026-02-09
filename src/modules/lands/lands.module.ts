import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadsModule } from '../uploads/uploads.module';
import { Land } from './entities/land.entity';
import { LandsController } from './lands.controller';
import { LandsRepository } from './lands.repository';
import { LandsService } from './lands.service';


@Module({
  imports: [TypeOrmModule.forFeature([Land]), UploadsModule],
  controllers: [LandsController],
  providers: [LandsRepository, LandsService],
  exports: [LandsRepository, LandsService],
})
export class LandsModule { }
