
import {
    IsString, Matches, MaxLength, MinLength
} from 'class-validator';

export class UpdatePassworDto {
    @IsString()
    @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
        message: 'Số điện thoại không đúng'
    })
    phone: string;

    @IsString()
    @MinLength(6)
    @MaxLength(32)
    password: string;
}
