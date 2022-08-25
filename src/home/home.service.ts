import * as dayjs from 'dayjs';
dayjs().format();
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AnimalType } from '../animal/types';
import { HouseType } from '../house/types';
import { PlantType } from '../plant/types';
import { PrismaService } from '../prisma/prisma.service';
import { RedisCacheService } from '../redis-cache/redis-cache.service';

@Injectable()
export class HomeService {
  private readonly prefix: string = 'houses:';
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private cache: RedisCacheService,
  ) {}

  async getFour(url: string): Promise<HouseType[]> {
    try {
      const cachedHouses = await this.cache.get(`${this.prefix}${url}`);

      if (cachedHouses) return cachedHouses;

      const houses: HouseType[] = await this.prisma.house.findMany({
        include: {
          photo: true,
          type: true,
          country: true,
        },
        orderBy: [
          {
            created_at: 'desc',
          },
        ],
      });

      if (!houses) {
        throw new HttpException('No houses found', HttpStatus.NOT_FOUND);
      }

      houses.forEach((house) => {
        house.created_at = dayjs(house.created_at).format('DD MMM YYYY');
      });

      const animals: AnimalType[] = await this.prisma.animal.findMany();
      const plants: PlantType[] = await this.prisma.plant.findMany();

      const housesFull = houses.map((house) => {
        return {
          ...house,
          animals: animals.filter((animal) => animal.user_id === house.user_id),
          plants: plants.filter((plant) => plant.user_id === house.user_id),
        };
      });

      const four = housesFull.slice(0, 4);

      await this.cache.set(
        `${this.prefix}${url}`,
        four,
        this.config.get('CACHE_TTL'),
      );

      return four;
    } catch (error) {
      throw error;
    }
  }

  async getHouses(url: string): Promise<HouseType[]> {
    try {
      const cachedHouses = await this.cache.get(`${this.prefix}${url}`);

      if (cachedHouses) return cachedHouses;

      const houses: HouseType[] = await this.prisma.house.findMany({
        include: {
          photo: true,
          type: true,
          country: true,
        },
        orderBy: [
          {
            created_at: 'desc',
          },
        ],
      });

      if (!houses) {
        throw new HttpException('No houses found', HttpStatus.NOT_FOUND);
      }

      await this.cache.set(
        `${this.prefix}${url}`,
        houses,
        this.config.get('CACHE_TTL'),
      );

      return houses;
    } catch (error) {
      throw error;
    }
  }

  async getHouseFullById(id: string, url: string): Promise<HouseType> {
    try {
      const cachedHouse = await this.cache.get(`${this.prefix}${url}`);

      if (cachedHouse) return cachedHouse;

      const house: HouseType = await this.prisma.house.findFirst({
        where: { id },
        include: {
          photo: true,
          type: true,
          country: true,
        },
      });

      if (!house) {
        throw new HttpException('No houses found', HttpStatus.NOT_FOUND);
      }
      const animals: AnimalType[] = await this.prisma.animal.findMany({
        where: { user_id: house.user_id },
      });
      const plants: PlantType[] = await this.prisma.plant.findMany({
        where: { user_id: house.user_id },
      });

      const fullHouse = {
        ...house,
        animals: animals,
        plants: plants,
      };

      await this.cache.set(
        `${this.prefix}${url}`,
        fullHouse,
        this.config.get('CACHE_TTL'),
      );

      return fullHouse;
    } catch (error) {
      throw error;
    }
  }
}
