import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class MatchDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  absence_id: string;

  constructor(partial: Partial<MatchDto>) {
    Object.assign(this, partial);
  }
}
