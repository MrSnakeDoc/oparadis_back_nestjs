import { ConfigService } from '@nestjs/config';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisCacheService } from '../redis-cache/redis-cache.service';
import { PlantDto, UpdatePlantDto } from './dto';
import { PlantType } from './types';

@Injectable()
export class PlantService {
  private readonly prefix: string = 'plants:';
  private readonly folder: string = 'plants';
  private readonly urlPrefix: string = 'plants/';

  constructor(
    private prisma: PrismaService,
    private cache: RedisCacheService,
    private cloudinary: CloudinaryService,
    private readonly configService: ConfigService,
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

      await this.cache.set(
        `${this.prefix}${url}`,
        plants,
        this.configService.get('CACHE_TTL'),
      );

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

      await this.cache.set(
        `${this.prefix}${url}`,
        plant,
        this.configService.get('CACHE_TTL'),
      );

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

      await this.cache.set(
        `${this.prefix}${url}`,
        plants,
        this.configService.get('CACHE_TTL'),
      );

      return plants;
    } catch (error) {
      throw error;
    }
  }

  async createPlant(user_id: string, dto: PlantDto): Promise<PlantType> {
    try {
      const plant: PlantDto = {
        ...dto,
      };

      if (dto.photo)
        plant.photo = await this.cloudinary.upload(dto.photo, this.folder);

      const storedPlant: PlantType = await this.prisma.plant.create({
        data: {
          ...plant,
          user_id,
        },
      });

      await this.cache.del(this.prefix);

      return storedPlant;
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
      const storedPlant = await this.prisma.plant.findUnique({
        where: { id },
      });

      if (!storedPlant || storedPlant.user_id !== userId)
        throw new ForbiddenException('Access to ressources denied');

      const data: UpdatePlantDto = {
        ...dto,
      };

      if (dto.photo || dto.photo === null)
        data.photo = await this.cloudinary.processImg(
          dto.photo,
          storedPlant.photo,
          this.urlPrefix,
          this.folder,
        );

      await this.cache.del(this.prefix);

      return this.prisma.plant.update({
        where: { id },
        data: { ...data },
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

      if (plant.photo)
        await this.cloudinary.delete(plant.photo, this.urlPrefix);

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
