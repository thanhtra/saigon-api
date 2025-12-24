// uploads.controller.ts
import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { extname } from 'path';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { DataRes, PageDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { ensureDir } from 'src/common/helpers/utils';
import { PERMISSIONS } from 'src/config/permissions';
import { v4 as uuidv4 } from 'uuid';
import { CreateUploadDto, FileType } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { UploadMultipleDto } from './dto/upload-multiple.dto';
import { Upload } from './entities/upload.entity';
import { UploadsService } from './uploads.service';

const uploadRoot = path.join(process.cwd(), 'uploads', 'images');

@Controller('uploads')
@UseInterceptors(ClassSerializerInterceptor)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) { }



  @Post('multiple')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          ensureDir(uploadRoot); // ✅ đảm bảo tồn tại
          cb(null, uploadRoot);  // ✅ path tuyệt đối
        },
        filename: (req, file, cb) => {
          cb(null, uuidv4() + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image')) {
          return cb(new Error('Chỉ chấp nhận hình ảnh'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
    @Body(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
      }),
    )
    body: UploadMultipleDto,
  ): Promise<DataRes<Upload[]>> {
    const uploads = await Promise.all(
      files.map(async file => {
        const dto: CreateUploadDto = {
          file_url: file.path,
          file_type: FileType.Image,
          rental_id: body.rental_id,
          room_id: body.room_id,
          contract_id: body.contract_id,
        };

        const res = await this.uploadsService.create(dto);
        return res.data!;
      }),
    );

    return DataRes.success(uploads);
  }


  @Post()
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.uploads.create)
  create(@Body() dto: CreateUploadDto): Promise<DataRes<Upload>> {
    return this.uploadsService.create(dto);
  }

  @Put(':id')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.uploads.update)
  update(@Param('id') id: string, @Body() dto: UpdateUploadDto): Promise<DataRes<Upload>> {
    return this.uploadsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.uploads.delete)
  remove(@Param('id') id: string): Promise<DataRes<{ id: string }>> {
    return this.uploadsService.remove(id);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.uploads.read)
  getAll(@Query() pageOptions: PageOptionsDto): Promise<DataRes<PageDto<Upload>>> {
    return this.uploadsService.getAll(pageOptions);
  }

  @Get('parent')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.uploads.read)
  getByParent(
    @Query('rentalId') rentalId?: string,
    @Query('roomId') roomId?: string,
    @Query('contractId') contractId?: string,
  ): Promise<DataRes<Upload[]>> {
    return this.uploadsService.getByParent(rentalId, roomId, contractId);
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.uploads.read)
  getOne(@Param('id') id: string): Promise<DataRes<Upload>> {
    return this.uploadsService.getOne(id);
  }
}