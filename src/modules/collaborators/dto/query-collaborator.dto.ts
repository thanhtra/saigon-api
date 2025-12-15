import { IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';
import { PageOptionsDto } from 'src/common/dtos/respones.dto';
import { FieldCooperation } from 'src/common/helpers/enum';

export class QueryCollaboratorDto extends PageOptionsDto {
    @IsString()
    @IsOptional()
    name?: string = '';

    @IsString()
    @IsOptional()
    phone?: string = '';

    @IsString()
    @IsOptional()
    address?: string = '';

    @IsEnum(FieldCooperation)
    @IsOptional()
    field_cooperation?: FieldCooperation;
}
