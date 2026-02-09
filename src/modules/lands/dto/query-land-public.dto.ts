import { Transform } from 'class-transformer';
import {
    IsArray,
    IsEnum,
    IsOptional,
    IsString,
} from 'class-validator';
import { PageOptionsDto } from 'src/common/dtos/respones.dto';
import { LandType } from 'src/common/helpers/enum';

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
}
