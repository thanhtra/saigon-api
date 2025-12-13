import { IsOptional, IsString } from "class-validator";
import { PageOptionsDto } from 'src/common/dtos/respones.dto';

export class MyPostsDto extends PageOptionsDto {

    @IsString()
    @IsOptional()
    status_post: string = '';
}
