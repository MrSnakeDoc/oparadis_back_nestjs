import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import { PlantDto, UpdatePlantDto } from './dto';
import { PlantType } from './types';

@Injectable()
export class PlantService {
  private readonly prefix: string = 'plants:';

  constructor(
    private prisma: PrismaService,
    private cache: RedisCacheService,
  ) {}

  async getPlants(url: string): Promise<PlantType[]> {
    try {
      const cachedPlants: PlantType[] = await this.cache.get(
        `${this.prefix}${url}`,
      );

      if (cachedPlants) return cachedPlants;

      const plants: PlantType[] = await this.prisma.plant.findMany();
      if (!plants) {
        throw new HttpException('No houses found', HttpStatus.NOT_FOUND);
      }

      await this.cache.set(`${this.prefix}${url}`, plants);

      return plants;
    } catch (error) {
      throw error;
    }
  }

  async getPlantById(id: string, url: string): Promise<PlantType> {
    try {
      const cachedPlant: PlantType = await this.cache.get(
        `${this.prefix}${url}`,
      );

      if (cachedPlant) return cachedPlant;

      const plant = await this.prisma.plant.findFirst({
        where: {
          id,
        },
      });
      if (!plant) {
        throw new HttpException('No houses found', HttpStatus.NOT_FOUND);
      }

      await this.cache.set(`${this.prefix}${url}`, plant);

      return plant;
    } catch (error) {
      throw error;
    }
  }

  async getPlantByUserId(user_id: string, url: string): Promise<PlantType[]> {
    try {
      const cachedPlants: PlantType[] = await this.cache.get(
        `${this.prefix}${url}`,
      );

      if (cachedPlants) return cachedPlants;

      const plants: PlantType[] = await this.prisma.plant.findMany({
        where: {
          user_id,
        },
      });
      if (!plants) {
        throw new HttpException('No photo found', HttpStatus.NOT_FOUND);
      }

      await this.cache.set(`${this.prefix}${url}`, plants);

      return plants;
    } catch (error) {
      throw error;
    }
  }

  async createPlant(userId: string, dto: PlantDto): Promise<PlantType> {
    try {
      const plant: PlantType = await this.prisma.plant.create({
        data: {
          ...dto,
          user_id: userId,
        },
      });

      await this.cache.del(this.prefix);

      return plant;
    } catch (error) {
      throw error;
    }
  }

  async updatePlant(
    userId: string,
    id: string,
    dto: UpdatePlantDto,
  ): Promise<PlantType> {
    try {
      const plant = await this.prisma.plant.findUnique({
        where: { id },
      });

      if (!plant || plant.user_id !== userId)
        throw new ForbiddenException('Access to ressources denied');

      await this.cache.del(this.prefix);

      return this.prisma.plant.update({
        where: { id },
        data: { ...dto },
      });
    } catch (error) {
      throw error;
    }
  }

  async deletePlant(userId, id) {
    try {
      const plant = await this.prisma.plant.findUnique({
        where: { id },
      });

      if (!plant || plant.user_id !== userId)
        throw new ForbiddenException('Access to ressources denied');

      await this.prisma.plant.delete({
        where: { id },
      });

      await this.cache.del(this.prefix);

      return HttpStatus.OK;
    } catch (error) {
      throw error;
    }
  }
}
