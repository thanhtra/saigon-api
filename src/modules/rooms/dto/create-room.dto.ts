import {
    IsEnum,
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    Min
} from 'class-validator';
import { RoomStatus } from 'src/common/helpers/enum';

export class CreateRoomDto {
    @IsString()
    room_code: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    area?: number;

    @IsOptional()
    @IsNumber()
    max_people?: number;

    @IsOptional()
    @IsEnum(RoomStatus)
    status?: RoomStatus;

    @IsString()
    rental_id: string;

    static getEnums() {
        return {
            room_code: 'Mã phòng',
            price: 'Giá thuê',
            area: 'Diện tích',
            max_people: 'Số người tối đa',
            status: 'Trạng thái phòng',
        };
    }
}
