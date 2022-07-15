import { IsBoolean, IsOptional } from 'class-validator';

export class ValidateMatchDto {
  @IsOptional()
  @IsBoolean()
  validated?: boolean;

  constructor(partial: Partial<ValidateMatchDto>) {
    Object.assign(this, partial);
  }
}
