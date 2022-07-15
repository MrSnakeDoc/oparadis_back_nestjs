import { IsNotEmpty, IsString } from 'class-validator';

export class MatchDto {
  @IsNotEmpty()
  @IsString()
  absence_id: string;

  constructor(partial: Partial<MatchDto>) {
    Object.assign(this, partial);
  }
}
