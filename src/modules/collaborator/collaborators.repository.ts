import { Injectable } from '@nestjs/common';
import { PageDto, PageMetaDto, PageOptionsDto } from "src/common/dtos/respones.dto";
import { getSkip } from 'src/common/helpers/utils';
import { Connection, EntityRepository, Repository } from 'typeorm';
import { Land } from '../lands/entities/land.entity';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { UpdateCollaboratorDto } from './dto/update-collaborator.dto';
import { Collaborator } from './entities/collaborator.entity';
import { User } from '../users/entities/user.entity';


@Injectable()
@EntityRepository(Collaborator)
export class CollaboratorsRepository {
  private repo: Repository<Collaborator>;
  private landRepo: Repository<Land>;
  private userRepo: Repository<User>;

  constructor(private connection: Connection) {
    this.repo = this.connection.getRepository(Collaborator);
    this.landRepo = this.connection.getRepository(Land);
    this.userRepo = this.connection.getRepository(User);
  }

  createCollaborator = async (createCollaboratorDto: CreateCollaboratorDto) => {
    const data = this.repo.create(createCollaboratorDto);

    return this.repo.save(data);
  };

  findOneCollaborator = async (id: string) => {
    return this.repo.findOneOrFail({ where: { id } });
  };

  getCollaborators = async (pageOptionsDto: PageOptionsDto): Promise<PageDto<Collaborator>> => {
    const queryBuilder = this.repo.createQueryBuilder("collaborator");

    queryBuilder
      .select(['collaborator.active', 'collaborator.address', 'collaborator.age', 'collaborator.createdAt', 'collaborator.description', 'collaborator.field_cooperation', 'collaborator.gender', 'collaborator.id', 'collaborator.link_facebook', 'collaborator.name', 'collaborator.phone', 'collaborator.zalo', 'collaborator.position'])
      .orderBy("collaborator.createdAt", pageOptionsDto.order)
      .skip(getSkip(pageOptionsDto.page, pageOptionsDto.size))
      .take(pageOptionsDto.size);

    if (pageOptionsDto?.keySearch && pageOptionsDto?.multipleSearchEnums === '') {
      queryBuilder.andWhere('collaborator.phone like :data OR collaborator.name like :data OR collaborator.field_cooperation like :data', { data: `%${pageOptionsDto.keySearch}%` })
    }

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  };

  getAllCollaborators = async (pageOptionsDto: PageOptionsDto): Promise<PageDto<Collaborator>> => {
    const queryBuilder = this.repo.createQueryBuilder("collaborator");

    queryBuilder
      .select(['collaborator.id', 'collaborator.name', 'collaborator.phone'])
      .orderBy("collaborator.createdAt", pageOptionsDto.order)

    const itemCount = 0;
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  };


  getContactDetail = async (landId: string): Promise<any> => {
    const land = await this.landRepo.findOneOrFail({ where: { id: landId } });

    let collaborator = null;
    let user = null;

    if (land?.collaborator_id) {
      collaborator = await this.repo.findOne({ where: { id: land.collaborator_id } });
    }
    if (land?.user_id) {
      user = await this.userRepo.findOne({ where: { id: land.user_id } });
      delete user?.password;
      delete user?.refresh_token;
    }

    return {
      land: land,
      collaborator: collaborator,
      user: user
    }
  };

  findOneCollaboratorByPhone = async (phone: string) => {
    return this.repo.findOne({ where: { phone } });
  };

  updateCollaborator = async (id: string, updateCollaboratorDto: UpdateCollaboratorDto) => {
    const collaborator = await this.findOneCollaborator(id);
    if (!collaborator) return null;

    return this.repo.save({ ...collaborator, ...updateCollaboratorDto });
  };

  removeCollaborator = async (id: string) => {
    await this.repo.findOneOrFail({ where: { id } });
    return this.repo.delete(id);
  };
}
