import { Transform } from 'class-transformer';
import {
    IsArray,
    IsEnum,
    IsOptional,
    IsString,
} from 'class-validator';
import { PageOptionsDto } from 'src/common/dtos/respones.dto';
import { FurnitureStatus, HouseDirection, LandAmenity, LandType, LegalStatus } from 'src/common/helpers/enum';

export class QueryLandPublicDto extends PageOptionsDto {
    @IsOptional()
    @IsString()
    province?: string;

    @IsOptional()
    @IsString()
    district?: string;

    @IsOptional()
    @IsString()
    ward?: string;

    @IsOptional()
    @IsArray()
    @IsEnum(LandType, { each: true })
    @Transform(({ value }) =>
        typeof value === 'string'
            ? value.split(',').filter(Boolean)
            : value,
    )
    land_type?: LandType[];

    @IsOptional()
    @IsString()
    price_level?: string;

    @IsOptional()
    @IsString()
    acreage_level?: string;

    /* ===== AMENITY ===== */

    @IsOptional()
    @IsArray()
    @IsEnum(LandAmenity, { each: true })
    @Transform(({ value }) =>
        typeof value === 'string'
            ? value.split(',').filter(Boolean)
            : value,
    )
    amenities?: LandAmenity[];

    /* ===== EXTRA FILTER ===== */

    @IsOptional()
    @IsArray()
    @IsEnum(HouseDirection, { each: true })
    @Transform(({ value }) =>
        typeof value === 'string'
            ? value.split(',').filter(Boolean)
            : value,
    )
    house_direction?: HouseDirection[];

    @IsOptional()
    @IsArray()
    @IsEnum(LegalStatus, { each: true })
    @Transform(({ value }) =>
        typeof value === 'string'
            ? value.split(',').filter(Boolean)
            : value,
    )
    legal_status?: LegalStatus[];

    @IsOptional()
    @IsArray()
    @IsEnum(FurnitureStatus, { each: true })
    @Transform(({ value }) =>
        typeof value === 'string'
            ? value.split(',').filter(Boolean)
            : value,
    )
    furniture_status?: FurnitureStatus[];

    /* ===== ROOM FILTER ===== */

    @IsOptional()
    @IsString()
    bedrooms?: string; // VD: 1,2,3 hoặc 3+

    @IsOptional()
    @IsString()
    toilets?: string;  // VD: 1,2 hoặc 2+
}
