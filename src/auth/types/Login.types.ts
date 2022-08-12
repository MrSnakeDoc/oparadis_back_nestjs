import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginType {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  accessToken: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
