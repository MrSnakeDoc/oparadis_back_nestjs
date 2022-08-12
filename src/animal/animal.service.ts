import { PrismaService } from 'src/prisma/prisma.service';
import {
  ForbiddenException,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AnimalDto, UpdateAnimalDto } from './dto';
import { AnimalType } from './types/';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AnimalService {
  private readonly prefix: string = 'animals:';
  private readonly folder: string = 'animals';
  private readonly urlPrefix: string = 'animals/';

  constructor(
    private prisma: PrismaService,
    private cache: RedisCacheService,
    private cloudinary: CloudinaryService,
    private configService: ConfigService,
  ) {}

  async getAnimals(url: string): Promise<AnimalType[]> {
    try {
      const cachedAnimals: AnimalType[] = await this.cache.get(
        `${this.prefix}${url}`,
      );

      if (cachedAnimals) return cachedAnimals;

      const animals: AnimalType[] = await this.prisma.animal.findMany();
      if (!animals) {
        throw new HttpException('No houses found', HttpStatus.NOT_FOUND);
      }

      await this.cache.set(
        `${this.prefix}${url}`,
        animals,
        this.configService.get('CACHE_TTL'),
      );

      return animals;
    } catch (error) {
      throw error;
    }
  }

  async getAnimalById(id: string, url: string): Promise<AnimalType> {
    try {
      const cachedAnimal: AnimalType = await this.cache.get(
        `${this.prefix}${url}`,
      );

      if (cachedAnimal) return cachedAnimal;
      const animal: AnimalType = await this.prisma.animal.findFirst({
        where: {
          id,
        },
      });

      if (!animal) {
        throw new HttpException('No houses found', HttpStatus.NOT_FOUND);
      }

      await this.cache.set(
        `${this.prefix}${url}`,
        animal,
        this.configService.get('CACHE_TTL'),
      );

      return animal;
    } catch (error) {
      throw error;
    }
  }

  async getAnimalsByUserId(
    user_id: string,
    url: string,
  ): Promise<AnimalType[]> {
    try {
      const cachedAnimal: AnimalType[] = await this.cache.get(
        `${this.prefix}${url}`,
      );

      if (cachedAnimal) return cachedAnimal;

      const animals: AnimalType[] = await this.prisma.animal.findMany({
        where: {
          user_id,
        },
      });

      if (!animals) {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }

      await this.cache.set(
        `${this.prefix}${url}`,
        animals,
        this.configService.get('CACHE_TTL'),
      );

      return animals;
    } catch (error) {
      throw error;
    }
  }

  async createAnimal(userId: string, dto: AnimalDto): Promise<AnimalType> {
    try {
      const animal: AnimalType = {
        ...dto,
        user_id: userId,
      };

      if (dto.photo)
        animal.photo = await this.cloudinary.upload(dto.photo, this.folder);

      const storedAnimal: AnimalType = await this.prisma.animal.create({
        data: {
          ...animal,
        },
      });

      await this.cache.del(this.prefix);

      return storedAnimal;
    } catch (error) {
      throw error;
    }
  }

  async updateAnimal(
    userId: string,
    id: string,
    dto: UpdateAnimalDto,
  ): Promise<AnimalType> {
    try {
      const storedAnimal: AnimalType = await this.prisma.animal.findUnique({
        where: { id },
      });

      if (!storedAnimal || storedAnimal.user_id !== userId)
        throw new ForbiddenException('Access to ressources denied');

      const data: UpdateAnimalDto = {
        ...dto,
      };

      if (dto.photo || dto.photo === null)
        data.photo = await this.cloudinary.processImg(
          dto.photo,
          storedAnimal.photo,
          this.urlPrefix,
          this.folder,
        );

      await this.cache.del(this.prefix);

      return this.prisma.animal.update({
        where: { id },
        data: { ...data },
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteAnimal(userId, id) {
    try {
      const animal: AnimalType = await this.prisma.animal.findUnique({
        where: { id },
      });

      if (!animal || animal.user_id !== userId)
        throw new ForbiddenException('Access to ressources denied');

      if (animal.photo)
        await this.cloudinary.delete(animal.photo, this.urlPrefix);

      await this.cache.del(this.prefix);

      await this.prisma.animal.delete({
        where: { id },
      });

      return HttpStatus.OK;
    } catch (error) {
      throw error;
    }
  }
}
