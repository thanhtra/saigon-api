import {
    IsOptional,
    IsString,
    IsArray,
    IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PageOptionsDto } from 'src/common/dtos/respones.dto';

export class QueryRoomPublicDto extends PageOptionsDto {
    /* ===== LOCATION ===== */
    @IsOptional()
    @IsString()
    province?: string;

    @IsOptional()
    @IsString()
    district?: string;

    @IsOptional()
    @IsString()
    ward?: string;

    /* ===== SEARCH ===== */
    @IsOptional()
    @IsString()
    keyword?: string;

    /* ===== FILTER ===== */

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) =>
        typeof value === 'string'
            ? value.split(',').filter(Boolean)
            : value,
    )
    rental_type?: string[];

    @IsOptional()
    @IsString()
    price_level?: string;

    @IsOptional()
    @IsString()
    acreage_level?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) =>
        typeof value === 'string'
            ? value.split(',').filter(Boolean)
            : value,
    )
    amenities?: string[];
}
