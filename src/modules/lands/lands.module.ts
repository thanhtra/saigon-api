import { Module } from '@nestjs/common';
import { ImagesRepository } from '../images/images.repository';
import { LandsController } from './lands.controller';
import { LandsRepository } from './lands.repository';
import { LandsService } from './lands.service';
import { CollaboratorsRepository } from '../collaborator/collaborators.repository';
import { UsersRepository } from '../users/users.repository';

@Module({
  controllers: [LandsController],
  exports: [LandsService],
  providers: [LandsService, LandsRepository, ImagesRepository, CollaboratorsRepository, UsersRepository]
})
export class LandsModule { }
