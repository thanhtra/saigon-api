// uploads.service.ts
import { Injectable } from '@nestjs/common';
import { UploadsRepository } from './uploads.repository';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { DataRes, PageDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { Upload } from './entities/upload.entity';

@Injectable()
export class UploadsService {
    constructor(private readonly uploadsRepository: UploadsRepository) { }

    private async handle<T>(callback: () => Promise<T>, errorMessage: string): Promise<DataRes<T>> {
        try {
            const data = await callback();
            if (!data) return DataRes.failed(errorMessage);
            return DataRes.success(data);
        } catch (error) {
            return DataRes.failed(error?.message || errorMessage);
        }
    }

    async create(dto: CreateUploadDto): Promise<DataRes<Upload>> {
        return this.handle(() => this.uploadsRepository.create(dto), 'Tạo upload thất bại');
    }

    async update(id: string, dto: UpdateUploadDto): Promise<DataRes<Upload>> {
        return this.handle(() => this.uploadsRepository.update(id, dto), 'Cập nhật upload thất bại');
    }

    async remove(id: string): Promise<DataRes<{ id: string }>> {
        return this.handle(async () => {
            const success = await this.uploadsRepository.remove(id);
            if (!success) return undefined;
            return { id };
        }, 'Xóa upload thất bại');
    }

    async getOne(id: string): Promise<DataRes<Upload>> {
        return this.handle(() => this.uploadsRepository.findOne(id), 'Lấy chi tiết upload thất bại');
    }

    async getAll(pageOptions: PageOptionsDto): Promise<DataRes<PageDto<Upload>>> {
        return this.handle(() => this.uploadsRepository.findAll(pageOptions), 'Lấy danh sách upload thất bại');
    }

    async getByParent(
        rentalId?: string,
        roomId?: string,
        contractId?: string,
    ): Promise<DataRes<Upload[]>> {
        return this.handle(() => this.uploadsRepository.findByParent(rentalId, roomId, contractId), 'Lấy upload theo parent thất bại');
    }
}
