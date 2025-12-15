// uploads.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadsRepository } from './uploads.repository';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { Upload } from './entities/upload.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Upload])],
  providers: [UploadsService, UploadsRepository],
  controllers: [UploadsController],
  exports: [UploadsService, UploadsRepository],
})
export class UploadsModule { }
