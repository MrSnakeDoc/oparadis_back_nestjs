import { IsString, IsOptional } from 'class-validator';

export class UpdatePhotoDto {
  @IsOptional()
  @IsString()
  photo?: string;

  constructor(partial: Partial<UpdatePhotoDto>) {
    Object.assign(this, partial);
  }
}
