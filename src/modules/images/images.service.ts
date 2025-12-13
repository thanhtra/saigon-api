import { Injectable } from '@nestjs/common';
import { DataRes } from 'src/common/dtos/respones.dto';
import { ErrorMes } from 'src/common/helpers/errorMessage';
import { CategoryType } from 'src/config/categoryType';
import { DiscoveriesRepository } from '../discoveries/discoveries.repository';
import { LandsRepository } from '../lands/lands.repository';
import { ProductsRepository } from '../products/products.repository';
import { ImagesRepository } from './images.repository';

@Injectable()
export class ImagesService {
    constructor(private imagesRepository: ImagesRepository,
        private landsRepository: LandsRepository,
        private discoveriesRepository: DiscoveriesRepository,
        private productsRepository: ProductsRepository
    ) { }

    async createImages(payload: any): Promise<DataRes<any>> {
        var res = new DataRes<any>();

        try {
            const { raw } = await this.imagesRepository.createImage(payload);

            if (!raw || raw?.length === 0) {
                res.setFailed(ErrorMes.CREATE_IMAGE);
            } else {
                const { imageList, productId, type } = payload;

                if (type === CategoryType.LAND) {
                    await this.landsRepository.updateLand(productId, { image: imageList[0] });
                }

                if (type === CategoryType.DISCOVERY) {
                    await this.discoveriesRepository.updateDiscovery(productId, { image: imageList[0] })
                }

                if (type === CategoryType.PRODUCT) {
                    await this.productsRepository.updateProduct(productId, { image: imageList[0] })
                }

                res.setSuccess(raw);
            }
        } catch (ex) {
            res.setFailed(ex.message);
        }

        return res;
    }

    async remove(payload: any): Promise<DataRes<any>> {
        var res = new DataRes<any>();

        try {
            const { imageName, productId, type } = payload;
            if (!imageName && !productId) {
                res.setFailed(ErrorMes.IMAGE_NAME_NOT_EXSIST);
                return res;
            }

            let imageRemoved: any = {};

            if (imageName) {
                imageRemoved = await this.imagesRepository.removeImageByName(imageName, type);
            } else {
                imageRemoved = await this.imagesRepository.removeImageByProductId(productId, type);
            }

            const { affected } = imageRemoved;

            if (affected === 1) {
                res.setSuccess(null);
            } else {
                res.setFailed(ErrorMes.IMAGE_REMOVE_FILE_DB);
            }

        } catch (ex) {
            res.setFailed('Maybe ' + ErrorMes.IMAGE_REMOVE_FILE + ' --or-- ' + ex.message);
        }

        return res;
    }

}
