import {
  IsEnum,
  IsOptional,
} from 'class-validator';
import { PageOptionsDto } from 'src/common/dtos/respones.dto';
import { UserRole } from 'src/common/helpers/enum';

export class FilterUsersDto extends PageOptionsDto {
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}