import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class AnimalDto {
  @IsNotEmpty()
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  diseases?: string;

  @IsOptional()
  @IsString()
  race?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsString()
  description?: string;

  constructor(partial: Partial<AnimalDto>) {
    Object.assign(this, partial);
  }
}
