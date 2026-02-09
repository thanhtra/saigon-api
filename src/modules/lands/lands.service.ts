import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TransactionService } from 'src/common/database/transaction.service';
import {
  DataRes,
  PageDto
} from 'src/common/dtos/respones.dto';
import { generateCode, slugifyVN } from 'src/common/helpers/utils';
import { In, Not } from 'typeorm';
import { Upload } from '../uploads/entities/upload.entity';
import { UploadsService } from '../uploads/uploads.service';
import { CreateLandDto } from './dto/create-land.dto';
import { QueryLandPublicDto } from './dto/query-land-public.dto';
import { QueryLandDto } from './dto/query-land.dto';
import { UpdateLandDto } from './dto/update-land.dto';
import { Land } from './entities/land.entity';
import { LandsRepository } from './lands.repository';

@Injectable()
export class LandsService {
  constructor(
    private readonly landsRepository: LandsRepository,
    private readonly transactionService: TransactionService,
    private readonly uploadsService: UploadsService
  ) { }

  async create(dto: CreateLandDto): Promise<DataRes<Land>> {
    try {
      const land = await this.transactionService.runInTransaction(
        async (manager) => {

          if (!dto.title) {
            throw new BadRequestException('Tiêu đề là bắt buộc');
          }

          if (dto.price == null || dto.price <= 0) {
            throw new BadRequestException('Giá thuê phải lớn hơn 0');
          }

          const landCode = generateCode();
          const slug = slugifyVN(`${dto.title}-${landCode}`);

          const land = manager.create(Land, {
            land_code: landCode,
            land_type: dto.land_type,
            title: dto.title,
            slug,
            daitheky_link: dto?.daitheky_link || "",
            collaborator_id: dto.collaborator_id,

            province: dto.province,
            district: dto.district,
            ward: dto.ward,
            street: dto.street,
            house_number: dto.house_number,
            address_detail: dto.address_detail,
            address_detail_display: dto.address_detail_display,

            area: dto.area,
            structure: dto.structure,
            width_top: dto.width_top,
            width_bottom: dto.width_bottom,
            length_left: dto.length_left,
            length_right: dto.length_right,

            price: dto.price,
            commission: dto.commission,
            description: dto.description,
            private_note: dto.private_note,
            video_url: dto.video_url,

            active: dto.active
          });

          return await manager.save(Land, land);
        },
      );

      return DataRes.success(land);
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Tạo nhà thất bại',
      );
    }
  }

  async update(
    id: string,
    dto: UpdateLandDto,
  ): Promise<DataRes<Land>> {
    try {
      const land = await this.transactionService.runInTransaction(
        async (manager) => {

          const land = await manager.findOne(Land, {
            where: { id },
            lock: { mode: 'pessimistic_write' },
          });

          if (!land) {
            throw new NotFoundException('Land không tồn tại');
          }

          if (dto.price !== undefined && dto.price <= 0) {
            throw new BadRequestException('Giá nhà không hợp lệ');
          }

          manager.merge(Land, land, {
            land_type: dto.land_type ?? land.land_type,
            title: dto.title ?? land.title,
            daitheky_link: dto?.daitheky_link ?? land.daitheky_link,
            collaborator_id: dto.collaborator_id ?? land.collaborator_id,

            province: dto.province ?? land.province,
            district: dto.district ?? land.district,
            ward: dto.ward ?? land.ward,
            street: dto.street ?? land.street,
            house_number: dto.house_number ?? land.house_number,
            address_detail: dto.address_detail ?? land.address_detail,
            address_detail_display: dto.address_detail_display ?? land.address_detail_display,

            area: dto.area ?? land.area,
            structure: dto.structure ?? land.structure,
            width_top: dto.width_top ?? land.width_top,
            width_bottom: dto.width_bottom ?? land.width_bottom,
            length_left: dto.length_left ?? land.length_left,
            length_right: dto.length_right ?? land.length_right,

            price: dto.price ?? land.price,
            commission: dto.commission ?? land.commission,
            description: dto.description ?? land.description,
            private_note: dto.private_note ?? land.private_note,
            video_url: dto.video_url ?? land.video_url,

            active: dto.active !== undefined ? dto.active : land.active,
          });

          await manager.save(land);

          /* ===== 4. DELETE UPLOADS ===== */
          if (dto.delete_upload_ids?.length) {
            const uploadsToDelete = await manager.find(Upload, {
              where: {
                id: In(dto.delete_upload_ids),
                land: { id: land.id },
              },
            });

            for (const upload of uploadsToDelete) {
              await this.uploadsService.removeFile(upload.file_path);
            }

            await manager.delete(
              Upload,
              uploadsToDelete.map(u => u.id),
            );
          }

          /* ===== ASSIGN UPLOADS (SOURCE OF TRUTH) ===== */
          if (dto.upload_ids !== undefined) {
            if (dto.upload_ids.length === 0) {
              // remove all uploads from land
              await manager.update(
                Upload,
                { land: { id: land.id } },
                { land: null },
              );
            } else {
              // detach uploads not in list
              await manager.update(
                Upload,
                {
                  land: { id: land.id },
                  id: Not(In(dto.upload_ids)),
                },
                { land: null },
              );

              // attach uploads in list (idempotent)
              await manager.update(
                Upload,
                {
                  id: In(dto.upload_ids),
                },
                { land },
              );
            }
          }

          /* ===== UPDATE COVER ===== */
          if (dto?.cover_upload_id) {
            // reset all covers of this land
            await manager.update(
              Upload,
              { land: { id: land.id } },
              { is_cover: false },
            );

            // set new cover
            await manager.update(
              Upload,
              {
                id: dto.cover_upload_id,
                land: { id: land.id },
              },
              { is_cover: true },
            );
          }

          /* ===== 6. LOAD RELATIONS FOR RESPONSE ===== */
          land.uploads = await manager.find(Upload, {
            where: { land: { id: land.id } },
          });

          return land;
        },
      );

      return DataRes.success(land);
    } catch (error) {
      const response = error?.response;

      return DataRes.failed(
        response?.message || error?.message || 'Cập nhật nhà thất bại',
        response?.code || '',
      );
    }
  }

  async getLands(
    query: QueryLandDto,
  ): Promise<DataRes<PageDto<Land>>> {
    try {
      const data = await this.landsRepository.getLands(query);
      return DataRes.success(data);
    } catch (error) {
      console.error('[LandsService][getLands]', error);

      return DataRes.failed('Lấy danh sách bds thất bại');
    }
  }

  async getOneAdmin(
    id: string,
  ): Promise<DataRes<Land>> {
    try {
      const land = await this.landsRepository.getOneAdmin(id);
      if (!land) {
        return DataRes.failed('Bds không tồn tại');
      }
      return DataRes.success(land);
    } catch (error) {
      return DataRes.failed(
        'Lấy chi tiết bds thất bại',
      );
    }
  }

  async remove(id: string): Promise<DataRes<boolean>> {
    /**
     * Danh sách file & folder cần xoá sau transaction
     */
    const uploadFilePaths: string[] = [];
    const landFolderPaths = new Set<string>();

    try {
      await this.transactionService.runInTransaction(async (manager) => {
        /* ===== 1. Lấy land ===== */
        const land = await manager.findOne(Land, {
          where: { id },
          lock: { mode: 'pessimistic_write' },
        });

        if (!land) {
          throw new NotFoundException('Bds không tồn tại');
        }

        /* ===== 2. Thu thập uploads ===== */
        const uploads = await manager.find(Upload, {
          where: { land_id: id },
          select: ['id', 'file_path'],
        });

        uploads.forEach(u => uploadFilePaths.push(u.file_path));

        /* ===== 3. Thu thập folder land ===== */
        landFolderPaths.add(`/lands/${id}`);

        /* ===== 4. Xoá uploads (DB) ===== */
        if (uploads.length) {
          await manager.delete(
            Upload,
            uploads.map(u => u.id),
          );
        }

        /* ===== 5. Xoá land ===== */
        await manager.delete(Land, { id });
      });

      /* ===== 6. Xoá file vật lý ===== */
      for (const filePath of uploadFilePaths) {
        try {
          await this.uploadsService.removeFile(filePath);
        } catch (err) {
          console.error(`Không xoá được file: ${filePath}`, err);
        }
      }

      /* ===== 7. Xoá folder land ===== */
      for (const folderPath of landFolderPaths) {
        try {
          await this.uploadsService.removeFolder(folderPath);
        } catch (err) {
          console.error(`Không xoá được folder: ${folderPath}`, err);
        }
      }

      return DataRes.success(true);
    } catch (error) {
      console.error(error);
      return DataRes.failed(
        error?.message || 'Xoá bds thất bại',
      );
    }
  }

  async getPublicLands(
    query: QueryLandPublicDto,
  ): Promise<DataRes<PageDto<any>>> {
    try {
      const page = await this.landsRepository.findPublicLands(query);
      return DataRes.success(page);
    } catch (error) {
      return DataRes.failed(
        'Lấy danh sách bds thất bại',
      );
    }
  }

  async getPublicLandBySlug(slug: string): Promise<DataRes<Land>> {
    try {
      const land = await this.landsRepository.findPublicLandBySlug(slug);

      if (!land) {
        return DataRes.failed('Land not found');
      }

      return DataRes.success(land);
    } catch (error) {
      return DataRes.failed(
        'Lấy land detail thất bại',
      );
    }
  }

}
