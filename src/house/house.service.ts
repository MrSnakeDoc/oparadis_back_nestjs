import { HouseType } from './types/house.type';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHouseDto, UpdateHouseDto } from './dto';
import { AnimalType } from 'src/animal/types/Animal.type.dto';
import { PlantType } from 'src/plant/types';

@Injectable()
export class HouseService {
  constructor(private prisma: PrismaService) {}

  async getHouses() {
    try {
      const houses: HouseType[] = await this.prisma.house.findMany({});
      if (!houses) {
        throw new HttpException('No houses found', HttpStatus.NOT_FOUND);
      }

      return houses;
    } catch (error) {
      throw error;
    }
  }

  async getHousesFull() {
    try {
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

      return fullHouses;
    } catch (error) {
      throw error;
    }
  }

  async getHouseFullById(id: string) {
    try {
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

      return fullHouse;
    } catch (error) {
      throw error;
    }
  }

  async getFour() {
    try {
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

      return four;
    } catch (error) {
      throw error;
    }
  }

  async getHouseById(houseId: string) {
    try {
      const house = this.prisma.house.findFirst({ where: { id: houseId } });
      if (!house) {
        throw new HttpException('House  not found', HttpStatus.NOT_FOUND);
      }

      return house;
    } catch (error) {
      throw error;
    }
  }

  async createHouse(userId: string, dto: CreateHouseDto) {
    try {
      const house = await this.prisma.house.create({
        data: { ...dto, user_id: userId },
      });

      return house;
    } catch (error) {
      throw error;
    }
  }

  async updateHouse(userId, houseId, dto: UpdateHouseDto) {
    try {
      const house: HouseType = await this.prisma.house.findUnique({
        where: { id: houseId },
      });

      if (!house || house.user_id !== userId) {
        throw new ForbiddenException('Access to ressources denied');
      }

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

      this.prisma.house.delete({
        where: { id: houseId },
      });

      return HttpStatus.OK;
    } catch (error) {
      throw error;
    }
  }
}
