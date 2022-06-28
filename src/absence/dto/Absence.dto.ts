import { IsNotEmpty, IsString } from 'class-validator';

export class AbsenceDto {
  @IsNotEmpty()
  @IsString()
  start_date: Date;

  @IsNotEmpty()
  @IsString()
  end_date: Date;

  constructor(partial: Partial<AbsenceDto>) {
    Object.assign(this, partial);
  }
}
