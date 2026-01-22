import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { RentalAmenity, RoomStatus } from 'src/common/helpers/enum';

export class UpdateRoomDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    video_url?: string;

    @IsOptional()
    @IsNumber()
    @Min(1, { message: 'Giá thuê phải lớn hơn 0' })
    price?: number;

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
    @IsNumber()
    area?: number;

    @IsOptional()
    @IsNumber()
    max_people?: number;

    @IsOptional()
    @IsArray()
    @IsEnum(RentalAmenity, { each: true })
    amenities?: RentalAmenity[];

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    cover_index?: number;

    @IsOptional()
    active?: boolean;

    /* ===== UPLOAD MANAGEMENT ===== */

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    upload_ids?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    delete_upload_ids?: string[];
}

export class CustomerUpdateRoomDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsNumber()
    @Min(1, { message: 'Giá thuê phải lớn hơn 0' })
    price?: number;

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
    @IsNumber()
    area?: number;

    @IsOptional()
    @IsNumber()
    max_people?: number;

    @IsOptional()
    @IsArray()
    @IsEnum(RentalAmenity, { each: true })
    amenities?: RentalAmenity[];

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    cover_index?: number;

    /* ===== UPLOAD MANAGEMENT ===== */

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    upload_ids?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    delete_upload_ids?: string[];
}
