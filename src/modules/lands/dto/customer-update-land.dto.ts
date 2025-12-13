import { PartialType } from '@nestjs/mapped-types';
import { CreateLandCustomerDto } from './customer-create-land.dto';

export class UpdateLandCustomerDto extends PartialType(CreateLandCustomerDto) { }
