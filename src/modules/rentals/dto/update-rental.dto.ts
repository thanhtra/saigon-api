import { PartialType } from '@nestjs/mapped-types';
import { CreateRentalDto } from './create-rental.dto';
import { RentalStatus, RentalType } from 'src/common/helpers/enum';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateRentalDto extends PartialType(CreateRentalDto) {
    @IsOptional()
    @IsEnum(RentalStatus)
    status?: RentalStatus;

    @IsOptional()
    @IsEnum(RentalType)
    rental_type?: RentalType;
}
