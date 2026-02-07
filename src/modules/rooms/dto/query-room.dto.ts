import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from 'src/common/dtos/respones.dto';
import { RentalType, RoomStatus } from 'src/common/helpers/enum';

export class QueryRoomDto extends PageOptionsDto {

    @IsOptional()
    @IsString()
    rental_id?: string;

    @IsOptional()
    @IsString()
    ctv_collaborator_id?: string;

    @IsOptional()
    @IsEnum(RentalType)
    rental_type?: RentalType;

    @IsOptional()
    @IsEnum(RoomStatus)
    status?: RoomStatus;

    @IsOptional()
    @IsString()
    room_code?: string;
}
