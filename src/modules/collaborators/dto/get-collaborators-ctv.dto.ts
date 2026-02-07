import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CollaboratorType, FieldCooperation } from 'src/common/helpers/enum';

export class GetCollaboratorsCtvDto {
    @IsOptional()
    @IsEnum(CollaboratorType)
    type?: CollaboratorType;

    @IsOptional()
    @IsEnum(FieldCooperation)
    field_cooperation?: FieldCooperation;

    @IsOptional()
    @IsString()
    keyword?: string;
}