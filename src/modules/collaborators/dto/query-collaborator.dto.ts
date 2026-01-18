import { IsEnum, IsOptional } from 'class-validator';
import { PageOptionsDto } from 'src/common/dtos/respones.dto';
import { CollaboratorType, FieldCooperation } from 'src/common/helpers/enum';

export class QueryCollaboratorDto extends PageOptionsDto {
    @IsOptional()
    @IsEnum(CollaboratorType)
    type?: CollaboratorType;

    @IsOptional()
    @IsEnum(FieldCooperation)
    field_cooperation?: FieldCooperation;
}
