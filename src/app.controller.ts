import { Controller } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('common')
export class AppController {
  constructor(private readonly dataSource: DataSource) { }

}
