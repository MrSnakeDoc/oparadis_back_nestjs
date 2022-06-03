import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreateHouseDto {
  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  country_id: string;

  @IsNotEmpty()
  @IsString()
  type_id: string;

  @IsNotEmpty()
  @IsString()
  zipcode: string;

  @IsNotEmpty()
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

  @IsNotEmpty()
  @IsString()
  latitude: string;

  @IsNotEmpty()
  @IsString()
  longitude: string;

  @IsNotEmpty()
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

  constructor(partial: Partial<CreateHouseDto>) {
    Object.assign(this, partial);
  }
}
