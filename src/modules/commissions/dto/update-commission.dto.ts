import { IsOptional, IsNumber, IsEnum } from 'class-validator';
import { CommissionStatus } from 'src/common/helpers/enum';

export class UpdateCommissionDto {
    @IsOptional()
    @IsNumber()
    amount?: number;

    @IsOptional()
    @IsEnum(CommissionStatus)
    status?: CommissionStatus;
}
