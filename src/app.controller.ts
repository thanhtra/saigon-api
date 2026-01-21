import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Public } from './common/decorators/public.decorator';

@Controller('health')
export class AppController {
  constructor(private readonly dataSource: DataSource) { }

  @Public()
  @Get('')
  async health() {
    try {
      await this.dataSource.query('SELECT 1');
      return { status: 'ok' };
    } catch (e) {
      throw new ServiceUnavailableException('Database not ready');
    }

  }
}
