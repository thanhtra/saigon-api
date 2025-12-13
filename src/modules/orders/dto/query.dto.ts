import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { PageOptionsDto } from 'src/common/dtos/respones.dto';

export class QueryOrderDto extends PageOptionsDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    userId: string = '';

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    status: string = '';
}
