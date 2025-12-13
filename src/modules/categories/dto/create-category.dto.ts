import {
    IsBoolean,
    IsOptional,
    IsString
} from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    name: string;

    @IsString()
    type: string;

    @IsOptional()
    @IsBoolean()
    active?: boolean;

    @IsOptional()
    @IsString()
    description?: string;

    static getEnums() {
        return {
            name: 'Tên loại',
            type: 'Menu',
            description: 'Mô tả loại',
        };
    }
}
