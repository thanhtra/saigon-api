import { Transform, Type } from 'class-transformer';
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
    RentalStatus,
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

    @IsOptional()
    @IsEnum(RentalStatus)
    status?: RentalStatus;

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

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    max_people?: number;

    @RequireDetail
    @IsArray()
    @IsEnum(RentalAmenity, { each: true })
    @Transform(({ value }) =>
        typeof value === 'string'
            ? value.split(',').filter(Boolean)
            : Array.isArray(value)
                ? value
                : [],
    )
    amenities?: RentalAmenity[];

    @RequireDetail
    @IsString()
    @IsNotEmpty()
    description_detail: string;

    @ValidateIf(o => o.rental_type === RentalType.Apartment)
    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    floor: number;

    @IsOptional()
    @IsString()
    room_number?: string;
}
