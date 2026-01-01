import { Injectable } from '@nestjs/common';
import { UploadsRepository } from './uploads.repository';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import {
    DataRes,
    PageDto,
    PageOptionsDto,
} from 'src/common/dtos/respones.dto';
import { Upload } from './entities/upload.entity';

@Injectable()
export class UploadsService {
    constructor(
        private readonly uploadsRepository: UploadsRepository,
    ) { }

    /* ================= CREATE ================= */

    async create(
        dto: CreateUploadDto,
    ): Promise<DataRes<Upload>> {
        try {
            const upload = await this.uploadsRepository.create(dto);
            return upload
                ? DataRes.success(upload)
                : DataRes.failed('Tạo upload thất bại');
        } catch (error) {
            return DataRes.failed(
                error?.message || 'Tạo upload thất bại',
            );
        }
    }

    /* ================= UPDATE ================= */

    async update(
        id: string,
        dto: UpdateUploadDto,
    ): Promise<DataRes<Upload>> {
        try {
            const upload = await this.uploadsRepository.update(id, dto);
            return upload
                ? DataRes.success(upload)
                : DataRes.failed('Upload không tồn tại');
        } catch (error) {
            return DataRes.failed(
                error?.message || 'Cập nhật upload thất bại',
            );
        }
    }

    /* ================= DELETE ================= */

    async remove(
        id: string,
    ): Promise<DataRes<{ id: string }>> {
        try {
            const removed = await this.uploadsRepository.remove(id);
            return removed
                ? DataRes.success({ id })
                : DataRes.failed('Upload không tồn tại');
        } catch (error) {
            return DataRes.failed(
                error?.message || 'Xóa upload thất bại',
            );
        }
    }

    /* ================= DETAIL ================= */

    async getOne(
        id: string,
    ): Promise<DataRes<Upload>> {
        try {
            const upload = await this.uploadsRepository.findOne(id);
            return upload
                ? DataRes.success(upload)
                : DataRes.failed('Upload không tồn tại');
        } catch (error) {
            return DataRes.failed(
                error?.message || 'Lấy chi tiết upload thất bại',
            );
        }
    }

    /* ================= LIST ================= */

    async getAll(
        pageOptions: PageOptionsDto,
    ): Promise<DataRes<PageDto<Upload>>> {
        try {
            const uploads = await this.uploadsRepository.findAll(
                pageOptions,
            );
            return DataRes.success(uploads);
        } catch (error) {
            return DataRes.failed(
                error?.message || 'Lấy danh sách upload thất bại',
            );
        }
    }

    /* ================= BY PARENT ================= */

    async getByParent(
        rentalId?: string,
        roomId?: string,
        contractId?: string,
    ): Promise<DataRes<Upload[]>> {
        try {
            const uploads = await this.uploadsRepository.findByParent(
                rentalId,
                roomId,
                contractId,
            );
            return DataRes.success(uploads);
        } catch (error) {
            return DataRes.failed(
                error?.message || 'Lấy upload theo parent thất bại',
            );
        }
    }
}
