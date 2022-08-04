import { CountryService } from './country.service';
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CountryType } from './types';

@ApiBearerAuth()
@ApiTags('countries')
@UseGuards(JwtGuard)
@Controller('countries')
export class CountryController {
  constructor(private CountryService: CountryService) {}

  @Get()
  getCountries(@Req() req: Request): Promise<CountryType[]> {
    return this.CountryService.getCountries(req.url);
  }

  @Get(':id')
  getCountriesById(
    @Param('id') countryId: string,
    @Req() req: Request,
  ): Promise<CountryType> {
    return this.CountryService.getCountriesById(countryId, req.url);
  }
}
