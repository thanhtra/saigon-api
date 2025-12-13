import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { ImagesRepository } from '../images/images.repository';
import { CollaboratorsRepository } from '../collaborator/collaborators.repository';

@Module({
  controllers: [ProductsController],
  exports: [ProductsService],
  providers: [ProductsService, ProductsRepository, ImagesRepository, CollaboratorsRepository]
})
export class ProductsModule { }
