import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsPhoneNumber,
    IsString,
    MinLength,
} from 'class-validator';
import { UserRole } from 'src/common/helpers/enum';

export class CreateTenantDto {

    // 🔐 Thông tin user
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsPhoneNumber('VN')
    phone: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsString()
    @MinLength(6)
    password: string;

    // 📌 Mặc định là tenant
    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole = UserRole.Tenant;

    // 📝 Ghi chú nghiệp vụ
    @IsOptional()
    @IsString()
    note?: string;
}

export class CreateTenantFromBookingDto {

    // 🔗 Booking liên quan
    @IsString()
    @IsNotEmpty()
    booking_id: string;

    // 👤 Thông tin khách (lấy từ booking nhưng cho phép sửa)
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsPhoneNumber('VN')
    phone: string;

    @IsOptional()
    @IsString()
    email?: string;

    // 🔐 Tạo tài khoản cho tenant
    @IsOptional()
    @IsString()
    password?: string;

    // 📝 Ghi chú nội bộ
    @IsOptional()
    @IsString()
    note?: string;
}
