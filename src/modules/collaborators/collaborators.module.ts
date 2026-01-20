import { Module, forwardRef } from '@nestjs/common';
import { CollaboratorsService } from './collaborators.service';
import { CollaboratorsController } from './collaborators.controller';
import { AuthModule } from '../auth/auth.module';
import { CollaboratorsRepository } from './collaborators.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collaborator } from './entities/collaborator.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([Collaborator]),
    UsersModule
  ],
  controllers: [CollaboratorsController],
  exports: [CollaboratorsService, CollaboratorsRepository],
  providers: [CollaboratorsService, CollaboratorsRepository],
})
export class CollaboratorsModule { }
