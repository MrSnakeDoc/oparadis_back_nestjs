import { Exclude } from 'class-transformer';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class ShowUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @Exclude()
  @IsOptional()
  private password?: string;

  @IsOptional()
  @IsString()
  firstname?: string;

  @IsOptional()
  @IsString()
  lastname?: string;

  @IsOptional()
  @IsString()
  pseudo?: string;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsBoolean()
  private isAdmin?: boolean;

  @Exclude()
  @IsOptional()
  private refresh_token?: string;

  constructor(partial: Partial<ShowUserDto>) {
    Object.assign(this, partial);
  }
}
