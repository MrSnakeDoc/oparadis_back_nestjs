import { AnimalType } from './../../animal/types/';
import { HouseType } from 'src/house/types';
import { PlantType } from 'src/plant/types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UserType {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firstname?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastname?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pseudo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone_number?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;

  @IsOptional()
  @IsString()
  refresh_token?: string;

  @ApiPropertyOptional()
  @IsOptional()
  house?: HouseType;

  @ApiPropertyOptional()
  @IsOptional()
  animals?: AnimalType[];

  @ApiPropertyOptional()
  @IsOptional()
  plants?: PlantType[];

  constructor(partial: Partial<UserType>) {
    Object.assign(this, partial);
  }
}
