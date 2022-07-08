import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import { Type } from './types';

@Injectable()
export class TypeService {
  private readonly prefix: string = 'types:';

  constructor(
    private prisma: PrismaService,
    private cache: RedisCacheService,
    private readonly configService: ConfigService,
  ) {}

  async getTypes(url: string): Promise<Type[]> {
    try {
      const cachedTypes: Type[] = await this.cache.get(`${this.prefix}${url}`);

      if (cachedTypes) return cachedTypes;

      const types: Type[] = await this.prisma.type.findMany();
      if (!types) {
        throw new HttpException('No types found', HttpStatus.NOT_FOUND);
      }

      await this.cache.set(
        `${this.prefix}${url}`,
        types,
        this.configService.get('CACHE_TTL'),
      );

      return types;
    } catch (error) {
      throw error;
    }
  }

  async getTypesById(typeId: string, url: string): Promise<Type> {
    try {
      const cachedType: Type = await this.cache.get(`${this.prefix}${url}`);

      if (cachedType) return cachedType;

      const type: Type = await this.prisma.type.findFirst({
        where: {
          id: typeId,
        },
      });
      if (!type) {
        throw new HttpException('No countries found', HttpStatus.NOT_FOUND);
      }

      await this.cache.set(
        `${this.prefix}${url}`,
        type,
        this.configService.get('CACHE_TTL'),
      );

      return type;
    } catch (error) {
      throw error;
    }
  }
}
