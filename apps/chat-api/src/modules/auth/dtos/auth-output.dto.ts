import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthOutputDto {
  @IsString()
  @ApiProperty({ example: 'refresh-token' })
  refreshToken: string;

  @IsString()
  @ApiProperty({ example: 'access-token' })
  token: string;
}
