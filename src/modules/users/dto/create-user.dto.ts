import {
    IsBoolean, IsEmail, IsEnum, IsOptional,
    IsString, Matches, MaxLength, MinLength
} from 'class-validator';
import { CustomerType, UserRole } from 'src/common/helpers/enum';


export class CustomerCreateUserDto {
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

    @IsEnum(CustomerType)
    customer_type: CustomerType;
}

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
