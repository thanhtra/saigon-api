import { Injectable, Logger } from '@nestjs/common';
import { existsSync, unlink } from 'fs';
import { join, normalize } from 'path';
import { TransactionService } from 'src/common/database/transaction.service';
import {
    DataRes
} from 'src/common/dtos/respones.dto';
import { UPLOAD_DIR } from 'src/common/helpers/constants';
import { FileType, UploadDomain } from 'src/common/helpers/enum';
import { resolveUploadPath } from 'src/common/helpers/upload';
import { promisify } from 'util';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UploadMultipleDto } from './dto/upload-multiple.dto';
import { Upload } from './entities/upload.entity';
import { UploadsRepository } from './uploads.repository';
import { promises as fs } from 'fs';

const unlinkAsync = promisify(unlink);

@Injectable()
export class UploadsService {
    private readonly logger = new Logger(UploadsService.name);

    constructor(
        private readonly uploadsRepository: UploadsRepository,
        private readonly transactionService: TransactionService
    ) { }

    async createUpload(dto: CreateUploadDto): Promise<DataRes<Upload>> {
        try {
            // Validate domain & relation
            const relationCount = [dto.room_id, dto.real_estate_id, dto.contract_id].filter(Boolean).length;
            if (relationCount !== 1) {
                return DataRes.failed('Upload chỉ được gắn với đúng một domain');
            }

            if (!dto.domain || (dto.domain === UploadDomain.Rooms && !dto.room_id) ||
                (dto.domain === UploadDomain.RealEstates && !dto.real_estate_id) ||
                (dto.domain === UploadDomain.Contracts && !dto.contract_id)) {
                return DataRes.failed('Domain hoặc ID liên quan không hợp lệ');
            }

            const upload = await this.transactionService.runInTransaction(async (manager) => {
                const entity = manager.create(Upload, dto);
                return manager.save(Upload, entity);
            });

            return DataRes.success(upload);
        } catch (error) {
            console.error('Tạo upload thất bại', error);
            return DataRes.failed(error?.message || 'Tạo upload thất bại');
        }
    }

    async createMultipleUploads(dto: UploadMultipleDto, files: Express.Multer.File[]): Promise<DataRes<Upload[]>> {
        const { entityId } = resolveUploadPath(dto);

        const uploadResults = await Promise.allSettled(files.map(file => {
            const filePath = `/${dto.domain}/${entityId}/${file.filename}`;
            return this.createUpload({ ...dto, file_path: filePath, file_type: FileType.Image });
        }));

        const uploads = uploadResults
            .filter(r => r.status === 'fulfilled' && r.value.success)
            .map(r => (r as PromiseFulfilledResult<DataRes<Upload>>).value.data);


        if (!uploads.length) return DataRes.failed('Không có file nào upload thành công');
        return DataRes.success(uploads);
    }


    async removeFile(filePath: string): Promise<void> {
        try {
            if (!filePath) return;

            /**
             * filePath trong DB: /rooms/xxx/filename.jpg
             * => convert sang absolute path
             */
            const absolutePath = normalize(
                join(UPLOAD_DIR, filePath),
            );

            // bảo vệ: chỉ cho xoá trong thư mục uploads
            if (!absolutePath.startsWith(UPLOAD_DIR)) {
                this.logger.warn(
                    `Blocked removeFile outside uploads: ${absolutePath}`,
                );
                return;
            }

            if (!existsSync(absolutePath)) {
                this.logger.warn(
                    `File not found, skip remove: ${absolutePath}`,
                );
                return;
            }

            await unlinkAsync(absolutePath);

        } catch (error) {
            this.logger.error(
                `Remove file failed: ${filePath}`,
                error?.stack,
            );
        }
    }

    async removeFolder(folderPath: string): Promise<void> {
        try {
            if (!folderPath) return;

            /**
             * folderPath: /rooms/{roomId}
             * => uploads/rooms/{roomId}
             */
            const absolutePath = normalize(
                join(UPLOAD_DIR, folderPath),
            );

            // bảo vệ an toàn
            if (!absolutePath.startsWith(UPLOAD_DIR)) {
                this.logger.warn(
                    `Blocked removeFolder outside uploads: ${absolutePath}`,
                );
                return;
            }

            await fs.rm(absolutePath, {
                recursive: true,
                force: true, // không throw nếu không tồn tại
            });

            this.logger.log(`Removed folder: ${absolutePath}`);
        } catch (error) {
            this.logger.error(
                `Remove folder failed: ${folderPath}`,
                error?.stack,
            );
        }
    }


}
