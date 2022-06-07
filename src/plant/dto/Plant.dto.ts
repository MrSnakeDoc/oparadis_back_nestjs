import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class PlantDto {
  @IsNotEmpty()
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  photo?: string;

  constructor(partial: Partial<PlantDto>) {
    Object.assign(this, partial);
  }
}
