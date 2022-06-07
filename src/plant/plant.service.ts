import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PlantDto, UpdatePlantDto } from './dto';

@Injectable()
export class PlantService {
  constructor(private prisma: PrismaService) {}

  async getPlants() {
    try {
      const plant = await this.prisma.plant.findMany();
      if (!plant) {
        throw new HttpException('No houses found', HttpStatus.NOT_FOUND);
      }
      return plant;
    } catch (error) {
      throw error;
    }
  }

  async getPlantById(id: string) {
    try {
      const plant = await this.prisma.plant.findFirst({
        where: {
          id,
        },
      });
      if (!plant) {
        throw new HttpException('No houses found', HttpStatus.NOT_FOUND);
      }
      return plant;
    } catch (error) {
      throw error;
    }
  }

  async getPlantByUserId(user_id: string) {
    try {
      const plants: PlantDto[] = await this.prisma.plant.findMany({
        where: {
          user_id,
        },
      });
      if (!plants) {
        throw new HttpException('No photo found', HttpStatus.NOT_FOUND);
      }
      return plants;
    } catch (error) {
      throw error;
    }
  }

  async createPlant(userId: string, dto: PlantDto) {
    try {
      return await this.prisma.plant.create({
        data: {
          ...dto,
          user_id: userId,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async updatePlant(userId: string, id: string, dto: UpdatePlantDto) {
    try {
      const plant = await this.prisma.plant.findUnique({
        where: { id },
      });

      if (!plant || plant.user_id !== userId)
        throw new ForbiddenException('Access to ressources denied');

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
    } catch (error) {
      throw error;
    }
  }
}
