import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateAbsenceDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  start_date?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  end_date?: Date;

  constructor(partial: Partial<UpdateAbsenceDto>) {
    Object.assign(this, partial);
  }
}
