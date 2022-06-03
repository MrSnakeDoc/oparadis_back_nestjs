import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CountryType } from './types/';

@Injectable()
export class CountryService {
  constructor(private prisma: PrismaService) {}

  async getCountries() {
    try {
      const countries: CountryType[] = await this.prisma.country.findMany();
      if (!countries) {
        throw new HttpException('No countries found', HttpStatus.NOT_FOUND);
      }
      return countries;
    } catch (error) {
      throw error;
    }
  }

  async getCountriesById(countryId: string) {
    try {
      const country: CountryType = await this.prisma.country.findFirst({
        where: {
          id: countryId,
        },
      });
      if (!country) {
        throw new HttpException('No countries found', HttpStatus.NOT_FOUND);
      }
      return country;
    } catch (error) {
      throw error;
    }
  }
}
