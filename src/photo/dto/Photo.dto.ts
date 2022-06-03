import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PhotoDto {
  @IsNotEmpty()
  @IsString()
  photo: string;

  constructor(partial: Partial<PhotoDto>) {
    Object.assign(this, partial);
  }
}
