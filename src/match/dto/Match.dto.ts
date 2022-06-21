import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class MatchDto {
  @IsOptional()
  @IsBoolean()
  validated?: boolean;

  @IsOptional()
  @IsString()
  sitter_id?: string;

  constructor(partial: Partial<MatchDto>) {
    Object.assign(this, partial);
  }
}
