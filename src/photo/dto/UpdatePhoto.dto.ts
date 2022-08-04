import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdatePhotoDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  photo?: string;

  constructor(partial: Partial<UpdatePhotoDto>) {
    Object.assign(this, partial);
  }
}
