import { Injectable } from '@nestjs/common';
import {
  DataRes,
  PageDto,
  PageOptionsDto,
} from 'src/common/dtos/respones.dto';

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
    private readonly commissionsRepository: CommissionsRepository,
  ) { }

  /* ================= CREATE ================= */

  // async create(
  //   dto: CreateContractDto,
  // ): Promise<DataRes<Contract>> {
  //   try {
  //     // 1️⃣ Tạo contract
  //     const contract = await this.contractsRepository.create(dto);

  //     // 2️⃣ Tạo commission (nếu có)
  //     if (dto.sale_id || dto.collaborator_id) {
  //       await this.commissionsRepository.createCommission({
  //         contract,
  //         sale: dto.sale_id
  //           ? ({ id: dto.sale_id } as any)
  //           : null,
  //         collaborator: dto.collaborator_id
  //           ? ({ id: dto.collaborator_id } as any)
  //           : null,
  //         amount: dto.commission_amount || 0,
  //         status: CommissionStatus.Pending,
  //       });
  //     }

  //     return DataRes.success(contract);
  //   } catch (error) {
  //     return DataRes.failed(
  //       'Tạo hợp đồng thất bại',
  //     );
  //   }
  // }

  /* ================= UPDATE ================= */

  async update(
    id: string,
    dto: UpdateContractDto,
  ): Promise<DataRes<Contract>> {
    try {
      const updated = await this.contractsRepository.update(
        id,
        dto,
      );

      if (!updated) {
        return DataRes.failed('Hợp đồng không tồn tại');
      }

      return DataRes.success(updated);
    } catch (error) {
      return DataRes.failed(
        'Cập nhật hợp đồng thất bại',
      );
    }
  }

  /* ================= DELETE ================= */

  async remove(
    id: string,
  ): Promise<DataRes<null>> {
    try {
      const success = await this.contractsRepository.remove(
        id,
      );

      if (!success) {
        return DataRes.failed('Hợp đồng không tồn tại');
      }

      return DataRes.success(null);
    } catch (error) {
      return DataRes.failed(
        'Xóa hợp đồng thất bại',
      );
    }
  }

  /* ================= DETAIL ================= */

  async getOne(
    id: string,
  ): Promise<DataRes<Contract>> {
    try {
      const contract = await this.contractsRepository.findOne(
        id,
      );

      if (!contract) {
        return DataRes.failed('Hợp đồng không tồn tại');
      }

      return DataRes.success(contract);
    } catch (error) {
      return DataRes.failed(
        'Lấy chi tiết hợp đồng thất bại',
      );
    }
  }

  /* ================= LIST ================= */

  async getAll(
    pageOptions: PageOptionsDto,
  ): Promise<DataRes<PageDto<Contract>>> {
    try {
      const data = await this.contractsRepository.findAll(
        pageOptions,
      );

      return DataRes.success(data);
    } catch (error) {
      return DataRes.failed(
        'Lấy danh sách hợp đồng thất bại',
      );
    }
  }

  /* ================= FILTER ================= */

  async getByTenant(
    tenantId: string,
  ): Promise<DataRes<Contract[]>> {
    try {
      const contracts =
        await this.contractsRepository.findByTenant(
          tenantId,
        );

      return DataRes.success(contracts);
    } catch (error) {
      return DataRes.failed(

        'Lấy hợp đồng theo tenant thất bại',
      );
    }
  }

  async getByRental(
    rentalId: string,
  ): Promise<DataRes<Contract[]>> {
    try {
      const contracts =
        await this.contractsRepository.findByRental(
          rentalId,
        );

      return DataRes.success(contracts);
    } catch (error) {
      return DataRes.failed(

        'Lấy hợp đồng theo rental thất bại',
      );
    }
  }

  async getByRoom(
    roomId: string,
  ): Promise<DataRes<Contract[]>> {
    try {
      const contracts =
        await this.contractsRepository.findByRoom(
          roomId,
        );

      return DataRes.success(contracts);
    } catch (error) {
      return DataRes.failed(

        'Lấy hợp đồng theo phòng thất bại',
      );
    }
  }
}
