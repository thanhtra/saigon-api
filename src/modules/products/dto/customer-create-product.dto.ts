import {
    IsBoolean,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength
} from 'class-validator';

export class CreateProductCustomerDto {
    @IsString()
    category_id: string;

    @IsString()
    @MinLength(5, {
        message: 'Tên sản phẩm quá ngắn',
    })
    @MaxLength(90, {
        message: 'Tên sản phẩm quá dài',
    })
    name: string;

    @IsString()
    @MinLength(30, {
        message: 'Mô tả quá ngắn',
    })
    @MaxLength(3000, {
        message: 'Mô tả quá dài',
    })
    description: string;

    @IsString()
    packs: string;

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

}