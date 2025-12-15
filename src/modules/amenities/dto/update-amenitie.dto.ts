import { PartialType } from '@nestjs/mapped-types';
import { CreateAmenityDto } from './create-amenitie.dto';


export class UpdateAmenityDto extends PartialType(CreateAmenityDto) { }
