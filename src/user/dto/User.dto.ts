import { Exclude } from 'class-transformer';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @Exclude()
  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  firstname?: string;

  @IsString()
  @IsOptional()
  lastname?: string;

  @IsString()
  @IsOptional()
  pseudo?: string;

  @IsString()
  @IsOptional()
  phone_number?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;

  @Exclude()
  @IsString()
  @IsOptional()
  refresh_token?: string;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
