import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreateHouseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  country_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  type_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  zipcode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

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

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  latitude: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  longitude: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  map: string;

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

  constructor(partial: Partial<CreateHouseDto>) {
    Object.assign(this, partial);
  }
}
