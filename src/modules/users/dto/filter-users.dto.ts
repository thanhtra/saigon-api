import { IsUUID, IsString } from 'class-validator';

export class FilterUsersDto {
  @IsString()
  name?: string;
}
