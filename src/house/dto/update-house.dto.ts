import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class UpdateHouseDto {
  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  country_id: string;

  @IsOptional()
  @IsString()
  type_id: string;

  @IsOptional()
  @IsString()
  zipcode: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsNumber()
  rooms?: number;

  @IsOptional()
  @IsNumber()
  bedrooms?: number;

  @IsOptional()
  @IsNumber()
  surface?: number;

  @IsOptional()
  @IsNumber()
  area?: number;

  @IsOptional()
  @IsNumber()
  floor?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  latitude: string;

  @IsOptional()
  @IsString()
  longitude: string;

  @IsOptional()
  @IsString()
  map: string;

  @IsOptional()
  @IsBoolean()
  internet?: boolean;

  @IsOptional()
  @IsBoolean()
  washing_machine?: boolean;

  @IsOptional()
  @IsBoolean()
  TV?: boolean;

  @IsOptional()
  @IsBoolean()
  hoven?: boolean;

  @IsOptional()
  @IsBoolean()
  microwave?: boolean;

  @IsOptional()
  @IsBoolean()
  dishwasher?: boolean;

  @IsOptional()
  @IsBoolean()
  bathtub?: boolean;

  @IsOptional()
  @IsBoolean()
  shower?: boolean;

  @IsOptional()
  @IsBoolean()
  parking?: boolean;

  constructor(partial: Partial<UpdateHouseDto>) {
    Object.assign(this, partial);
  }
}
