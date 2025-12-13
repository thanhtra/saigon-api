import {
    IsBoolean,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateDiscoveryDto {
    @IsString()
    title: string;

    @IsString()
    brief_description: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsOptional()
    @IsString()
    district: string;

    @IsOptional()
    @IsString()
    image: string;

    @IsOptional()
    @IsBoolean()
    active: boolean;

    @IsString()
    category_id: string;


    static getEnums() {
        return {
            title: 'Tiêu đề',
            active: 'Trạng thái'
        };
    }
}