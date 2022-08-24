import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAbsenceDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  start_date: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  end_date: Date;

  constructor(partial: Partial<CreateAbsenceDto>) {
    Object.assign(this, partial);
  }
}
