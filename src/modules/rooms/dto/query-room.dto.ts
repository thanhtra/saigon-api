import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from 'src/common/dtos/respones.dto';
import { RoomStatus } from 'src/common/helpers/enum';

export class QueryRoomDto extends PageOptionsDto {

    // Lọc theo khu trọ / nhà cho thuê
    @IsString()
    @IsOptional()
    rental_id?: string = '';

    // Lọc theo mã phòng
    @IsString()
    @IsOptional()
    room_code?: string = '';

    // Lọc theo trạng thái phòng
    @IsEnum(RoomStatus)
    @IsOptional()
    status?: RoomStatus;

}
