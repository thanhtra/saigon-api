import { Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    Min
} from 'class-validator';
import { RentalAmenity, RoomStatus } from 'src/common/helpers/enum';


export class CreateRoomDto {
    @IsString()
    rental_id: string;

    @IsString()
    collaborator_id: string;

    @IsString()
    title: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsOptional()
    @IsEnum(RoomStatus)
    status?: RoomStatus;

    @IsOptional()
    @IsNumber()
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
    cover_index?: number;

    @IsArray()
    @IsString({ each: true })
    upload_ids: string[];

    @Type(() => Boolean)
    @IsBoolean()
    active: boolean;
}
