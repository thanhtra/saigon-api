import { Injectable } from '@nestjs/common';
import { RentalsRepository } from './rentals.repository';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { PageOptionsDto, DataRes, PageDto } from 'src/common/dtos/respones.dto';
import { Rental } from './entities/rental.entity';
import { RentalCustomerDto } from './dto/rental-customer.dto';


@Injectable()
export class RentalsService {
  constructor(private rentalsRepository: RentalsRepository) { }

  private async handle<T>(callback: () => Promise<T>, errorMessage: string): Promise<DataRes<T>> {
    try {
      const data = await callback();
      if (!data) return DataRes.failed(errorMessage);
      return DataRes.success(data);
    } catch (error) {
      return DataRes.failed(error?.message || errorMessage);
    }
  }

  // Admin
  create(dto: CreateRentalDto): Promise<DataRes<Rental>> {
    return this.handle(() => this.rentalsRepository.create(dto), 'Tạo rental thất bại');
  }

  update(id: string, dto: UpdateRentalDto): Promise<DataRes<Rental>> {
    return this.handle(() => this.rentalsRepository.update(id, dto), 'Cập nhật rental thất bại');
  }

  remove(id: string): Promise<DataRes<null>> {
    return this.handle(async () => {
      const result = await this.rentalsRepository.remove(id);
      return result ? null : null;
    }, 'Xóa rental thất bại');
  }

  getAll(pageOptions: PageOptionsDto): Promise<DataRes<PageDto<Rental>>> {
    return this.handle(() => this.rentalsRepository.findAll(pageOptions), 'Lấy danh sách rental thất bại');
  }

  getOneAdmin(id: string): Promise<DataRes<Rental>> {
    return this.handle(() => this.rentalsRepository.findOne(id), 'Lấy chi tiết rental thất bại');
  }

  // Customer
  getOneCustomer(id: string): Promise<DataRes<RentalCustomerDto>> {
    return this.handle(async () => {
      const rental = await this.rentalsRepository.findOne(id);
      if (!rental) return null;
      const dto: RentalCustomerDto = {
        title: rental.title,
        rental_type: rental.rental_type,
        address_detail: rental.address_detail,
        price: rental.price,
        total_rooms: rental.total_rooms,
        // amenities: rental.amenities || [],
        uploads: rental.uploads || [],
      };
      return dto;
    }, 'Lấy chi tiết rental thất bại');
  }
}
