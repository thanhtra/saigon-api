import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { BookingStatus } from 'src/common/helpers/enum';

export class CreateBookingDto {

    @IsString()
    @IsNotEmpty()
    room_id: string;

    @IsString()
    @IsNotEmpty()
    customer_name: string;

    @IsPhoneNumber('VN')
    customer_phone: string;

    @IsString()
    @IsOptional()
    customer_note?: string;

    @IsString()
    @IsOptional()
    admin_note?: string;

    @IsDateString()
    viewing_at: string;

    @IsEnum(BookingStatus)
    @IsOptional()
    status?: BookingStatus;
}


export class CreateBookingPublicDto {

    @IsString()
    room_id: string;

    @IsString()
    customer_name: string;

    @IsPhoneNumber('VN')
    customer_phone: string;

    @IsDateString()
    viewing_at: string;

    @IsString()
    @IsOptional()
    customer_note?: string;
}
