import { IsEnum, IsOptional } from 'class-validator';
import { PageOptionsDto } from 'src/common/dtos/respones.dto';
import { RoomStatus } from 'src/common/helpers/enum';

export class QueryMyRoomsDto extends PageOptionsDto {

    @IsOptional()
    @IsEnum(RoomStatus)
    status?: RoomStatus;

}
