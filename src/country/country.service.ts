import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import { CountryType } from './types/';

@Injectable()
export class CountryService {
  private readonly prefix: string = 'countries:';

  constructor(
    private prisma: PrismaService,
    private cache: RedisCacheService,
    private readonly configService: ConfigService,
  ) {}

  async getCountries(url: string): Promise<CountryType[]> {
    try {
      const cachedCountries: CountryType[] = await this.cache.get(
        `${this.prefix}${url}`,
      );

      if (cachedCountries) return cachedCountries;

      const countries: CountryType[] = await this.prisma.country.findMany();
      if (!countries) {
        throw new HttpException('No countries found', HttpStatus.NOT_FOUND);
      }

      await this.cache.set(
        `${this.prefix}${url}`,
        countries,
        this.configService.get('CACHE_TTL'),
      );

      return countries;
    } catch (error) {
      throw error;
    }
  }

  async getCountriesById(countryId: string, url: string): Promise<CountryType> {
    try {
      const cachedCountry: CountryType = await this.cache.get(
        `${this.prefix}${url}`,
      );

      if (cachedCountry) return cachedCountry;

      const country: CountryType = await this.prisma.country.findFirst({
        where: {
          id: countryId,
        },
      });
      if (!country) {
        throw new HttpException('No countries found', HttpStatus.NOT_FOUND);
      }

      await this.cache.set(
        `${this.prefix}${url}`,
        country,
        this.configService.get('CACHE_TTL'),
      );

      return country;
    } catch (error) {
      throw error;
    }
  }
}
