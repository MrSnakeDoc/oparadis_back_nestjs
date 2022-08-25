import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AbsenceDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  start_date: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  end_date: Date;

  constructor(partial: Partial<AbsenceDto>) {
    Object.assign(this, partial);
  }
}
