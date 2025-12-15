// create-commission.dto.ts
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCommissionDto {
    @IsString()
    contract_id: string;

    @IsString()
    @IsOptional()
    sale_id?: string;

    @IsString()
    @IsOptional()
    collaborator_id?: string;

    @IsNumber()
    amount: number;
}