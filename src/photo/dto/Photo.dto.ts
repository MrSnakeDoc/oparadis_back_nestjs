import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PhotoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  photo: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  main_photo?: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  house_id: string;

  constructor(partial: Partial<PhotoDto>) {
    Object.assign(this, partial);
  }
}
