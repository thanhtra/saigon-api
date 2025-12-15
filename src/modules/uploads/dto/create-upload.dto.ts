// create-upload.dto.ts
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum FileType {
    Image = 'image',
    Video = 'video',
}

export class CreateUploadDto {
    @IsString()
    file_url: string;

    @IsEnum(FileType)
    file_type: FileType;

    @IsOptional()
    @IsString()
    rental_id?: string;

    @IsOptional()
    @IsString()
    room_id?: string;

    @IsOptional()
    @IsString()
    contract_id?: string;
}