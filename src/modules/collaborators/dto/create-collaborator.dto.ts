import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CollaboratorType, FieldCooperation } from 'src/common/helpers/enum';

export class CreateCollaboratorDto {
    @IsString()
    @IsNotEmpty()
    user_id: string;

    @IsEnum(CollaboratorType)
    type: CollaboratorType;

    @IsEnum(FieldCooperation)
    field_cooperation: FieldCooperation;

    @IsOptional()
    @IsString()
    note?: string;

    @IsOptional()
    @Transform(({ value }) => value === true || value === 'true')
    @IsBoolean()
    active?: boolean;

    @IsOptional()
    @Transform(({ value }) => value === true || value === 'true')
    @IsBoolean()
    is_confirmed_ctv?: boolean;

}
