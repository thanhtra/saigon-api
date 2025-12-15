import { IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from 'src/common/dtos/respones.dto';

export class QueryContractDto extends PageOptionsDto {
    @IsString()
    @IsOptional()
    rental_id?: string;

    @IsString()
    @IsOptional()
    room_id?: string;

    @IsString()
    @IsOptional()
    tenant_id?: string;
}
