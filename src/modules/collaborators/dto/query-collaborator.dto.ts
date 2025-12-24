import { IsEnum, IsOptional } from 'class-validator';
import { PageOptionsDto } from 'src/common/dtos/respones.dto';
import { FieldCooperation } from 'src/common/helpers/enum';

export class QueryCollaboratorDto extends PageOptionsDto {
    @IsEnum(FieldCooperation)
    @IsOptional()
    field_cooperation?: FieldCooperation;
}
