import { PartialType } from '@nestjs/mapped-types';
import { CreateProductCustomerDto } from './customer-create-product.dto';

export class UpdateProductCustomerDto extends PartialType(CreateProductCustomerDto) { }
