import { IsString, IsOptional } from 'class-validator';

export class UpdatePlantDto {
  @IsOptional()
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  photo?: string;

  constructor(partial: Partial<UpdatePlantDto>) {
    Object.assign(this, partial);
  }
}
