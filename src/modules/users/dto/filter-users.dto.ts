import { IsUUID, IsString } from 'class-validator';

export class FilterUsersDto {
  @IsString()
  full_name?: string;
}
