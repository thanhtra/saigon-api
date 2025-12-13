import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { PageOptionsDto } from 'src/common/dtos/respones.dto';

export class QueryDiscoveryDto extends PageOptionsDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    categoryId?: string = '';

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    district?: string = '';
}
