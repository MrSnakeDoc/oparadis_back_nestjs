import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Type } from './types';

@Injectable()
export class TypeService {
  constructor(private prisma: PrismaService) {}

  async getTypes() {
    try {
      const countries: Type[] = await this.prisma.type.findMany();
      if (!countries) {
        throw new HttpException('No countries found', HttpStatus.NOT_FOUND);
      }
      return countries;
    } catch (error) {
      throw error;
    }
  }

  async getTypesById(typeId: string) {
    try {
      const type: Type = await this.prisma.type.findFirst({
        where: {
          id: typeId,
        },
      });
      if (!type) {
        throw new HttpException('No countries found', HttpStatus.NOT_FOUND);
      }
      return type;
    } catch (error) {
      throw error;
    }
  }
}
