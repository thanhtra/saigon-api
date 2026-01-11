import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Upload } from './entities/upload.entity';

@Injectable()
export class UploadsRepository {
  constructor(
    @InjectRepository(Upload)
    private readonly repo: Repository<Upload>,
  ) { }

  async create(
    data: Partial<Upload>,
  ): Promise<Upload> {
    const upload = this.repo.create(data);
    return this.repo.save(upload);
  }

}


