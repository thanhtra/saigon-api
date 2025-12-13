import { Injectable } from '@nestjs/common';
import { PageDto, PageMetaDto } from 'src/common/dtos/respones.dto';
import { Connection, EntityRepository, Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { QueryAddressDto } from './dto/query.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';


@Injectable()
@EntityRepository(Address)
export class AddressesRepository {
  private repo: Repository<Address>;

  constructor(private connection: Connection) {
    this.repo = this.connection.getRepository(Address);
  }

  createAddress = async (createAddressDto: CreateAddressDto) => {
    return this.repo.save(createAddressDto);
  };

  getAddresses = async (pageOptionsDto: QueryAddressDto): Promise<PageDto<Address>> => {
    const queryBuilder = this.repo.createQueryBuilder("address");

    queryBuilder.orderBy("address.createdAt", pageOptionsDto.order);

    if (pageOptionsDto.userId) {
      queryBuilder.andWhere("address.user_id = :userId", { userId: pageOptionsDto.userId });
    }

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  };

  find = async () => {
    return this.repo.find();
  };

  findOneAddress = async (id: string) => {
    return this.repo.findOneOrFail({ where: { id } });
  };

  updateAddress = async (
    id: string,
    updateAddressDto: UpdateAddressDto,
  ) => {
    return this.repo.save({ ...updateAddressDto, id: String(id) });
  };

  removeAddress = async (id: string) => {
    await this.repo.findOneOrFail({ where: { id } });
    return this.repo.delete(id);
  };

}
