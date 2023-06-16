import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class BaseQuery {
  @IsString()
  @ApiPropertyOptional()
  sortBy: string;

  @IsString()
  @ApiPropertyOptional()
  sortDirection: string;
}
