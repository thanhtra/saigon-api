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
    rental_id?: string;

    @IsOptional()
    room_id?: string;

    @IsOptional()
    contract_id?: string;
}
