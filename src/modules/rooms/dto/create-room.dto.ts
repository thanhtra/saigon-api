import { Transform, Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min,
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
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(1, { message: 'Giá thuê phải lớn hơn 0' })
    price: number;

    @IsOptional()
    @IsEnum(RoomStatus)
    status?: RoomStatus;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
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
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    cover_index?: number;

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
}
