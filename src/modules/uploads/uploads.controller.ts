// uploads.controller.ts
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

import { Permissions } from 'src/common/decorators/permissions.decorator';
import { DataRes, PageDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { ensureDir } from 'src/common/helpers/utils';
import { PERMISSIONS } from 'src/config/permissions';

import { CreateUploadDto, FileType } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { UploadMultipleDto } from './dto/upload-multiple.dto';
import { Upload } from './entities/upload.entity';
import { UploadsService } from './uploads.service';

const uploadRoot = path.join(process.cwd(), 'uploads', 'images');

@Controller('uploads')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(PermissionsGuard)
export class UploadsController {
  constructor(
    private readonly uploadsService: UploadsService,
  ) { }

  /* ================= MULTIPLE UPLOAD ================= */

  @Post('multiple')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: (_, __, cb) => {
          ensureDir(uploadRoot);
          cb(null, uploadRoot);
        },
        filename: (_, file, cb) => {
          cb(null, `${uuidv4()}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_, file, cb) => {
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
        transform: true,
      }),
    )
    body: UploadMultipleDto,
  ): Promise<DataRes<Upload[]>> {
    const uploads: Upload[] = [];

    for (const file of files) {
      const dto: CreateUploadDto = {
        file_url: file.path,
        file_type: FileType.Image,
        rental_id: body.rental_id,
        room_id: body.room_id,
        contract_id: body.contract_id,
      };

      const result = await this.uploadsService.create(dto);
      if (result.success && result.data) {
        uploads.push(result.data);
      }
    }

    return DataRes.success(uploads);
  }

  /* ================= CREATE ================= */

  @Post()
  @Permissions(PERMISSIONS.uploads.create)
  async create(
    @Body() dto: CreateUploadDto,
  ): Promise<DataRes<Upload>> {
    return await this.uploadsService.create(dto);
  }

  /* ================= UPDATE ================= */

  @Put(':id')
  @Permissions(PERMISSIONS.uploads.update)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUploadDto,
  ): Promise<DataRes<Upload>> {
    return await this.uploadsService.update(id, dto);
  }

  /* ================= DELETE ================= */

  @Delete(':id')
  @Permissions(PERMISSIONS.uploads.delete)
  async remove(
    @Param('id') id: string,
  ): Promise<DataRes<{ id: string }>> {
    return await this.uploadsService.remove(id);
  }

  /* ================= LIST ================= */

  @Get()
  @Permissions(PERMISSIONS.uploads.read)
  async getAll(
    @Query() pageOptions: PageOptionsDto,
  ): Promise<DataRes<PageDto<Upload>>> {
    return await this.uploadsService.getAll(pageOptions);
  }

  /* ================= GET BY PARENT ================= */

  @Get('parent')
  @Permissions(PERMISSIONS.uploads.read)
  async getByParent(
    @Query('rentalId') rentalId?: string,
    @Query('roomId') roomId?: string,
    @Query('contractId') contractId?: string,
  ): Promise<DataRes<Upload[]>> {
    return await this.uploadsService.getByParent(
      rentalId,
      roomId,
      contractId,
    );
  }

  /* ================= DETAIL ================= */

  @Get(':id')
  @Permissions(PERMISSIONS.uploads.read)
  async getOne(
    @Param('id') id: string,
  ): Promise<DataRes<Upload>> {
    return await this.uploadsService.getOne(id);
  }
}
