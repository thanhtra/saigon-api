import { Injectable } from '@nestjs/common';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { Order } from 'src/common/helpers/constants';
import { Connection, EntityRepository, Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { join } from 'path';
import * as fs from 'fs';
import { CategoryType } from 'src/config/categoryType';
@Injectable()
@EntityRepository(Image)
export class ImagesRepository {
  private repo: Repository<Image>;

  constructor(private connection: Connection) {
    this.repo = this.connection.getRepository(Image);
  }

  createImage = async (payload: any) => {
    const { imageList, productId } = payload;

    if (!imageList.length || !productId) {
      return null;
    }

    const data = imageList.map((item: any) => {
      return {
        name: item,
        product_id: productId
      }
    });

    return this.repo
      .createQueryBuilder("image")
      .insert()
      .values(data)
      .execute();
  };

  getImagesByProductId = async (productId: string): Promise<Image[]> => {
    return this.repo.createQueryBuilder("image")
      .where("image.product_id = :productID", { productID: productId })
      .orderBy("image.createdAt", Order.ASC)
      .getMany();
  };

  removeImageByName = async (imageName: string, type: string) => {
    if (!imageName) return null;
    let local = '';

    switch (type) {
      case CategoryType.PRODUCT:
        local = 'product';
        break;
      case CategoryType.DISCOVERY:
        local = 'discovery';
        break;
      case CategoryType.LAND:
        local = 'land';
        break;
      default:
        local = '';
    }

    if (!local) return null;

    const flag = process.env.NODE_ENV === 'development' ? '\\' : '/';
    const filePath = join(__dirname, '../../../', 'uploads', local) + flag + imageName;
    fs.unlinkSync(filePath)

    const image = await this.repo.findOneOrFail({ where: { name: imageName } });
    if (!image) return null;

    return this.repo.delete(image?.id);
  };

  removeImageByProductId = async (productId: string, type: string) => {
    if (!productId) return null;
    let local = '';

    switch (type) {
      case CategoryType.PRODUCT:
        local = 'product';
        break;
      case CategoryType.DISCOVERY:
        local = 'discovery';
        break;
      case CategoryType.LAND:
        local = 'land';
        break;
      default:
        local = '';
    }
    if (!local) return null;

    const images = await this.repo.find({ where: { product_id: productId } });
    if (images && images.length) {
      const res = await Promise.all(
        images.map(async (item: any) => {
          const flag = process.env.NODE_ENV === 'development' ? '\\' : '/';

          if (item?.name) {
            fs.unlinkSync(join(__dirname, '../../../', 'uploads', local) + flag + item.name);

            const image = await this.repo.findOneOrFail({ where: { name: item.name } });
            if (image) {
              this.repo.delete(image?.id);
            }
          }

        }));

      if (res && res.length) {
        return { affected: 1 };
      }
    } else {
      return { affected: 1 };
    }

    return {};
  };

}
