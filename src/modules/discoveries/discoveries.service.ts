import { Injectable } from '@nestjs/common';
import { Enums } from 'src/common/dtos/enum.dto';
import { DataRes, PageDto } from 'src/common/dtos/respones.dto';
import { ErrorMes } from 'src/common/helpers/errorMessage';
import { ImagesRepository } from '../images/images.repository';
import { DiscoveriesRepository } from './discoveries.repository';
import { CreateDiscoveryDto } from './dto/create-discovery.dto';
import { QueryDiscoveryDto } from './dto/query.dto';
import { UpdateDiscoveryDto } from './dto/update-discovery.dto';
import { Discovery } from './entities/discovery.entity';
import { CategoryType } from 'src/config/categoryType';

@Injectable()
export class DiscoveriesService {
  constructor(
    private discoveriesRepository: DiscoveriesRepository,
    private imagesRepository: ImagesRepository
  ) { }


  getEnums(): DataRes<Enums[]> {
    var res = new DataRes<Enums[]>;

    try {
      let arr: Array<Enums> = [];
      Object.entries(CreateDiscoveryDto.getEnums()).forEach(item => {
        arr.push({
          label: item[1],
          value: item[0]
        })
      });

      if (!arr.length) {
        res.setFailed(ErrorMes.ENUMS_GET_ALL);
      }
      res.setSuccess(arr);
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async create(createDiscoveryDto: CreateDiscoveryDto): Promise<DataRes<any>> {
    var res = new DataRes<any>();

    try {
      const discoveryCreated = await this.discoveriesRepository.createDiscovery(createDiscoveryDto);

      if (discoveryCreated) {
        res.setSuccess(discoveryCreated);
      } else {
        res.setFailed(ErrorMes.DISCOVERY_CREATE);
      }
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async getDiscoveries(queryDiscoveryDto: QueryDiscoveryDto): Promise<DataRes<PageDto<Discovery>>> {
    var res = new DataRes<PageDto<Discovery>>;

    try {
      const discoveries = await this.discoveriesRepository.getDiscoveries(queryDiscoveryDto);

      if (!discoveries) {
        res.setFailed(ErrorMes.DISCOVERY_GET_ALL);
        return res;
      }

      res.setSuccess(discoveries);
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async getDiscoveryDetailById(id: string): Promise<DataRes<any>> {
    var res = new DataRes<any>();

    try {
      const discoveryPromise = this.discoveriesRepository.findOneDiscoveryById(id);
      const imagePromise = this.imagesRepository.getImagesByProductId(id);
      const [discovery, image] = await Promise.all([discoveryPromise, imagePromise]);

      if (!discovery || !image) {
        res.setFailed(ErrorMes.LAND_GET_DETAIL);
      }

      res.setSuccess({ ...discovery, images: image });
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async getDiscoveryDetailBySlug(slug: string): Promise<DataRes<any>> {
    var res = new DataRes<any>();

    try {
      const discovery = await this.discoveriesRepository.findOneDiscoveryBySlug(slug);
      const image = await this.imagesRepository.getImagesByProductId(discovery?.id);

      if (!discovery || !image) {
        res.setFailed(ErrorMes.DISCOVERY_GET_DETAIL);
      }

      res.setSuccess({ ...discovery, images: image });
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async update(id: string, updateDiscoveryDto: UpdateDiscoveryDto): Promise<DataRes<Partial<Discovery>>> {
    var res = new DataRes<Partial<Discovery>>();

    try {
      const discoveryUpdated = await this.discoveriesRepository.updateDiscovery(id, updateDiscoveryDto);

      if (!discoveryUpdated) {
        res.setFailed(ErrorMes.DISCOVERY_UPDATE);
      } else {
        res.setSuccess(discoveryUpdated);
      }
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async removeDiscovery(id: string): Promise<DataRes<any>> {
    var res = new DataRes<any>();

    try {
      const { affected: removed } = await this.imagesRepository.removeImageByProductId(id, CategoryType.DISCOVERY);
      if (removed !== 1) {
        res.setFailed(ErrorMes.DISCOVERY_REMOVE);
      } else {
        const { affected } = await this.discoveriesRepository.removeDiscovery(id);

        if (affected === 1) {
          res.setSuccess(null)
        } else {
          res.setFailed(ErrorMes.DISCOVERY_REMOVE);
        }
      }
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }


}
