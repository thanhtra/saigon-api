import { Module } from '@nestjs/common';
import { DiscoveriesRepository } from '../discoveries/discoveries.repository';
import { LandsRepository } from '../lands/lands.repository';
import { ProductsRepository } from '../products/products.repository';
import { ImagesController } from './images.controller';
import { ImagesRepository } from './images.repository';
import { ImagesService } from './images.service';

@Module({
  controllers: [ImagesController],
  exports: [ImagesService],
  providers: [ImagesService, ImagesRepository, LandsRepository, DiscoveriesRepository, ProductsRepository]
})
export class ImagesModule { }