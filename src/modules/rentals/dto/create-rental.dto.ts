import { Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Min,
    ValidateIf,
} from 'class-validator';

import {
    RentalAmenity,
    RentalType,
} from 'src/common/helpers/enum';


const REQUIRE_DETAIL_TYPES = [
    RentalType.WholeHouse,
    RentalType.Apartment,
    RentalType.BusinessPremises,
];

const RequireDetail = ValidateIf(
    o => REQUIRE_DETAIL_TYPES.includes(o.rental_type),
);


export class CreateRentalDto {

    @IsString()
    @IsNotEmpty()
    province: string;

    @IsString()
    @IsNotEmpty()
    district: string;

    @IsString()
    @IsNotEmpty()
    ward: string;

    @IsString()
    @IsNotEmpty()
    street: string;

    @IsString()
    @IsNotEmpty()
    house_number: string;

    @IsString()
    @IsNotEmpty()
    address_detail: string;

    @IsString()
    @IsNotEmpty()
    address_detail_display: string;

    @IsString()
    @IsNotEmpty()
    commission_value: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsUUID()
    collaborator_id: string;

    @IsEnum(RentalType)
    rental_type: RentalType;

    @Type(() => Boolean)
    @IsBoolean()
    active: boolean;

    @RequireDetail
    @IsString()
    @IsNotEmpty()
    title: string;

    @RequireDetail
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    price: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    area?: number;

    @RequireDetail
    @IsArray()
    @IsEnum(RentalAmenity, { each: true })
    amenities?: RentalAmenity[];

    @RequireDetail
    @IsString()
    @IsNotEmpty()
    description_detail: string;

    @RequireDetail
    @IsArray()
    @IsUUID('4', { each: true })
    upload_ids: string[];

    @RequireDetail
    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    cover_index: number;

    @ValidateIf(o => o.rental_type === RentalType.Apartment)
    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    floor: number;

    @IsOptional()
    @IsString()
    room_number?: string;
}
