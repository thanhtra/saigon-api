import { IsString, IsOptional, IsEnum, IsBoolean, Matches } from 'class-validator';
import { FieldCooperation } from 'src/common/helpers/enum';

export class CreateCollaboratorDto {
    @IsString()
    name: string;

    @IsString()
    @Matches(/^(84|0[3|5|7|8|9])[0-9]{8}$/, {
        message: 'Số điện thoại không hợp lệ',
    })
    phone: string;

    @IsOptional()
    @IsString()
    zalo?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    link_facebook?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    note?: string;

    @IsOptional()
    @IsEnum(FieldCooperation)
    field_cooperation?: FieldCooperation;

    @IsOptional()
    @IsBoolean()
    active?: boolean;
}
