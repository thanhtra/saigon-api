import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsRepository } from './rooms.repository';
import { RoomsService } from './rooms.service';
import { Room } from './entities/rooms.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Room])],
  providers: [RoomsRepository, RoomsService],
  exports: [RoomsRepository, RoomsService],
})
export class RoomsModule { }
