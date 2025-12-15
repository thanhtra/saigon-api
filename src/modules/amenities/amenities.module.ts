import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmenitiesService } from './amenities.service';
import { AmenitiesRepository } from './amenities.repository';
import { AmenitiesController } from './amenities.controller';
import { Amenity } from './entities/amenitie.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Amenity])],
  providers: [AmenitiesService, AmenitiesRepository],
  controllers: [AmenitiesController],
  exports: [AmenitiesService],
})
export class AmenitiesModule { }
