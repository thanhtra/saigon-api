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

export class CreateRentalDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsEnum(RentalType)
    rental_type: RentalType;

    @IsString()
    @IsNotEmpty()
    province: string;

    @IsString()
    @IsNotEmpty()
    district: string;

    @IsString()
    @IsNotEmpty()
    ward: string;

    @IsOptional()
    @IsString()
    street?: string;

    @IsOptional()
    @IsString()
    house_number?: string;

    @IsString()
    @IsNotEmpty()
    address_detail: string;

    @IsString()
    @IsNotEmpty()
    address_detail_display: string;

    @IsString()
    @IsNotEmpty()
    commission_value: string;

    @IsUUID()
    collaborator_id: string;

    @ValidateIf(o =>
        [
            RentalType.WholeHouse,
            RentalType.Apartment,
            RentalType.BusinessPremises,
        ].includes(o.rental_type),
    )
    @IsNumber()
    @Min(0)
    price?: number;

    /* ================= AMENITIES ================= */

    @IsOptional()
    @IsArray()
    @IsEnum(RentalAmenity, { each: true })
    amenities?: RentalAmenity[];

    /* ================= META ================= */

    @IsBoolean()
    active: boolean;

    @IsOptional()
    @IsString()
    description?: string;

    /* ================= UPLOAD ================= */

    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    upload_ids?: string[];

    @IsOptional()
    @IsNumber()
    cover_index?: number;
}
