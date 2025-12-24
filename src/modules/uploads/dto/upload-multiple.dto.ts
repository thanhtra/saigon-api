// dto/upload-multiple.dto.ts
import { IsOptional, IsUUID } from 'class-validator';

export class UploadMultipleDto {
    @IsOptional()
    @IsUUID()
    rental_id?: string;

    @IsOptional()
    @IsUUID()
    room_id?: string;

    @IsOptional()
    @IsUUID()
    contract_id?: string;
}
