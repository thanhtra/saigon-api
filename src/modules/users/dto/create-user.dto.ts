import {
    IsBoolean, IsEmail, IsEnum, IsOptional,
    IsString, Matches, MaxLength, MinLength
} from 'class-validator';
import { UserRole } from 'src/common/helpers/enum';

export class CreateUserDto {
    @IsString()
    name: string;

    @IsString()
    @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
        message: 'Number phone is wrong',
    })
    phone: string;

    @IsString()
    @MinLength(6)
    @MaxLength(32)
    password: string;

    @IsEmail()
    @IsOptional()
    email: string;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @IsBoolean()
    @IsOptional()
    active: boolean;

    @IsString()
    @IsOptional()
    address_default: string;

    @IsString()
    @IsOptional()
    refresh_token: string;

    static getEnums() {
        return {
            fullName: 'Họ và tên',
            email: 'Email',
            phone: 'Số điện thoại',
            role: 'Quyền',
            active: 'Trạng thái'
        };
    }
}
