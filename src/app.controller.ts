import { Controller, Get } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Public } from './common/decorators/public.decorator';
import { DataRes } from './common/dtos/respones.dto';
import { AdministrativeUnits } from './config/administrativeUnits';
import { CategoryType, CategoryTypeOptions } from './config/categoryType';
import { Position } from './config/positionType';
import { AcreageLevel, PriceLevel } from './config/filterLand';
import { UserRoles, UserRolesOptions } from './config/userRoles';
import { StatusProduct } from './config/productStatus';
import { OrderStatusOptions } from './config/orderStatus';
import { LandStatusOptions } from './config/landStatus';
import { ProductStatusOptions } from './config/productStatus';

@Controller('common')
export class AppController {
  constructor(private connection: Connection) { }

  @Public()
  @Get('status')
  async status() {
    // Testing the database connection
    const dbTest = await this.connection.query(`
          select 1+1, 'this is a healthcheck' as test`);

    return {
      db: dbTest[0]['test'] === 2 ? 'OK' : 'NOK',
    };
  }

  // @Public()
  @Get('metadata')
  metadata(): DataRes<any> {
    var res = new DataRes<any>();

    try {
      const data = {
        userRoles: UserRoles,
        categoryType: CategoryType,
        categoryTypeOptions: CategoryTypeOptions,
        positionType: Position,
        userRolesOptions: UserRolesOptions,
        administrativeUnits: AdministrativeUnits,
        priceLevel: PriceLevel,
        acreageLevel: AcreageLevel,
        statusProduct: StatusProduct,
        orderStatusOptions: OrderStatusOptions,
        landStatusOptions: LandStatusOptions,
        productStatusOptions: ProductStatusOptions
      };

      res.setSuccess(data);
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }
}
