import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from 'src/common/dtos/respones.dto';
import { LandType } from 'src/common/helpers/enum';

export class QueryLandDto extends PageOptionsDto {
    @IsOptional()
    @IsEnum(LandType)
    land_type?: LandType;

    @IsOptional()
    @IsString()
    land_code?: string;
}
