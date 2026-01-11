import {
    IsNotEmpty,
    IsOptional,
    IsPhoneNumber,
    IsString
} from 'class-validator';

export class CreateTenantDto {
    @IsNotEmpty()
    @IsString()
    user_id: string;

    @IsOptional()
    @IsString()
    note?: string;

    @IsOptional()
    active?: boolean = true;
}

export class CreateTenantFromBookingDto {

    @IsString()
    @IsNotEmpty()
    booking_id: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsPhoneNumber('VN')
    phone: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    password?: string;

    @IsOptional()
    @IsString()
    note?: string;
}
