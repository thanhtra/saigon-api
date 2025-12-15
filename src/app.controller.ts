import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Public } from './common/decorators/public.decorator';
import { DataRes } from './common/dtos/respones.dto';
import { UserRoleOptions } from './common/helpers/constants';
import { UserRole } from './common/helpers/enum';
import { AdministrativeUnits } from './config/administrativeUnits';
import { CategoryType, CategoryTypeOptions } from './config/categoryType';
import { AcreageLevel, PriceLevel } from './config/filterLand';
import { LandStatusOptions } from './config/landStatus';
import { OrderStatusOptions } from './config/orderStatus';
import { Position } from './config/positionType';

@Controller('common')
export class AppController {
  constructor(private readonly dataSource: DataSource) { }

  @Public()
  @Get('status')
  async status(): Promise<{ db: 'OK' | 'NOK' }> {
    try {
      // Test the database connection
      const result = await this.dataSource.query('SELECT 1 + 1 AS test');
      const dbOk = result?.[0]?.test === 2;
      return { db: dbOk ? 'OK' : 'NOK' };
    } catch (error) {
      return { db: 'NOK' };
    }
  }

  @Public()
  @Get('metadata')
  metadata(): DataRes<any> {
    try {
      const data = {
        userRoles: UserRole,
        categoryType: CategoryType,
        categoryTypeOptions: CategoryTypeOptions,
        positionType: Position,
        userRoleOptions: UserRoleOptions,
        administrativeUnits: AdministrativeUnits,
        priceLevel: PriceLevel,
        acreageLevel: AcreageLevel,
        orderStatusOptions: OrderStatusOptions,
        landStatusOptions: LandStatusOptions,
      };

      return DataRes.success(data);
    } catch (ex) {
      return DataRes.failed(ex.message);
    }
  }
}
