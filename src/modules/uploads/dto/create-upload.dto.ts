import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { UploadDomain, FileType } from 'src/common/helpers/enum';

export class CreateUploadDto {
    @IsEnum(FileType)
    file_type: FileType;

    @IsEnum(UploadDomain)
    domain: UploadDomain;

    @IsString()
    file_path: string;

    @IsOptional()
    @IsUUID()
    room_id?: string;

    @IsOptional()
    @IsUUID()
    real_estate_id?: string;

    @IsOptional()
    @IsUUID()
    contract_id?: string;
}
