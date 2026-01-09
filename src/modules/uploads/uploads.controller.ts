import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common';
import { DataRes, PageDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { PERMISSIONS } from 'src/config/permissions';

import { Auth } from 'src/common/decorators/auth.decorator';
import { UploadImagesInterceptor } from 'src/common/exceptions/upload-images.interceptor';
import { resolveUploadPath } from 'src/common/helpers/upload';
import { CreateUploadDto, FileType } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
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
    const uploads: Upload[] = [];
    const { entityId } = resolveUploadPath(body);

    for (const file of files) {
      const filePath = `/${body.domain}/${entityId}/${file.filename}`;

      const dto: CreateUploadDto = {
        domain: body.domain,
        file_path: filePath,
        file_type: FileType.Image,
        room_id: body.room_id,
        real_estate_id: body.real_estate_id,
        contract_id: body.contract_id,
      };

      const result = await this.uploadsService.create(dto);
      if (result.success && result.data) {
        uploads.push(result.data);
      }
    }

    return DataRes.success(uploads);
  }

  @Post()
  @Auth(PERMISSIONS.uploads.create)
  async create(
    @Body() dto: CreateUploadDto,
  ): Promise<DataRes<Upload>> {
    return await this.uploadsService.create(dto);
  }

  @Put(':id')
  @Auth(PERMISSIONS.uploads.update)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUploadDto,
  ): Promise<DataRes<Upload>> {
    return await this.uploadsService.update(id, dto);
  }

  @Delete(':id')
  @Auth(PERMISSIONS.uploads.delete)
  async remove(
    @Param('id') id: string,
  ): Promise<DataRes<{ id: string }>> {
    return await this.uploadsService.remove(id);
  }

  @Get()
  @Auth(PERMISSIONS.uploads.read)
  async getAll(
    @Query() pageOptions: PageOptionsDto,
  ): Promise<DataRes<PageDto<Upload>>> {
    return await this.uploadsService.getAll(pageOptions);
  }

  @Get('parent')
  @Auth(PERMISSIONS.uploads.read)
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


  @Get(':id')
  @Auth(PERMISSIONS.uploads.read)
  async getOne(
    @Param('id') id: string,
  ): Promise<DataRes<Upload>> {
    return await this.uploadsService.getOne(id);
  }
}
