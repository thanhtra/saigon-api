import { Module, forwardRef } from '@nestjs/common';
import { CollaboratorsService } from './collaborators.service';
import { CollaboratorsController } from './collaborators.controller';
import { AuthModule } from '../auth/auth.module';
import { CollaboratorsRepository } from './collaborators.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collaborator } from './entities/collaborator.entity';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([Collaborator])
  ],
  controllers: [CollaboratorsController],
  exports: [CollaboratorsService],
  providers: [CollaboratorsService, CollaboratorsRepository],
})
export class CollaboratorsModule { }
