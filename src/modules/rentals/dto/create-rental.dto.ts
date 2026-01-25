import { Transform, Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsDefined,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Min,
    MinLength,
    ValidateIf,
} from 'class-validator';

import {
    RentalAmenity,
    RentalStatus,
    RentalType,
    RoomStatus,
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
    @IsEnum(RentalType)
    rental_type: RentalType;

    @IsUUID()
    collaborator_id: string;

    @IsString()
    @IsNotEmpty()
    commission: string;

    @IsOptional()
    @IsString()
    note?: string;

    @IsOptional()
    @IsEnum(RentalStatus)
    status?: RentalStatus;

    @Type(() => Boolean)
    @IsBoolean()
    active: boolean;


    // ADDRESS

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

    // FEE

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    fee_electric?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    fee_water?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    fee_wifi?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    fee_service?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    fee_parking?: number;

    @IsOptional()
    @IsString()
    fee_other?: string;

    @IsOptional()
    @IsString()
    water_unit?: string;

    // ROOM

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
    @Min(0)
    deposit?: number;

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
    description: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    floor?: number;

    @IsOptional()
    @IsString()
    room_number?: string;

    @IsOptional()
    @IsEnum(RoomStatus)
    room_status?: RoomStatus;
}

export class CustomerCreateBoardingHousesDto {

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
    street: string;

    @IsString()
    house_number: string;

    @IsString()
    @IsNotEmpty()
    address_detail: string;

    @IsString()
    @IsNotEmpty()
    address_detail_display: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    fee_electric?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    fee_water?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    fee_wifi?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    fee_service?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    fee_parking?: number;

    @IsOptional()
    @IsString()
    fee_other?: string;

    @IsOptional()
    @IsString()
    water_unit?: string;
}

export class CustomerCreateUnitRentalDto {
    @IsEnum(RentalType)
    rental_type: RentalType;

    // ADDRESS

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


    // FEE

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    fee_electric?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    fee_water?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    fee_wifi?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    fee_service?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    fee_parking?: number;

    @IsOptional()
    @IsString()
    fee_other?: string;

    @IsOptional()
    @IsString()
    water_unit?: string;

    // ROOM

    @IsString()
    @IsNotEmpty()
    title: string;

    @Type(() => Number)
    @IsDefined()
    @IsNumber()
    @Min(1, { message: 'Giá thuê phải lớn hơn 0' })
    price: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0, { message: 'Đặt cọc không được âm' })
    deposit?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    floor?: number;

    @IsOptional()
    @IsString()
    room_number?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    area?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    max_people?: number;

    @IsOptional()
    @IsArray()
    @IsEnum(RentalAmenity, { each: true })
    @Transform(({ value }) =>
        typeof value === 'string'
            ? value
                .split(',')
                .map(v => v.trim())
                .filter(Boolean)
            : Array.isArray(value)
                ? value
                : [],
    )
    amenities: RentalAmenity[] = [];

    @IsString()
    @IsNotEmpty()
    @MinLength(10, { message: 'Mô tả tối thiểu 10 ký tự' })
    description: string;

}
