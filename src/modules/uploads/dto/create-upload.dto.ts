import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum FileType {
    Image = 'image',
    Video = 'video',
}

export enum DomainType {
    Rental = 'rental',
    RealEstate = 'real_estate'
}

export class CreateUploadDto {
    @IsEnum(FileType)
    file_type: string;

    @IsEnum(DomainType)
    domain: string;

    @IsString()
    file_path: string;

    @IsOptional()
    room_id?: string;

    @IsOptional()
    real_estate_id?: string;

    @IsOptional()
    contract_id?: string;
}