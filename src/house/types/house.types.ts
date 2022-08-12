import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  IsObject,
  IsDate,
} from 'class-validator';
import { AnimalType } from 'src/animal/types/';
import { CountryType } from 'src/country/types';
import { PlantType } from 'src/plant/types';
import { Type } from 'src/type/types';
import { PhotoDto } from '../../photo/dto/Photo.dto';
export class HouseType {
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
  @IsNumber()
  latitude: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  longitude: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  user_id: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  photo?: PhotoDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  animals?: AnimalType[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  plants?: PlantType[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  type?: Type;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  country?: CountryType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  created_at?: Date | string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  updated_at?: Date | string;
}
