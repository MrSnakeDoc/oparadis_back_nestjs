import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CountryType {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  country: string;
}
