
import {
    IsBoolean,
    IsNumber,
    IsOptional,
    IsString
} from 'class-validator';

export class CreateProductDto {
    @IsString()
    name: string;

    @IsString()
    category_id: string;

    @IsNumber()
    @IsOptional()
    price_from: number;

    @IsString()
    packs: string;

    @IsString()
    @IsOptional()
    image: string;

    @IsString()
    @IsOptional()
    brief_description: string

    @IsString()
    @IsOptional()
    description: string;

    @IsString()
    @IsOptional()
    note: string;

    @IsString()
    @IsOptional()
    collaborator_id: string;

    @IsString()
    @IsOptional()
    user_id: string;

    @IsString()
    @IsOptional()
    status: string;

    @IsBoolean()
    @IsOptional()
    active: boolean;

    @IsString()
    @IsOptional()
    status_post: string;

    @IsBoolean()
    @IsOptional()
    is_have_video: boolean;


    static getEnums() {
        return {
            name: 'Tên sản phẩm',
            price_from: 'Giá từ',
            status: 'Trạng thái',
            active: 'Đang kích hoạt',
        };
    }
}
