import { IsNotEmpty, IsString } from 'class-validator';

export class PhotoDto {
  @IsNotEmpty()
  @IsString()
  photo: string;

  constructor(partial: Partial<PhotoDto>) {
    Object.assign(this, partial);
  }
}
