import { HouseType } from './types/house.type';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHouseDto, UpdateHouseDto } from './dto';

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

  async getFour() {
    try {
      const houses: HouseType[] = await this.prisma.house.findMany({
        orderBy: [
          {
            created_at: 'desc',
          },
        ],
      });
      if (!houses) {
        throw new HttpException('No houses found', HttpStatus.NOT_FOUND);
      }
      return houses.slice(0, 4);
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
      console.log(house);

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
