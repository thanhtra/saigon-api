import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomDto } from './create-room.dto';
import { RoomStatus } from 'src/common/helpers/enum';
import { IsOptional, IsEnum, IsNumber, IsArray, IsString } from 'class-validator';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
    @IsOptional()
    @IsEnum(RoomStatus)
    status?: RoomStatus;

    @IsOptional()
    @IsNumber()
    cover_index?: number;

    @IsArray()
    @IsString({ each: true })
    upload_ids: string[];
}
