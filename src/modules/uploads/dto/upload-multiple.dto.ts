import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { UploadDomain } from 'src/common/helpers/enum';

export class UploadMultipleDto {
    @IsEnum(UploadDomain)
    domain: UploadDomain;

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
