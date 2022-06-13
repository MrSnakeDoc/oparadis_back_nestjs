import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PhotoDto {
  @IsNotEmpty()
  @IsString()
  photo: string;

  @IsOptional()
  @IsBoolean()
  main_photo?: boolean;

  @IsNotEmpty()
  @IsString()
  house_id: string;

  constructor(partial: Partial<PhotoDto>) {
    Object.assign(this, partial);
  }
}
