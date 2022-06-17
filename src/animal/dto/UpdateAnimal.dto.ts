import { IsString, IsOptional } from 'class-validator';

export class UpdateAnimalDto {
  @IsOptional()
  @IsString()
  type?: string;

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

  constructor(partial: Partial<UpdateAnimalDto>) {
    Object.assign(this, partial);
  }
}
