import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { BookingStatus } from 'src/common/helpers/enum';

export class CreateBookingDto {

    // 🏠 Phòng cần xem
    @IsString()
    @IsNotEmpty()
    room_id: string;

    // 👤 Sale / người dẫn khách
    @IsString()
    @IsNotEmpty()
    guide_id: string;

    // 👤 Thông tin khách
    @IsString()
    @IsNotEmpty()
    customer_name: string;

    @IsPhoneNumber('VN')
    customer_phone: string;

    @IsString()
    @IsOptional()
    customer_note?: string;

    // 📅 Ngày giờ xem phòng
    @IsDateString()
    viewing_at: string;

    // 📝 Lưu ý khi xem phòng
    @IsString()
    @IsOptional()
    note?: string;

    // 📌 Cho phép admin/sale set trước trạng thái
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
