import { Transform, Type } from 'class-transformer';
import {
    IsBoolean,
    IsDefined,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min
} from 'class-validator';
import { LandType } from 'src/common/helpers/enum';

export class CreateLandDto {

    @IsEnum(LandType)
    land_type: LandType;

    @IsString()
    @IsNotEmpty()
    title: string;

    @Transform(({ value }) => value === '' ? null : value)
    @IsOptional()
    daitheky_link?: string;

    /* ===== ADDRESS ===== */

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

    /* ===== PARAMETER ===== */

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    area?: number;

    @IsOptional()
    @IsString()
    structure?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    width_top?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    width_bottom?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    length_left?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    length_right?: number;

    /* ===== PRICE ===== */

    @Type(() => Number)
    @IsNumber()
    @Min(1, { message: 'Giá phải lớn hơn 0' })
    price: number;

    /* ===== COLLABORATOR ===== */

    @IsString()
    @IsDefined()
    collaborator_id: string;

    @IsOptional()
    @IsString()
    commission?: string;

    /* ===== CONTENT ===== */

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsOptional()
    @IsString()
    private_note?: string;

    /* ===== MEDIA ===== */

    @IsOptional()
    @IsString()
    video_url?: string;

    /* ===== STATUS ===== */

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    active?: boolean;
}
