import { Module } from '@nestjs/common';
import { DiscoveriesService } from './discoveries.service';
import { DiscoveriesController } from './discoveries.controller';
import { DiscoveriesRepository } from './discoveries.repository';
import { ImagesRepository } from '../images/images.repository';

@Module({
  controllers: [DiscoveriesController],
  providers: [DiscoveriesService, DiscoveriesRepository, ImagesRepository]
})
export class DiscoveriesModule { }
