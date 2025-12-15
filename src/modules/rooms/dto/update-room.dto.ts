import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomDto } from './create-room.dto';
import { RoomStatus } from 'src/common/helpers/enum';
import { IsOptional, IsEnum } from 'class-validator';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
    @IsOptional()
    @IsEnum(RoomStatus)
    status?: RoomStatus;
}
