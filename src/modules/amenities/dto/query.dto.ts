import { IsOptional, IsString } from "class-validator";
import { PageOptionsDto } from 'src/common/dtos/respones.dto';

export class QueryLandDto extends PageOptionsDto {
    @IsString()
    @IsOptional()
    district?: string = '';

    @IsString()
    @IsOptional()
    ward?: string = '';

    @IsString()
    @IsOptional()
    categoryId?: string = '';

    @IsString()
    @IsOptional()
    priceLevel?: string = '';

    @IsString()
    @IsOptional()
    acreageLevel?: string = '';

}
