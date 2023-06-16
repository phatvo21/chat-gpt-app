import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class BaseEntityDto {
  @ApiProperty({ example: 'A12d3a456426614174000' })
  @ApiProperty({ readOnly: true })
  @IsOptional()
  _id: string;

  @ApiProperty({ readOnly: true })
  @IsOptional()
  createdAt: Date;

  @ApiProperty({ readOnly: true })
  @IsOptional()
  updatedAt: Date;
}
