import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AbsenceType } from '../../absence/types/AbsenceType.types';

export class MatchFullDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  validated?: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  absence_id: string;

  @ApiPropertyOptional()
  @IsOptional()
  absence?: AbsenceType;

  constructor(partial: Partial<MatchFullDto>) {
    Object.assign(this, partial);
  }
}
