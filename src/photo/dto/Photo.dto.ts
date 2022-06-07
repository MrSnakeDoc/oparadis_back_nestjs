import { IsNotEmpty, IsString } from 'class-validator';

export class PhotoDto {
  @IsNotEmpty()
  @IsString()
  photo: string;

  @IsNotEmpty()
  @IsString()
  house_id: string;

  constructor(partial: Partial<PhotoDto>) {
    Object.assign(this, partial);
  }
}
