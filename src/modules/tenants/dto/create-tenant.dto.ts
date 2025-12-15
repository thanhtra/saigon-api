// dto/create-tenant.dto.ts
import {
    IsOptional,
    IsString,
    Matches,
} from 'class-validator';

export class CreateTenantDto {
    @IsString()
    name: string;

    @IsString()
    @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
        message: 'Số điện thoại không hợp lệ',
    })
    phone: string;

    @IsString()
    @IsOptional()
    cccd?: string;

    @IsString()
    @IsOptional()
    note?: string;

    static getEnums() {
        return {
            name: 'Tên khách',
            phone: 'Số điện thoại',
            cccd: 'CCCD',
        };
    }
}
