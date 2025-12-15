import { Injectable } from '@nestjs/common';
import { DataRes, PageDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { FindOptionsOrder } from 'typeorm';

import { ContractsRepository } from './contracts.repository';
import { Contract } from './entities/contract.entity';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { CommissionsRepository } from '../commissions/commissions.repository';
import { CommissionStatus } from 'src/common/helpers/enum';

@Injectable()
export class ContractsService {
  constructor(
    private readonly contractsRepository: ContractsRepository,
    private readonly commissionsRepository: CommissionsRepository) { }

  // ---------------- PRIVATE ----------------
  private async handle<T>(callback: () => Promise<T>, errorMessage: string): Promise<DataRes<T>> {
    try {
      const data = await callback();
      if (!data) return DataRes.failed(errorMessage);
      return DataRes.success(data);
    } catch (error) {
      return DataRes.failed(error?.message || errorMessage);
    }
  }

  // ---------------- CREATE ----------------
  // create(dto: CreateContractDto): Promise<DataRes<Contract>> {
  //   return this.handle(() => this.contractsRepository.create(dto), 'Tạo hợp đồng thất bại');
  // }

  // Tạo hợp đồng + commission
  async create(dto: CreateContractDto): Promise<DataRes<Contract>> {
    return this.handle(async () => {
      // 1️⃣ Tạo contract
      const contract = await this.contractsRepository.create(dto);

      if (dto.sale_id || dto.collaborator_id) {
        await this.commissionsRepository.createCommission({
          contract: contract, // hoặc { id: contract.id } nếu contract chỉ là id
          sale: dto.sale_id ? { id: dto.sale_id } as any : null,
          collaborator: dto.collaborator_id ? { id: dto.collaborator_id } as any : null,
          amount: dto.commission_amount || 0,
          status: CommissionStatus.Pending,
        });
      }

      return contract;
    }, 'Tạo hợp đồng thất bại');
  }


  // ---------------- UPDATE ----------------
  update(id: string, dto: UpdateContractDto): Promise<DataRes<Contract>> {
    return this.handle(() => this.contractsRepository.update(id, dto), 'Cập nhật hợp đồng thất bại');
  }

  // ---------------- DELETE ----------------
  remove(id: string): Promise<DataRes<{ id: string }>> {
    return this.handle(async () => {
      const success = await this.contractsRepository.remove(id);
      if (!success) return undefined;
      return { id };
    }, 'Xóa hợp đồng thất bại');
  }

  // ---------------- GET ONE ----------------
  getOne(id: string): Promise<DataRes<Contract>> {
    return this.handle(() => this.contractsRepository.findOne(id), 'Lấy chi tiết hợp đồng thất bại');
  }

  // ---------------- LIST + PAGINATION ----------------
  getAll(pageOptions: PageOptionsDto): Promise<DataRes<PageDto<Contract>>> {
    return this.handle(() => this.contractsRepository.findAll(pageOptions), 'Lấy danh sách hợp đồng thất bại');
  }

  // ---------------- FILTER ----------------
  // service
  findByFilter(
    filters: Partial<Contract>,
    orderBy?: { column: string; order: 'ASC' | 'DESC' }
  ): Promise<Contract[]> {
    return this.contractsRepository.findByFilter(filters, orderBy);
  }


  // ---------------- FILTER BY TENANT ----------------
  getByTenant(tenantId: string): Promise<DataRes<Contract[]>> {
    return this.handle(() => this.contractsRepository.findByTenant(tenantId), 'Lấy hợp đồng theo tenant thất bại');
  }

  // ---------------- FILTER BY RENTAL ----------------
  getByRental(rentalId: string): Promise<DataRes<Contract[]>> {
    return this.handle(() => this.contractsRepository.findByRental(rentalId), 'Lấy hợp đồng theo rental thất bại');
  }

  // ---------------- FILTER BY ROOM ----------------
  getByRoom(roomId: string): Promise<DataRes<Contract[]>> {
    return this.handle(() => this.contractsRepository.findByRoom(roomId), 'Lấy hợp đồng theo phòng thất bại');
  }
}
