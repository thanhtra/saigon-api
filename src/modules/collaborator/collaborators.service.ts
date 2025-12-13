import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Enums } from 'src/common/dtos/enum.dto';
import { DataRes, PageDto, PageOptionsDto } from "src/common/dtos/respones.dto";
import { ErrorMes } from "../../common/helpers/errorMessage";
import { CollaboratorsRepository } from './collaborators.repository';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { UpdateCollaboratorDto } from './dto/update-collaborator.dto';
import { Collaborator } from './entities/collaborator.entity';

@Injectable()
export class CollaboratorsService {
  constructor(
    private collaboratorsRepository: CollaboratorsRepository,
    @Inject(REQUEST) private request,) { }


  async getCollaborator(id: string): Promise<DataRes<Collaborator>> {
    var res = new DataRes<Collaborator>();

    try {
      const collaborator = await this.collaboratorsRepository.findOneCollaborator(id);

      if (!collaborator) {
        res.setFailed(ErrorMes.COLLABORATOR_GET_DETAIL);
      }

      res.setSuccess(collaborator);
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async getContactDetail(landId: string): Promise<DataRes<any>> {
    var res = new DataRes<any>();

    try {
      const contact = await this.collaboratorsRepository.getContactDetail(landId);

      if (!contact) {
        res.setFailed(ErrorMes.COLLABORATOR_GET_CONTACT);
      }

      res.setSuccess(contact);
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  getEnums(): DataRes<Enums[]> {
    var res = new DataRes<Enums[]>;

    try {
      let arr: Array<Enums> = [];
      Object.entries(CreateCollaboratorDto.getEnums()).forEach(item => {
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

  async update(id: string, updateCollaboratorDto: UpdateCollaboratorDto): Promise<DataRes<Collaborator>> {
    var res = new DataRes<Collaborator>();

    try {
      const collaboratorUpdated = await this.collaboratorsRepository.updateCollaborator(id, updateCollaboratorDto);

      if (collaboratorUpdated) {
        res.setSuccess(collaboratorUpdated);
      } else {
        res.setFailed(ErrorMes.COLLABORATOR_UPDATE);
      }
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  findOneByPhone(phone: string) {
    return this.collaboratorsRepository.findOneCollaboratorByPhone(phone);
  }

  async getCollaborators(pageOptionsDto: PageOptionsDto): Promise<DataRes<PageDto<Collaborator>>> {
    var res = new DataRes<PageDto<Collaborator>>;

    try {
      const collaborators = await this.collaboratorsRepository.getCollaborators(pageOptionsDto);

      if (!collaborators) {
        res.setFailed(ErrorMes.COLLABORATOR_GET_ALL);
        return res;
      }

      res.setSuccess(collaborators);
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async getAllCollaborators(pageOptionsDto: PageOptionsDto): Promise<DataRes<PageDto<Collaborator>>> {
    var res = new DataRes<PageDto<Collaborator>>;

    try {
      const collaborators = await this.collaboratorsRepository.getAllCollaborators(pageOptionsDto);

      if (!collaborators) {
        res.setFailed(ErrorMes.COLLABORATOR_GET_ALL);
        return res;
      }

      res.setSuccess(collaborators);
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async create(createCollaboratorDto: CreateCollaboratorDto): Promise<DataRes<Collaborator>> {
    var res = new DataRes<Collaborator>();

    try {
      const collaboratorCreated = await this.collaboratorsRepository.createCollaborator(createCollaboratorDto);

      if (collaboratorCreated) {
        res.setSuccess(collaboratorCreated);
      } else {
        res.setFailed(ErrorMes.COLLABORATOR_CREATE);
      }
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async removeCollaborator(id: string): Promise<DataRes<Collaborator>> {
    var res = new DataRes<Collaborator>();

    try {
      const { affected } = await this.collaboratorsRepository.removeCollaborator(id);

      if (affected === 1) {
        res.setSuccess(null);
      } else {
        res.setFailed(ErrorMes.COLLABORATOR_REMOVE);
      }
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }


}
