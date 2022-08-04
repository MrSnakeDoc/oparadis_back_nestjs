import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class UpdateHouseDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  country_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  type_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  zipcode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  rooms?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  bedrooms?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  surface?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  area?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  floor?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  latitude?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  longitude?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  map?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  internet?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  washing_machine?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  TV?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hoven?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  microwave?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  dishwasher?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  bathtub?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  shower?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  parking?: boolean;

  constructor(partial: Partial<UpdateHouseDto>) {
    Object.assign(this, partial);
  }
}
