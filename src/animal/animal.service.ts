import { PrismaService } from 'src/prisma/prisma.service';
import {
  ForbiddenException,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AnimalDto } from './dto';

@Injectable()
export class AnimalService {
  constructor(private prisma: PrismaService) {}

  async getAnimals() {
    try {
      const animals = await this.prisma.animal.findMany();
      if (!animals) {
        throw new HttpException('No houses found', HttpStatus.NOT_FOUND);
      }
      return animals;
    } catch (error) {
      throw error;
    }
  }

  async getAnimalsById(animalId: string) {
    try {
      const animal = await this.prisma.animal.findFirst({
        where: {
          id: animalId,
        },
      });
      if (!animal) {
        throw new HttpException('No houses found', HttpStatus.NOT_FOUND);
      }
      return animal;
    } catch (error) {
      throw error;
    }
  }

  async createAnimal(userId: string, dto: AnimalDto) {
    try {
      const animal = await this.prisma.animal.create({
        data: {
          ...dto,
          user_id: userId,
        },
      });
      return animal;
    } catch (error) {
      throw error;
    }
  }

  async updateAnimal(userId: string, animalId: string, dto: AnimalDto) {
    try {
      const animal = await this.prisma.animal.findUnique({
        where: { id: animalId },
      });

      if (!animal || animal.user_id !== userId)
        throw new ForbiddenException('Access to ressources denied');

      return this.prisma.animal.update({
        where: { id: animalId },
        data: { ...dto },
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteAnimal(userId, animalId) {
    try {
      const animal = await this.prisma.animal.findUnique({
        where: { id: animalId },
      });

      if (!animal || animal.user_id !== userId)
        throw new ForbiddenException('Access to ressources denied');

      await this.prisma.animal.delete({
        where: { id: animalId },
      });
    } catch (error) {
      throw error;
    }
  }
}
