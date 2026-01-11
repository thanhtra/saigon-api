import { Transform } from "class-transformer";
import { IsBoolean, IsOptional, IsUUID } from "class-validator";

export class GetRentalsByCollaboratorDto {
    @IsUUID()
    collaborator_id: string;

    @IsOptional()
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    active?: boolean;
}
