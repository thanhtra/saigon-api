import { RentalType, RentalStatus } from 'src/common/helpers/enum';
import { IsEnum, IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class CreateRentalDto {
    @IsString()
    title: string;

    @IsEnum(RentalType)
    rental_type: RentalType;

    @IsString()
    address_detail: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    price?: number;

    @IsOptional()
    @IsNumber()
    total_rooms?: number;

    @IsOptional()
    @IsEnum(RentalStatus)
    status?: RentalStatus;

    @IsString()
    collaborator_id: string;

    @IsOptional()
    @IsString()
    description?: string;

}

