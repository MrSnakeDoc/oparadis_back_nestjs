import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AnimalType } from 'src/animal/types';
import { HouseType } from 'src/house/types';
import { PlantType } from 'src/plant/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';

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
}
