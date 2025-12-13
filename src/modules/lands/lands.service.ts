import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Enums } from 'src/common/dtos/enum.dto';
import { DataRes, PageDto } from 'src/common/dtos/respones.dto';
import { ErrorMes } from 'src/common/helpers/errorMessage';
import { ImagesRepository } from '../images/images.repository';
import { CollaboratorsRepository } from '../collaborator/collaborators.repository';
import { CreateLandDto } from './dto/create-land.dto';
import { QueryLandDto } from './dto/query.dto';
import { UpdateLandDto } from './dto/update-land.dto';
import { Land } from './entities/land.entity';
import { LandsRepository } from './lands.repository';
import { CategoryType } from 'src/config/categoryType';
import { CreateLandCustomerDto } from './dto/customer-create-land.dto';
import { CreateCollaboratorDto } from '../collaborator/dto/create-collaborator.dto';
import { MyPostsDto } from './dto/my-posts.dto';
import { LandStatus } from 'src/config/landStatus';
import { UpdateLandCustomerDto } from './dto/customer-update-land.dto';
import { LandPosition } from 'src/config/positionType';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class LandsService {
  constructor(
    private landsRepository: LandsRepository,
    private imagesRepository: ImagesRepository,
    private collaboratorsRepository: CollaboratorsRepository,
    private usersRepository: UsersRepository,
    @Inject(REQUEST) private request,
  ) { }

  getEnums(): DataRes<Enums[]> {
    var res = new DataRes<Enums[]>;

    try {
      let arr: Array<Enums> = [];
      Object.entries(CreateLandDto.getEnums()).forEach(item => {
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

  async create(createLandDto: CreateLandDto): Promise<DataRes<any>> {
    var res = new DataRes<any>();

    try {
      const landCreated = await this.landsRepository.createLand(createLandDto);

      if (landCreated) {
        res.setSuccess(landCreated);
      } else {
        res.setFailed(ErrorMes.LAND_CREATE);
      }
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async getLands(queryLandDto: QueryLandDto): Promise<DataRes<PageDto<Land>>> {
    var res = new DataRes<PageDto<Land>>;

    try {
      const lands = await this.landsRepository.getLands(queryLandDto);

      if (!lands) {
        res.setFailed(ErrorMes.LAND_GET_ALL);
        return res;
      }

      res.setSuccess(lands);
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async getLandsAdmin(queryLandDto: QueryLandDto): Promise<DataRes<PageDto<Land>>> {
    var res = new DataRes<PageDto<Land>>;

    try {
      const lands = await this.landsRepository.getLandsAdmin(queryLandDto);

      if (!lands) {
        res.setFailed(ErrorMes.LAND_GET_ALL);
        return res;
      }

      res.setSuccess(lands);
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  findOne(id: string) {
    return this.landsRepository.findOneLand(id);
  }

  async getLandDetail(id: string): Promise<DataRes<any>> {
    var res = new DataRes<any>();

    try {
      const landPromise = this.landsRepository.findOneLand(id);
      const imagePromise = this.imagesRepository.getImagesByProductId(id);
      const [land, image] = await Promise.all([landPromise, imagePromise]);

      if (!land || !image) {
        res.setFailed(ErrorMes.LAND_GET_DETAIL);
      }
      let user = null;
      if (land?.user_id) {
        user = await this.usersRepository.findOneUser(land.user_id);
      }

      res.setSuccess({ ...land, images: image, user: user });
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async getLandDetailBySlug(slug: string): Promise<DataRes<any>> {
    var res = new DataRes<any>();

    try {
      const land = await this.landsRepository.findOneLandBySlug(slug);
      const image = await this.imagesRepository.getImagesByProductId(land.id);

      if (!land) {
        res.setFailed(ErrorMes.LAND_GET_DETAIL);
      } else {
        let { acreage_level, active, category_id, commission, price_level, status, user_id, ...rest } = land;
        res.setSuccess({ ...rest, images: image || [] });
      }

    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async update(id: string, updateLandDto: UpdateLandDto): Promise<DataRes<Partial<Land>>> {
    var res = new DataRes<Partial<Land>>();

    try {
      const landUpdated = await this.landsRepository.updateLand(id, updateLandDto);

      if (!landUpdated) {
        res.setFailed(ErrorMes.LAND_UPDATE);
      } else {
        res.setSuccess(landUpdated);
      }
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async removeLand(id: string): Promise<DataRes<any>> {
    var res = new DataRes<any>();

    try {
      const { affected: removed } = await this.imagesRepository.removeImageByProductId(id, CategoryType.LAND);

      if (removed !== 1) {
        res.setFailed(ErrorMes.LAND_REMOVE);
      } else {
        const { affected } = await this.landsRepository.removeLand(id);

        if (affected === 1) {
          res.setSuccess(null)
        } else {
          res.setFailed(ErrorMes.LAND_REMOVE);
        }
      }
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }


  async createLandCustomer(payload: CreateLandCustomerDto, user: any): Promise<DataRes<any>> {
    var res = new DataRes<any>();

    if (!user && !user?.id) {
      res.setFailed(ErrorMes.LAND_CREATE);
      return res;
    }

    try {
      // Kiểm tra thông tin liên hệ xem có chưa, nếu chưa có thì tạo
      const collaborator = await this.collaboratorsRepository.findOneCollaboratorByPhone(payload.contact_phone);
      let collaboratorId = null;

      if (!collaborator) {
        const newColla = new CreateCollaboratorDto();
        newColla.name = payload.contact_name;
        newColla.phone = payload.contact_phone;
        newColla.zalo = payload?.contact_zalo;
        newColla.address = payload?.contact_address;
        newColla.position = payload?.is_contact_owner ? LandPosition.Owner : LandPosition.Agency;
        newColla.field_cooperation = CategoryType.LAND;

        const collaCreated = await this.collaboratorsRepository.createCollaborator(newColla);
        if (!collaCreated) {
          res.setFailed(ErrorMes.LAND_CREATE);
          return res;
        }

        collaboratorId = collaCreated.id;
      } else {
        collaboratorId = collaborator?.id;
      }

      if (!collaboratorId) {
        res.setFailed(ErrorMes.LAND_CREATE);
        return res;
      }

      //Tạo mới thông tin bất động sản
      const newLand = new CreateLandDto();
      newLand.category_id = payload.category_id;
      newLand.district = payload.district;
      newLand.ward = payload.ward;
      newLand.address_detail = payload?.address_detail || '';
      newLand.title = payload.title;
      newLand.description = payload.description;
      newLand.acreage = payload.acreage;
      newLand.price = payload.price;
      newLand.is_have_video = payload?.is_have_video || false;
      newLand.commission = payload?.commission;
      newLand.collaborator_id = collaboratorId;
      newLand.user_id = user.id;
      newLand.status = LandStatus.NEW;

      const landCreated = await this.landsRepository.createLand(newLand);

      if (landCreated) {
        res.setSuccess(landCreated);
      } else {
        res.setFailed(ErrorMes.LAND_CREATE);
      }

    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async getMyPosts(myPostsDto: MyPostsDto, user: any): Promise<DataRes<PageDto<Land>>> {
    try {
      var res = new DataRes<PageDto<Land>>;

      if (!user || !user?.id) {
        res.setFailed(ErrorMes.LAND_GET_MY_POSTS);
        return res;
      }

      const lands = await this.landsRepository.getMyPosts(myPostsDto, user.id);

      if (!lands) {
        res.setFailed(ErrorMes.LAND_GET_MY_POSTS);
      } else {
        res.setSuccess(lands);
      }
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async getMyPostSlug(slug: string, user: any): Promise<DataRes<any>> {
    var res = new DataRes<any>();

    try {
      const land = await this.landsRepository.findOneMyLandBySlug(slug, user?.id);
      const image = await this.imagesRepository.getImagesByProductId(land.id);

      if (!land || land?.user_id !== user?.id || !land?.collaborator_id) {
        res.setFailed(ErrorMes.LAND_GET_DETAIL);
      } else {
        let { acreage_level, price_level, active, collaborator_id, status, user_id, ...rest } = land;
        const colla = await this.collaboratorsRepository.findOneCollaborator(collaborator_id);

        res.setSuccess({ ...rest, images: image || [], contact: colla });
      }
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async removeMyPost(id: string, user: any): Promise<DataRes<any>> {
    var res = new DataRes<Partial<Land>>();

    try {
      const land = await this.landsRepository.findOneLand(id);

      if (land && land?.user_id == user.id) {
        const landUpdated = await this.landsRepository.updateLand(id, { status: LandStatus.CANCELLED });

        if (!!landUpdated) {
          res.setSuccess(null);
        } else {
          res.setFailed(ErrorMes.LAND_REMOVE);
        }
      } else {
        res.setFailed(ErrorMes.LAND_REMOVE);
      }

    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async updateMyPost(id: string, payload: UpdateLandCustomerDto, user: any): Promise<DataRes<any>> {
    var res = new DataRes<any>();

    try {
      const land = await this.landsRepository.findOneLand(id);
      if (!land || !user || land?.user_id !== user?.id) {
        res.setFailed(ErrorMes.LAND_UPDATE);
        return res;
      }

      const dataLand = {
        category_id: payload?.category_id,
        district: payload?.district,
        ward: payload?.ward,
        address_detail: payload?.address_detail,
        title: payload?.title,
        description: payload?.description,
        acreage: payload?.acreage,
        price: payload?.price,
        is_have_video: payload?.is_have_video,
        commission: payload?.commission,
        ...(land.status !== LandStatus.NEW && { status: LandStatus.UPDATE })
      }
      const landUpdated = await this.landsRepository.updateLand(id, dataLand);
      if (!landUpdated) {
        res.setFailed(ErrorMes.LAND_UPDATE);
        return res;
      }

      const dataColla = {
        name: payload?.contact_name,
        address: payload?.contact_address,
        position: payload?.is_contact_owner ? LandPosition.Owner : LandPosition.Agency,
        zalo: payload.contact_zalo
      }
      const collaUpdated = await this.collaboratorsRepository.updateCollaborator(land.collaborator_id, dataColla)
      if (!collaUpdated) {
        res.setFailed(ErrorMes.LAND_UPDATE);
      } else {
        res.setSuccess(null);
      }
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

}
