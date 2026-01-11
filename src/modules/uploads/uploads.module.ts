import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from './entities/upload.entity';
import { UploadsController } from './uploads.controller';
import { UploadsRepository } from './uploads.repository';
import { UploadsService } from './uploads.service';

@Module({
  imports: [TypeOrmModule.forFeature([Upload])],
  providers: [UploadsService, UploadsRepository],
  controllers: [UploadsController],
  exports: [UploadsService, UploadsRepository],
})
export class UploadsModule { }
