import { Injectable } from '@nestjs/common';
import { AmenitiesRepository } from './amenities.repository';
import { DataRes } from 'src/common/dtos/respones.dto';
import { CreateAmenityDto } from './dto/create-amenitie.dto';
import { Amenity } from './entities/amenitie.entity';
import { UpdateAmenityDto } from './dto/update-amenitie.dto';


@Injectable()
export class AmenitiesService {
  constructor(private readonly amenitiesRepository: AmenitiesRepository) { }

  async create(dto: CreateAmenityDto): Promise<DataRes<Amenity>> {
    const amenity = await this.amenitiesRepository.create(dto);
    return DataRes.success(amenity);
  }

  async update(id: string, dto: UpdateAmenityDto): Promise<DataRes<Amenity>> {
    const updated = await this.amenitiesRepository.update(id, dto);
    if (!updated) return DataRes.failed('Cập nhật tiện ích thất bại');
    return DataRes.success(updated);
  }

  async remove(id: string): Promise<DataRes<{ id: string }>> {
    const success = await this.amenitiesRepository.remove(id);
    if (!success) return DataRes.failed('Xóa tiện ích thất bại');
    return DataRes.success({ id });
  }

  async getOne(id: string): Promise<DataRes<Amenity>> {
    const amenity = await this.amenitiesRepository.findOne(id);
    if (!amenity) return DataRes.failed('Không tìm thấy tiện ích');
    return DataRes.success(amenity);
  }

  async getAll(): Promise<DataRes<Amenity[]>> {
    const amenities = await this.amenitiesRepository.findAll({ name: 'ASC' });
    return DataRes.success(amenities);
  }
}
