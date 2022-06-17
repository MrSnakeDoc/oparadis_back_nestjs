import { Exclude } from 'class-transformer';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UserType {
  email?: string;

  password?: string;

  firstname?: string;

  lastname?: string;

  pseudo?: string;

  phone_number?: string;

  avatar?: string;

  isAdmin?: boolean;

  refresh_token?: string;

  constructor(partial: Partial<UserType>) {
    Object.assign(this, partial);
  }
}
