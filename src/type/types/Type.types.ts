import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class Type {
  @ApiProperty()
  @IsOptional()
  @IsString()
  type?: string;
}
