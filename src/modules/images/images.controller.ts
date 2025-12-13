import { Body, ClassSerializerInterceptor, Controller, Delete, Inject, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DataRes } from 'src/common/dtos/respones.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { ErrorMes } from 'src/common/helpers/errorMessage';
import { multerOptionsLand, multerOptionsProduct, multerOptionsDiscovery } from 'src/config/multer.config';
import { PERMISSIONS } from 'src/config/permissions';
import { ImagesService } from './images.service';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@Controller('images')
@UseInterceptors(ClassSerializerInterceptor)
export class ImagesController {
  constructor(private imagesService: ImagesService,
    @Inject(REQUEST) private request,) { }


  @Post('/uploads-land')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.images.uploads)
  @UseInterceptors(FilesInterceptor('photos', 6, multerOptionsLand))
  uploadMultipleLand(@UploadedFiles() files): DataRes<any> {
    var result = new DataRes<any>();

    if (files && files.length) {
      const fileNames = files.map((item: any) => item.filename);
      result.setSuccess(fileNames);
    } else {
      result.setFailed(ErrorMes.UPLOAD_IMAGE);
    }

    return result;
  }

  @Post('/uploads-product')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.images.uploads)
  @UseInterceptors(FilesInterceptor('photos', 6, multerOptionsProduct))
  uploadMultipleProduct(@UploadedFiles() files): DataRes<any> {
    var result = new DataRes<any>();

    if (files && files.length) {
      const fileNames = files.map((item: any) => item.filename);
      result.setSuccess(fileNames);
    } else {
      result.setFailed(ErrorMes.UPLOAD_IMAGE);
    }

    return result;
  }

  @Post('/uploads-discovery')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.images.uploads)
  @UseInterceptors(FilesInterceptor('photos', 6, multerOptionsDiscovery))
  uploadMultipleDiscovery(@UploadedFiles() files): DataRes<any> {
    var result = new DataRes<any>();

    if (files && files.length) {
      const fileNames = files.map((item: any) => item.filename);
      result.setSuccess(fileNames);
    } else {
      result.setFailed(ErrorMes.UPLOAD_IMAGE);
    }

    return result;
  }


  @Post()
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.images.uploads)
  async create(@Body() payload: any): Promise<DataRes<any>> {
    return await this.imagesService.createImages(payload);
  }

  @Delete('/delete')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.images.delete)
  async remove(@Body() payload: any): Promise<DataRes<any>> {
    return await this.imagesService.remove(payload);
  }

}
