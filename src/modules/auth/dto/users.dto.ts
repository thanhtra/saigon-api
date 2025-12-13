
import {
    IsString, Matches, MaxLength, MinLength
} from 'class-validator';

export class LoginDto {
    @IsString()
    userName: string;

    @IsString()
    @MinLength(6)
    @MaxLength(32)
    password: string;
}
