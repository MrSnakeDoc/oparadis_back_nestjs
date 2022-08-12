import { CountryService } from './country.service';
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CountryType } from './types';

@ApiBearerAuth()
@ApiTags('countries')
@UseGuards(JwtGuard)
@Controller('countries')
export class CountryController {
  constructor(private CountryService: CountryService) {}

  @ApiOkResponse({
    description: 'Retreive all countries.',
    type: CountryType,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Get all countries',
    description: 'Get all countries',
  })
  @Get()
  getCountries(@Req() req: Request): Promise<CountryType[]> {
    return this.CountryService.getCountries(req.url);
  }

  @ApiOkResponse({
    description: 'Retreive a country by id.',
    type: CountryType,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Get a country by id',
    description: 'Get a country by id',
  })
  @Get(':id')
  getCountriesById(
    @Param('id') countryId: string,
    @Req() req: Request,
  ): Promise<CountryType> {
    return this.CountryService.getCountriesById(countryId, req.url);
  }
}
