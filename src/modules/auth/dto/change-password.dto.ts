
import {
    IsString, Matches, MaxLength, MinLength
} from 'class-validator';

export class ChangePassworDto {
    @IsString()
    @MinLength(6)
    @MaxLength(32)
    old_password: string;

    @IsString()
    @MinLength(6)
    @MaxLength(32)
    new_password: string;
}
