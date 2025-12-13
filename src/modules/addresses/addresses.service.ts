import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DataRes, PageDto } from 'src/common/dtos/respones.dto';
import { ErrorMes } from 'src/common/helpers/errorMessage';
import { UsersRepository } from '../users/users.repository';
import { AddressesRepository } from './addresses.repository';
import { CreateAddressDto } from './dto/create-address.dto';
import { QueryAddressDto } from './dto/query.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressesService {
  constructor(private addressesRepository: AddressesRepository,
    private usersRepository: UsersRepository,
    @Inject(REQUEST) private request,) { }

  async create(createAddressDto: CreateAddressDto): Promise<DataRes<Address>> {
    var res = new DataRes<Address>();

    try {
      const addressCreated = await this.addressesRepository.createAddress(createAddressDto);

      if (!addressCreated) {
        res.setFailed(ErrorMes.ADDRESS_CREATE);
      } else {
        const currentUser = this.request?.user || {};

        if (currentUser && !currentUser?.address_default) {
          await this.usersRepository.updateUser(currentUser.id, { address_default: addressCreated.id });
        }

        res.setSuccess(addressCreated);
      }
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async getAddresses(query: QueryAddressDto): Promise<DataRes<PageDto<Address>>> {
    var res = new DataRes<PageDto<Address>>;

    try {
      const addresses = await this.addressesRepository.getAddresses(query);

      if (!addresses) {
        res.setFailed(ErrorMes.ADDRESS_GET_ALL);
        return res;
      }

      res.setSuccess(addresses);
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async getAddress(id: string): Promise<DataRes<Address>> {
    var res = new DataRes<Address>();

    try {
      const address = await this.addressesRepository.findOneAddress(id);

      if (!address) {
        res.setFailed(ErrorMes.ADDRESS_GET_DETAIL);
      }

      res.setSuccess(address);
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async update(id: string, updateAddressDto: UpdateAddressDto): Promise<DataRes<Partial<Address>>> {
    var res = new DataRes<Partial<Address>>();

    try {
      const addressUpdated = await this.addressesRepository.updateAddress(id, updateAddressDto);

      if (!addressUpdated) {
        res.setFailed(ErrorMes.ADDRESS_UPDATE);
      } else {
        res.setSuccess(addressUpdated);
      }
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async remove(id: string): Promise<DataRes<any>> {
    var res = new DataRes<any>();

    try {
      const { affected } = await this.addressesRepository.removeAddress(id);

      if (affected === 1) {
        res.setSuccess(null);
      } else {
        res.setFailed(ErrorMes.ADDRESS_REMOVE);
      }
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

}
