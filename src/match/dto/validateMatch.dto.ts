import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class ValidateMatchDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  validated?: boolean;

  constructor(partial: Partial<ValidateMatchDto>) {
    Object.assign(this, partial);
  }
}
