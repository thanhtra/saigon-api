import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common';
import { DataRes } from 'src/common/dtos/respones.dto';

import { UploadImagesInterceptor } from 'src/common/exceptions/upload-images.interceptor';
import { UploadMultipleDto } from './dto/upload-multiple.dto';
import { Upload } from './entities/upload.entity';
import { UploadsService } from './uploads.service';



@Controller('uploads')
export class UploadsController {
  constructor(
    private readonly uploadsService: UploadsService,
  ) { }


  @Post('multiple')
  @UseInterceptors(UploadImagesInterceptor)
  async uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: UploadMultipleDto,
  ): Promise<DataRes<Upload[]>> {
    return this.uploadsService.createMultipleUploads(body, files);
  }


}
