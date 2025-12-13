import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AutologinDto {
  @IsString()
  @ApiProperty({
    description: 'The magicToken (JWT token)',
  })
  magicToken: string;
}
