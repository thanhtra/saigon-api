import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateAmenityDto {
    @IsString()
    name: string;

    @IsBoolean()
    @IsOptional()
    active?: boolean;
}
