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
    Min,
    MinLength,
} from 'class-validator';
import { RentalAmenity, RoomStatus } from 'src/common/helpers/enum';

export class CreateRoomDto {
    @IsString()
    @IsNotEmpty()
    rental_id: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @Type(() => Number)
    @IsNumber()
    @Min(1, { message: 'Giá thuê phải lớn hơn 0' })
    price: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0, { message: 'Đặt cọc không được âm' })
    deposit?: number;

    @IsOptional()
    @IsEnum(RoomStatus)
    status?: RoomStatus;

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
    amenities?: RentalAmenity[];

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    active?: boolean;

    @IsOptional()
    @IsString()
    video_url?: string;
}

export class CustomerCreateRoomDto {
    @IsString()
    @IsNotEmpty()
    rental_id: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    /* ===== PRICE ===== */
    @Type(() => Number)
    @IsDefined()
    @IsNumber()
    @Min(1, { message: 'Giá thuê phải lớn hơn 0' })
    price: number;

    /* ===== DEPOSIT ===== */
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0, { message: 'Đặt cọc không được âm' })
    deposit?: number;

    /* ===== BASIC INFO ===== */
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

    /* ===== AMENITIES ===== */
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

    /* ===== DESCRIPTION ===== */
    @IsString()
    @IsNotEmpty()
    @MinLength(10, { message: 'Mô tả tối thiểu 10 ký tự' })
    description: string;
}
