import {
    IsBoolean, IsEmail, IsEnum, IsOptional,
    IsString, Matches, MaxLength, MinLength
} from 'class-validator';
import { CustomerType, UserRole } from 'src/common/helpers/enum';
import { PHONE_REGEX } from 'src/common/helpers/utils';


export class CustomerCreateUserDto {
    @IsString()
    name: string;

    @IsString()
    @Matches(PHONE_REGEX, { message: 'Số điện thoại không hợp lệ' })
    phone: string;

    @IsString()
    @MinLength(6)
    @MaxLength(32)
    password: string;

    @IsEnum(CustomerType)
    customer_type: CustomerType;
}

export class CreateUserDto {
    @IsString()
    name: string;

    @IsString()
    @Matches(PHONE_REGEX, { message: 'Số điện thoại không hợp lệ' })
    phone: string;

    @IsString()
    @MinLength(6)
    @MaxLength(32)
    password: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsEnum(UserRole)
    role: UserRole;

    @IsString()
    @IsOptional()
    note?: string;

    @IsBoolean()
    @IsOptional()
    active?: boolean;
}
