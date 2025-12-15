// uploads.controller.ts
import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { DataRes, PageDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { PERMISSIONS } from 'src/config/permissions';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { Upload } from './entities/upload.entity';
import { UploadsService } from './uploads.service';
import { UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileType } from './dto/create-upload.dto';
import { Express } from 'express';


@Controller('uploads')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(PermissionsGuard)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) { }

  @Post('file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folder = file.mimetype.startsWith('image') ? './uploads/images' : './uploads/videos';
          cb(null, folder);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = uuidv4() + extname(file.originalname);
          cb(null, uniqueSuffix);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image') && !file.mimetype.startsWith('video')) {
          return cb(new Error('Chỉ chấp nhận file hình ảnh hoặc video'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateUploadDto,
  ): Promise<DataRes<any>> {
    // Tạo record trong DB
    const dto: CreateUploadDto = {
      file_url: file.path, // Hoặc đổi thành URL truy cập
      file_type: file.mimetype.startsWith('image') ? FileType.Image : FileType.Video,
      rental_id: body.rental_id,
      room_id: body.room_id,
      contract_id: body.contract_id,
    };
    return this.uploadsService.create(dto);
  }

  @Post()
  @Permissions(PERMISSIONS.uploads.create)
  create(@Body() dto: CreateUploadDto): Promise<DataRes<Upload>> {
    return this.uploadsService.create(dto);
  }

  @Put(':id')
  @Permissions(PERMISSIONS.uploads.update)
  update(@Param('id') id: string, @Body() dto: UpdateUploadDto): Promise<DataRes<Upload>> {
    return this.uploadsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions(PERMISSIONS.uploads.delete)
  remove(@Param('id') id: string): Promise<DataRes<{ id: string }>> {
    return this.uploadsService.remove(id);
  }

  @Get()
  @Permissions(PERMISSIONS.uploads.read)
  getAll(@Query() pageOptions: PageOptionsDto): Promise<DataRes<PageDto<Upload>>> {
    return this.uploadsService.getAll(pageOptions);
  }

  @Get('parent')
  @Permissions(PERMISSIONS.uploads.read)
  getByParent(
    @Query('rentalId') rentalId?: string,
    @Query('roomId') roomId?: string,
    @Query('contractId') contractId?: string,
  ): Promise<DataRes<Upload[]>> {
    return this.uploadsService.getByParent(rentalId, roomId, contractId);
  }

  @Get(':id')
  @Permissions(PERMISSIONS.uploads.read)
  getOne(@Param('id') id: string): Promise<DataRes<Upload>> {
    return this.uploadsService.getOne(id);
  }
}