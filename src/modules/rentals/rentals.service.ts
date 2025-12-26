import { Injectable } from '@nestjs/common';
import { RentalsRepository } from './rentals.repository';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import {
  PageOptionsDto,
  DataRes,
  PageDto,
} from 'src/common/dtos/respones.dto';
import { Rental } from './entities/rental.entity';
import { RentalCustomerDto } from './dto/rental-customer.dto';

@Injectable()
export class RentalsService {
  constructor(
    private readonly rentalsRepository: RentalsRepository,
  ) { }

  /* ================= ADMIN ================= */

  async create(
    dto: CreateRentalDto,
    user: any
  ): Promise<DataRes<Rental>> {
    try {
      const rental = await this.rentalsRepository.create(dto, user);
      return DataRes.success(rental);
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Tạo rental thất bại',
      );
    }
  }

  async update(
    id: string,
    dto: UpdateRentalDto,
  ): Promise<DataRes<Rental>> {
    try {
      const rental = await this.rentalsRepository.update(id, dto);
      if (!rental) {
        return DataRes.failed('Rental không tồn tại');
      }
      return DataRes.success(rental);
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Cập nhật rental thất bại',
      );
    }
  }

  async remove(id: string): Promise<DataRes<boolean>> {
    try {
      const success = await this.rentalsRepository.remove(id);
      if (!success) {
        return DataRes.failed('Rental không tồn tại');
      }
      return DataRes.success(true);
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Xóa rental thất bại',
      );
    }
  }

  async getAll(
    pageOptions: PageOptionsDto,
  ): Promise<DataRes<PageDto<Rental>>> {
    try {
      const data = await this.rentalsRepository.findAll(
        pageOptions,
      );
      return DataRes.success(data);
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Lấy danh sách rental thất bại',
      );
    }
  }

  async getByCollaborator(
    collaboratorId: string,
    active?: boolean,
  ): Promise<DataRes<Rental[]>> {
    try {
      const rentals = await this.rentalsRepository.findByCollaborator(
        collaboratorId,
        active,
      );
      return DataRes.success(rentals);
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Lấy danh sách nhà theo chủ nhà thất bại',
      );
    }
  }


  async getOneAdmin(
    id: string,
  ): Promise<DataRes<Rental>> {
    try {
      const rental = await this.rentalsRepository.findOne(
        id,
      );
      if (!rental) {
        return DataRes.failed('Rental không tồn tại');
      }
      return DataRes.success(rental);
    } catch (error) {
      return DataRes.failed(
        error?.message || 'Lấy chi tiết rental thất bại',
      );
    }
  }

  /* ================= CUSTOMER ================= */

  // async getOneCustomer(
  //   id: string,
  // ): Promise<DataRes<RentalCustomerDto>> {
  //   try {
  //     const rental = await this.rentalsRepository.findOne(
  //       id,
  //     );
  //     if (!rental || !rental.active) {
  //       return DataRes.failed('Tin không tồn tại');
  //     }

  //     const dto: RentalCustomerDto = {
  //       title: rental.title,
  //       rental_type: rental.rental_type,
  //       address_detail: rental.address_detail_display || rental.address_detail,
  //       price: rental.price,
  //       amenities: rental.amenities || [],
  //       uploads: rental.uploads || [],
  //     };

  //     return DataRes.success(dto);
  //   } catch (error) {
  //     return DataRes.failed(
  //       error?.message || 'Lấy chi tiết rental thất bại',
  //     );
  //   }
  // }
}
