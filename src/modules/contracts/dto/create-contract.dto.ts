import { IsString, IsNumber, IsOptional, IsDate } from 'class-validator';

export class CreateContractDto {
    @IsString()
    rental_id: string;

    @IsString()
    @IsOptional()
    room_id?: string;

    @IsString()
    tenant_id: string;

    @IsDate()
    start_date: Date;

    @IsDate()
    @IsOptional()
    end_date?: Date;

    @IsNumber()
    rent_price: number;

    @IsNumber()
    deposit: number;

    @IsString()
    @IsOptional()
    sale_id?: string;

    @IsString()
    @IsOptional()
    collaborator_id?: string;

    @IsNumber()
    @IsOptional()
    commission_amount?: number;
}
