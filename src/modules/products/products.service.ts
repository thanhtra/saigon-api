import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Enums } from 'src/common/dtos/enum.dto';
import { DataRes, PageDto } from 'src/common/dtos/respones.dto';
import { ErrorMes } from 'src/common/helpers/errorMessage';
import { ImagesRepository } from '../images/images.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductsRepository } from './products.repository';
import { CategoryType } from 'src/config/categoryType';
import { CollaboratorsRepository } from '../collaborator/collaborators.repository';
import { CreateProductCustomerDto } from './dto/customer-create-product.dto';
import { CreateCollaboratorDto } from '../collaborator/dto/create-collaborator.dto';
import { ProductStatus } from 'src/config/productStatus';
import { StatusProduct } from 'src/config/commonStatuses';
import { MyPostsDto } from './dto/my-posts.dto';
import { LandStatus } from 'src/config/landStatus';
import { UpdateProductCustomerDto } from './dto/customer-update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private productsRepository: ProductsRepository,
    private imagesRepository: ImagesRepository,
    private collaboratorsRepository: CollaboratorsRepository,
    @Inject(REQUEST) private request,
  ) { }

  getEnums(): DataRes<Enums[]> {
    var res = new DataRes<Enums[]>;

    try {
      let arr: Array<Enums> = [];
      Object.entries(CreateProductDto.getEnums()).forEach(item => {
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

  async create(createProductDto: CreateProductDto): Promise<DataRes<any>> {
    var res = new DataRes<any>();

    try {
      const productCreated = await this.productsRepository.createProduct(createProductDto);

      if (productCreated) {
        res.setSuccess(productCreated);
      } else {
        res.setFailed(ErrorMes.PRODUCT_CREATE);
      }
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async getProducts(queryProductDto: QueryProductDto): Promise<DataRes<PageDto<Product>>> {
    var res = new DataRes<PageDto<Product>>;

    try {
      const products = await this.productsRepository.getProducts(queryProductDto);

      if (!products) {
        res.setFailed(ErrorMes.PRODUCT_GET_ALL);
        return res;
      }

      res.setSuccess(products);
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async getProductsCustomer(queryProductDto: QueryProductDto): Promise<DataRes<PageDto<Product>>> {
    var res = new DataRes<PageDto<Product>>;

    try {
      const products = await this.productsRepository.getProductsCustomer(queryProductDto);

      if (!products) {
        res.setFailed(ErrorMes.PRODUCT_GET_ALL);
        return res;
      }

      res.setSuccess(products);
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  findOne(id: string) {
    return this.productsRepository.findOneProduct(id);
  }

  async getProductDetail(id: string): Promise<DataRes<any>> {
    var res = new DataRes<any>();

    try {
      const productPromise = this.productsRepository.findOneProduct(id);
      const imagePromise = this.imagesRepository.getImagesByProductId(id);
      const [product, image] = await Promise.all([productPromise, imagePromise]);

      if (!product) {
        res.setFailed(ErrorMes.PRODUCT_GET_DETAIL);
      }

      res.setSuccess({ ...product, images: image });
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async getProductDetailBySlug(slug: string): Promise<DataRes<any>> {
    var res = new DataRes<any>();

    try {
      const product = await this.productsRepository.findOneProductBySlug(slug);
      const image = await this.imagesRepository.getImagesByProductId(product.id);

      if (!product || !image) {
        res.setFailed(ErrorMes.PRODUCT_GET_DETAIL);
      }

      res.setSuccess({ ...product, images: image });
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<DataRes<Partial<Product>>> {
    var res = new DataRes<Partial<Product>>();

    try {
      const productUpdated = await this.productsRepository.updateProduct(id, updateProductDto);

      if (!productUpdated) {
        res.setFailed(ErrorMes.PRODUCT_UPDATE);
      } else {
        res.setSuccess(productUpdated);
      }
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async removeProduct(id: string): Promise<DataRes<any>> {
    var res = new DataRes<any>();

    try {
      const { affected: removed } = await this.imagesRepository.removeImageByProductId(id, CategoryType.PRODUCT);
      if (removed !== 1) {
        res.setFailed(ErrorMes.PRODUCT_REMOVE);
      } else {
        const { affected } = await this.productsRepository.removeProduct(id);

        if (affected === 1) {
          res.setSuccess(null)
        } else {
          res.setFailed(ErrorMes.PRODUCT_REMOVE);
        }
      }

    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }


  async getMyPostSlug(slug: string): Promise<DataRes<any>> {
    var res = new DataRes<any>();

    try {
      const userId = this.request?.user?.id || null;

      const product = await this.productsRepository.findOneMyProductBySlug(slug, userId);
      const image = await this.imagesRepository.getImagesByProductId(product.id);

      if (!product || product?.user_id !== userId || !product?.collaborator_id) {
        res.setFailed(ErrorMes.PRODUCT_GET_DETAIL);
      } else {
        let { active, collaborator_id, status, user_id, ...rest } = product;
        const colla = await this.collaboratorsRepository.findOneCollaborator(collaborator_id);

        res.setSuccess({ ...rest, images: image || [], contact: colla });
      }
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async createProductCustomer(payload: CreateProductCustomerDto): Promise<DataRes<any>> {
    var res = new DataRes<any>();
    const user = this.request?.user || null;

    if (!user && !user?.id) {
      res.setFailed(ErrorMes.PRODUCT_CREATE);
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
        newColla.field_cooperation = CategoryType.PRODUCT;

        const collaCreated = await this.collaboratorsRepository.createCollaborator(newColla);
        if (!collaCreated) {
          res.setFailed(ErrorMes.PRODUCT_CREATE);
          return res;
        }

        collaboratorId = collaCreated.id;
      } else {
        collaboratorId = collaborator?.id;
      }

      if (!collaboratorId) {
        res.setFailed(ErrorMes.PRODUCT_CREATE);
        return res;
      }

      //Tạo mới thông tin bất động sản
      const newProduct = new CreateProductDto();

      newProduct.name = payload.name;
      newProduct.category_id = payload.category_id;
      newProduct.packs = payload.packs;
      newProduct.description = payload.description;
      newProduct.collaborator_id = collaboratorId;
      newProduct.is_have_video = payload?.is_have_video || false;
      newProduct.status = StatusProduct.INSELL;
      newProduct.status_post = ProductStatus.NEW;
      newProduct.user_id = user?.id;

      const productCreated = await this.productsRepository.createProduct(newProduct);
      if (productCreated) {
        res.setSuccess(productCreated);
      } else {
        res.setFailed(ErrorMes.PRODUCT_CREATE);
      }

    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async getMyPosts(myPostsDto: MyPostsDto): Promise<DataRes<PageDto<Product>>> {
    try {
      const user = this.request?.user;
      var res = new DataRes<PageDto<Product>>;

      if (!user || !user?.id) {
        res.setFailed(ErrorMes.PRODUCT_GET_MY_POSTS);
        return res;
      }

      const products = await this.productsRepository.getMyPosts(myPostsDto, user.id);

      if (!products) {
        res.setFailed(ErrorMes.PRODUCT_GET_MY_POSTS);
      } else {
        res.setSuccess(products);
      }
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async removeMyPost(id: string): Promise<DataRes<any>> {
    var res = new DataRes<Partial<Product>>();

    try {
      const user = this.request?.user || {};
      const product = await this.productsRepository.findOneProduct(id);

      if (product && product?.user_id == user.id) {
        const productUpdated = await this.productsRepository.updateProduct(id, { status_post: LandStatus.CANCELLED });

        if (!!productUpdated) {
          res.setSuccess(null);
        } else {
          res.setFailed(ErrorMes.PRODUCT_REMOVE);
        }
      } else {
        res.setFailed(ErrorMes.PRODUCT_REMOVE);
      }

    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async updateMyPost(id: string, payload: UpdateProductCustomerDto): Promise<DataRes<any>> {
    var res = new DataRes<any>();

    try {
      const user = this.request?.user || {};
      const product = await this.productsRepository.findOneProduct(id);
      if (!product || !user || product?.user_id !== user?.id) {
        res.setFailed(ErrorMes.PRODUCT_UPDATE);
        return res;
      }

      const dataProduct = {
        category_id: payload?.category_id,
        name: payload?.name,
        description: payload?.description,
        packs: payload?.packs,
        is_have_video: payload?.is_have_video,
        // status: payload?.status,
        ...(product.status_post !== LandStatus.NEW && { status_post: LandStatus.UPDATE })
      }
      const productUpdated = await this.productsRepository.updateProduct(id, dataProduct);
      if (!productUpdated) {
        res.setFailed(ErrorMes.PRODUCT_UPDATE);
        return res;
      }

      const dataColla = {
        name: payload?.contact_name,
        address: payload?.contact_address,
        zalo: payload.contact_zalo
      }
      const collaUpdated = await this.collaboratorsRepository.updateCollaborator(product.collaborator_id, dataColla)
      if (!collaUpdated) {
        res.setFailed(ErrorMes.PRODUCT_UPDATE);
      } else {
        res.setSuccess(null);
      }
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }
}
