import { HouseType } from './types/house.types';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHouseDto, UpdateHouseDto } from './dto';
import { AnimalType } from 'src/animal/types/';
import { PlantType } from 'src/plant/types';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';

@Injectable()
export class HouseService {
  private readonly prefix: string = 'houses:';
  constructor(
    private prisma: PrismaService,
    private cache: RedisCacheService,
  ) {}

  async getHouses(url: string): Promise<HouseType[]> {
    try {
      const cachedHouses = await this.cache.get(`${this.prefix}${url}`);

      if (cachedHouses) return cachedHouses;

      const houses: HouseType[] = await this.prisma.house.findMany();

      if (!houses) {
        throw new HttpException('No houses found', HttpStatus.NOT_FOUND);
      }

      await this.cache.set(`${this.prefix}${url}`, houses);

      return houses;
    } catch (error) {
      throw error;
    }
  }

  async getHousesFull(url: string): Promise<HouseType[]> {
    try {
      const cachedHouses = await this.cache.get(`${this.prefix}${url}`);

      if (cachedHouses) return cachedHouses;

      const houses: HouseType[] = await this.prisma.house.findMany({
        include: {
          photo: true,
        },
      });

      if (!houses) {
        throw new HttpException('No houses found', HttpStatus.NOT_FOUND);
      }
      const animals: AnimalType[] = await this.prisma.animal.findMany();
      const plants: PlantType[] = await this.prisma.plant.findMany();

      const fullHouses = houses.map((house) => {
        return {
          ...house,
          animals: animals.filter((animal) => animal.user_id === house.user_id),
          plants: plants.filter((plant) => plant.user_id === house.user_id),
        };
      });

      await this.cache.set(`${this.prefix}${url}`, fullHouses);

      return fullHouses;
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

      await this.cache.set(`${this.prefix}${url}`, fullHouse);

      return fullHouse;
    } catch (error) {
      throw error;
    }
  }

  async getFour(url: string): Promise<HouseType[]> {
    try {
      const cachedHouses = await this.cache.get(`${this.prefix}${url}`);

      if (cachedHouses) return cachedHouses;

      const houses: HouseType[] = await this.prisma.house.findMany({
        include: {
          photo: true,
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

      await this.cache.set(`${this.prefix}getFour`, four);

      return four;
    } catch (error) {
      throw error;
    }
  }

  async getHouseById(id: string, url: string): Promise<HouseType> {
    try {
      const cachedHouse = await this.cache.get(`${this.prefix}${url}`);

      if (cachedHouse) return cachedHouse;

      const house = this.prisma.house.findFirst({ where: { id } });
      if (!house) {
        throw new HttpException('House not found', HttpStatus.NOT_FOUND);
      }

      await this.cache.set(`${this.prefix}gethouse`, house);

      return house;
    } catch (error) {
      throw error;
    }
  }

  async createHouse(userId: string, dto: CreateHouseDto): Promise<HouseType> {
    try {
      const house = await this.prisma.house.create({
        data: { ...dto, user_id: userId },
      });

      await this.cache.del(`${this.prefix}`);

      return house;
    } catch (error) {
      throw error;
    }
  }

  async updateHouse(userId, houseId, dto: UpdateHouseDto): Promise<HouseType> {
    try {
      const house: HouseType = await this.prisma.house.findUnique({
        where: { id: houseId },
      });

      if (!house || house.user_id !== userId) {
        throw new ForbiddenException('Access to ressources denied');
      }

      await this.cache.del(`${this.prefix}`);

      return this.prisma.house.update({
        where: { id: houseId },
        data: { ...dto },
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteHouse(userId: string, houseId: string) {
    try {
      const house: HouseType = await this.prisma.house.findUnique({
        where: { id: houseId },
      });

      if (!house || house.user_id !== userId) {
        throw new ForbiddenException('Access to ressources denied');
      }

      await this.cache.del(`${this.prefix}`);

      await this.prisma.house.delete({
        where: { id: houseId },
      });

      return HttpStatus.OK;
    } catch (error) {
      throw error;
    }
  }
}
