import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MatchDto {
  @IsOptional()
  @IsBoolean()
  validated?: boolean;

  @IsNotEmpty()
  @IsString()
  absence_id: string;

  constructor(partial: Partial<MatchDto>) {
    Object.assign(this, partial);
  }
}
