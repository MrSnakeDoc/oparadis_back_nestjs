import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateAbsenceDto } from './';

export class AbsenceDto extends CreateAbsenceDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  user_id?: string;

  constructor(
    partial: Partial<AbsenceDto>,
    CreateAbsenceDto: CreateAbsenceDto,
  ) {
    super(CreateAbsenceDto);
    Object.assign(this, partial);
  }
}
