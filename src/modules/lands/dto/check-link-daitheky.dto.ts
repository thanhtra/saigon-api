import {
    IsNotEmpty,
    IsString
} from 'class-validator';

export class CheckLinkDaithekyDto {

    @IsString()
    @IsNotEmpty()
    link: string;

}
