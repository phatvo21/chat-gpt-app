import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'example@gmail.com' })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'test123' })
  password: string;
}
