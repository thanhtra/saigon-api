import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/rooms.entity';
import { RoomsController } from './rooms.controller';
import { RoomsRepository } from './rooms.repository';
import { RoomsService } from './rooms.service';
import { UploadsModule } from '../uploads/uploads.module';


@Module({
  imports: [TypeOrmModule.forFeature([Room]), UploadsModule],
  controllers: [RoomsController],
  providers: [RoomsRepository, RoomsService],
  exports: [RoomsRepository, RoomsService],
})
export class RoomsModule { }
