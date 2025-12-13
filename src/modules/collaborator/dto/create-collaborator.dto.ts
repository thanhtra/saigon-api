import {
    IsBoolean,
    IsOptional,
    IsString, Matches
} from 'class-validator';

export class CreateCollaboratorDto {
    @IsString()
    name: string;

    @IsString()
    @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
        message: 'Number phone is wrong',
    })
    phone: string;

    @IsString()
    @IsOptional()
    zalo: string;

    @IsString()
    @IsOptional()
    link_facebook: string;

    @IsString()
    @IsOptional()
    address: string;

    @IsString()
    @IsOptional()
    age: string;

    @IsString()
    @IsOptional()
    gender: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsString()
    @IsOptional()
    field_cooperation: string;

    @IsString()
    @IsOptional()
    position: string;

    @IsString()
    @IsOptional()
    avatar: string;

    @IsBoolean()
    @IsOptional()
    active: boolean;

    static getEnums() {
        return {
            name: 'Tên',
            phone: 'Số điện thoại',
            field_cooperation: 'Lĩnh vực hợp tác'
        };
    }
}
