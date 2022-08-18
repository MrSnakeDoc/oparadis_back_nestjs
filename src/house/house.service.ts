import { ConfigService } from '@nestjs/config';
import { HouseType } from './types/house.types';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHouseDto, UpdateHouseDto } from './dto';
import { AnimalType } from '../animal/types/';
import { PlantType } from '../plant/types';
import { RedisCacheService } from '../redis-cache/redis-cache.service';

@Injectable()
export class HouseService {
  private readonly prefix: string = 'houses:';
  constructor(
    private prisma: PrismaService,
    private cache: RedisCacheService,
    private readonly configService: ConfigService,
  ) {}

  async getHousesFull(url: string): Promise<HouseType[]> {
    try {
      const cachedHouses = await this.cache.get(`${this.prefix}${url}`);

      if (cachedHouses) return cachedHouses;

      const houses: HouseType[] = await this.prisma.house.findMany({
        include: {
          photo: true,
          type: true,
          country: true,
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

      await this.cache.set(
        `${this.prefix}${url}`,
        fullHouses,
        this.configService.get('CACHE_TTL'),
      );

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
        this.configService.get('CACHE_TTL'),
      );

      return fullHouse;
    } catch (error) {
      throw error;
    }
  }

  async getHouseById(id: string, url: string): Promise<HouseType> {
    try {
      const cachedHouse: HouseType = await this.cache.get(
        `${this.prefix}${url}`,
      );

      if (cachedHouse) return cachedHouse;

      const house: HouseType = await this.prisma.house.findUnique({
        where: {
          id,
        },
      });

      if (!house) {
        throw new HttpException('House not found', HttpStatus.NOT_FOUND);
      }

      await this.cache.set(
        `${this.prefix}${url}`,
        house,
        this.configService.get('CACHE_TTL'),
      );

      return house;
    } catch (error) {
      throw error;
    }
  }

  async createHouse(
    userId: string,
    dto: CreateHouseDto,
  ): Promise<CreateHouseDto> {
    try {
      const house: CreateHouseDto = await this.prisma.house.create({
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
