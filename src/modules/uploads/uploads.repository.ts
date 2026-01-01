// uploads.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { getSkip } from 'src/common/helpers/utils';
import { Upload } from './entities/upload.entity';

@Injectable()
export class UploadsRepository {
  constructor(
    @InjectRepository(Upload)
    private readonly repo: Repository<Upload>,
  ) { }

  async create(dto: CreateUploadDto): Promise<Upload> {
    const upload = this.repo.create(dto);
    return this.repo.save(upload);
  }

  async update(id: string, dto: UpdateUploadDto): Promise<Upload | null> {
    const upload = await this.repo.findOne({ where: { id } });
    if (!upload) return null;
    return this.repo.save(this.repo.merge(upload, dto));
  }

  async remove(id: string): Promise<boolean> {
    const { affected } = await this.repo.delete(id);
    return affected === 1;
  }

  async findOne(id: string): Promise<Upload | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['rental', 'room', 'contract'],
    });
  }

  async findAll(pageOptions: PageOptionsDto): Promise<PageDto<Upload>> {
    const qb = this.repo.createQueryBuilder('upload')
      .leftJoinAndSelect('upload.rental', 'rental')
      .leftJoinAndSelect('upload.room', 'room')
      .leftJoinAndSelect('upload.contract', 'contract')
      .orderBy('upload.createdAt', pageOptions.order)
      .skip(getSkip(pageOptions.page, pageOptions.size))
      .take(Math.min(pageOptions.size, 50));

    const [entities, itemCount] = await qb.getManyAndCount();
    return new PageDto(entities, new PageMetaDto({ itemCount, pageOptionsDto: pageOptions }));
  }

  async findByParent(
    rentalId?: string,
    roomId?: string,
    contractId?: string,
  ): Promise<Upload[]> {
    const qb = this.repo.createQueryBuilder('upload');
    if (rentalId) qb.andWhere('upload.rental_id = :rentalId', { rentalId });
    if (roomId) qb.andWhere('upload.room_id = :roomId', { roomId });
    if (contractId) qb.andWhere('upload.contract_id = :contractId', { contractId });
    return qb.getMany();
  }
}






// import { Injectable } from '@nestjs/common';
// import { PageDto, PageMetaDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
// import { Connection, EntityRepository, Repository } from 'typeorm';
// import { Upload } from './entities/upload.entity';
// import { join } from 'path';
// import * as fs from 'fs';
// import { CategoryType } from 'src/config/categoryType';
// import { Order } from 'src/common/helpers/enum';
// @Injectable()
// @EntityRepository(Upload)
// export class UploadsRepository {
//   private repo: Repository<Upload>;

//   constructor(private connection: Connection) {
//     this.repo = this.connection.getRepository(Upload);
//   }

//   createUpload = async (payload: any) => {
//     const { imageList, productId } = payload;

//     if (!imageList.length || !productId) {
//       return null;
//     }

//     const data = imageList.map((item: any) => {
//       return {
//         name: item,
//         product_id: productId
//       }
//     });

//     return this.repo
//       .createQueryBuilder("image")
//       .insert()
//       .values(data)
//       .execute();
//   };

//   getUploadsByProductId = async (productId: string): Promise<Upload[]> => {
//     return this.repo.createQueryBuilder("image")
//       .where("image.product_id = :productID", { productID: productId })
//       .orderBy("image.createdAt", Order.ASC)
//       .getMany();
//   };

//   removeUploadByName = async (imageName: string, type: string) => {
//     if (!imageName) return null;
//     let local = '';

//     switch (type) {
//       case CategoryType.PRODUCT:
//         local = 'product';
//         break;
//       case CategoryType.DISCOVERY:
//         local = 'discovery';
//         break;
//       case CategoryType.LAND:
//         local = 'land';
//         break;
//       default:
//         local = '';
//     }

//     if (!local) return null;

//     const flag = process.env.NODE_ENV === 'development' ? '\\' : '/';
//     const filePath = join(__dirname, '../../../', 'uploads', local) + flag + imageName;
//     fs.unlinkSync(filePath)

//     const image = await this.repo.findOneOrFail({ where: { file_path: imageName } });
//     if (!image) return null;

//     return this.repo.delete(image?.id);
//   };

//   removeUploadByProductId = async (productId: string, type: string) => {
//     if (!productId) return null;
//     let local = '';

//     switch (type) {
//       case CategoryType.PRODUCT:
//         local = 'product';
//         break;
//       case CategoryType.DISCOVERY:
//         local = 'discovery';
//         break;
//       case CategoryType.LAND:
//         local = 'land';
//         break;
//       default:
//         local = '';
//     }
//     if (!local) return null;

//     const images = await this.repo.find({ where: { product_id: productId } });
//     if (images && images.length) {
//       const res = await Promise.all(
//         images.map(async (item: any) => {
//           const flag = process.env.NODE_ENV === 'development' ? '\\' : '/';

//           if (item?.name) {
//             fs.unlinkSync(join(__dirname, '../../../', 'uploads', local) + flag + item.name);

//             const image = await this.repo.findOneOrFail({ where: { name: item.name } });
//             if (image) {
//               this.repo.delete(image?.id);
//             }
//           }

//         }));

//       if (res && res.length) {
//         return { affected: 1 };
//       }
//     } else {
//       return { affected: 1 };
//     }

//     return {};
//   };

// }
