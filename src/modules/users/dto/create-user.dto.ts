import {
    IsBoolean, IsEmail, IsEnum, IsOptional,
    IsString, Matches, MaxLength, MinLength
} from 'class-validator';
import { UserRoles } from '../../../config/userRoles';

export class CreateUserDto {
    @IsString()
    full_name: string;

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

    @IsEnum(UserRoles, { each: true })
    @IsOptional()
    role: string;

    @IsBoolean()
    @IsOptional()
    active: boolean;

    @IsString()
    @IsOptional()
    avatar: string;

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
