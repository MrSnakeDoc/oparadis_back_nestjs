import { IsString, IsOptional } from 'class-validator';

export class UpdateAbsenceDto {
  @IsOptional()
  @IsString()
  start_date?: Date;

  @IsOptional()
  @IsString()
  end_date?: Date;

  constructor(partial: Partial<UpdateAbsenceDto>) {
    Object.assign(this, partial);
  }
}
