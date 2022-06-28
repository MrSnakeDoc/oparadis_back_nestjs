import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AbsenceType } from '../../absence/types/AbsenceType.types';

export class MatchFullDto {
  @IsOptional()
  @IsBoolean()
  validated?: boolean;

  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  absence_id: string;

  @IsOptional()
  absence?: AbsenceType;

  constructor(partial: Partial<MatchFullDto>) {
    Object.assign(this, partial);
  }
}
