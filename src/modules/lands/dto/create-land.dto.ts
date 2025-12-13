import {
    IsBoolean,
    IsOptional,
    IsString
} from 'class-validator';

export class CreateLandDto {
    @IsString()
    title: string;

    @IsString()
    price: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsString()
    acreage: string;

    @IsString()
    district: string;

    @IsString()
    ward: string;

    @IsString()
    @IsOptional()
    address_detail: string;

    @IsBoolean()
    @IsOptional()
    active: boolean;

    @IsString()
    category_id: string;

    @IsString()
    @IsOptional()
    image: string;

    @IsString()
    price_level: string;

    @IsString()
    acreage_level: string;

    @IsString()
    @IsOptional()
    commission: string;

    @IsString()
    @IsOptional()
    collaborator_id: string;

    @IsBoolean()
    @IsOptional()
    is_have_video: boolean;

    @IsString()
    @IsOptional()
    status: string;

    @IsString()
    @IsOptional()
    user_id: string;

    static getEnums() {
        return {
            title: 'Tiêu đề',
            price: 'Giá',
            body: 'Nội dung',
            acreage: 'Diện tích',
            address: 'Địa chỉ',
            phone: 'SĐT liên hệ',
            account_phone: 'SĐT đăng tin'
        };
    }
}