import {
    IsBoolean,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength
} from 'class-validator';

export class CreateLandCustomerDto {
    @IsString()
    category_id: string;

    @IsString()
    district: string;

    @IsString()
    ward: string;

    @IsString()
    @IsOptional()
    address_detail: string;

    @IsString()
    @MinLength(10, {
        message: 'Tiêu đề quá ngắn',
    })
    @MaxLength(90, {
        message: 'Tiêu đề quá dài',
    })
    title: string;

    @IsString()
    @MinLength(30, {
        message: 'Mô tả quá ngắn',
    })
    @MaxLength(3000, {
        message: 'Mô tả quá dài',
    })
    description: string;

    @IsString()
    acreage: string;

    @IsString()
    price: string;

    @IsBoolean()
    @IsOptional()
    is_have_video: boolean;

    @IsString()
    contact_name: string;

    @IsString()
    @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
        message: 'Số điện thoại không đúng',
    })
    contact_phone: string;

    @IsString()
    @IsOptional()
    @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
        message: 'Số zalo không đúng',
    })
    contact_zalo: string;

    @IsString()
    @IsOptional()
    contact_address: string;

    @IsBoolean()
    is_contact_owner: boolean;

    @IsString()
    commission: string;

}