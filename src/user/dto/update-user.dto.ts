import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiHideProperty()
  @Exclude()
  @IsOptional()
  private password?: string;

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

  @ApiHideProperty()
  @Exclude()
  @IsOptional()
  @IsBoolean()
  private isAdmin?: boolean;

  @ApiHideProperty()
  @Exclude()
  @IsOptional()
  private refresh_token?: string;

  constructor(partial: Partial<UpdateUserDto>) {
    Object.assign(this, partial);
  }
}
