import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class BaseQuery {
  @IsOptional()
  @ApiProperty({ example: 1 })
  page: any;

  @IsOptional()
  @ApiProperty({ example: 20 })
  size: any;
}
