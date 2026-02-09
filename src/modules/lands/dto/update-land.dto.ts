import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { CreateLandDto } from './create-land.dto';

export class UpdateLandDto extends PartialType(CreateLandDto) {
    @IsOptional()
    @IsString()
    cover_upload_id?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    upload_ids?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    delete_upload_ids?: string[];

    @IsOptional()
    @IsString()
    ctv_collaborator_id?: string;
}
