import { IsEmail, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { PHONE_REGEX } from 'src/common/helpers/utils';

export class CustomerUpdateUserDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @Matches(PHONE_REGEX, { message: 'Số điện thoại không hợp lệ' })
    zalo?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    link_facebook?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    address?: string;
}
