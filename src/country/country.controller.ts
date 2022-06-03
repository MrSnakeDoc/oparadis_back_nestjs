import { CountryService } from './country.service';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('countries')
export class CountryController {
  constructor(private CountryService: CountryService) {}

  @Get()
  getCountries() {
    return this.CountryService.getCountries();
  }

  @Get(':id')
  getCountriesById(@Param('id') countryId: string) {
    return this.CountryService.getCountriesById(countryId);
  }
}
