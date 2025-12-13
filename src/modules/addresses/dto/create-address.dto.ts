import {
    IsString
} from 'class-validator';

export class CreateAddressDto {
    @IsString()
    name: string;

    @IsString()
    phone: string;

    @IsString()
    province: string;

    @IsString()
    district: string;

    @IsString()
    ward: string;

    @IsString()
    address_detail: string;

    @IsString()
    user_id: string;
}
