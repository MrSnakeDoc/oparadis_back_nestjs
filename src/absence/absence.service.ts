import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';

@Injectable()
export class AbsenceService {
  private readonly prefix: string = 'absence:';
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: RedisCacheService,
  ) {}
  async getAbsences(url) {
    try {
      const cachedAbsences = await this.cache.get(`${this.prefix}${url}`);

      if (cachedAbsences) return cachedAbsences;

      const absences: any = await this.prisma.absence.findMany();

      if (!absences) {
        throw new HttpException('No absences found', HttpStatus.NOT_FOUND);
      }

      await this.cache.set(`${this.prefix}${url}`, absences);

      return absences;
    } catch (error) {
      throw error;
    }
  }

  async getAbsenceById(id, url) {
    try {
      const cachedAbsence = await this.cache.get(`${this.prefix}${url}`);

      if (cachedAbsence) return cachedAbsence;

      const absence = this.prisma.absence.findFirst({ where: { id } });
      if (!absence) {
        throw new HttpException('Absence not found', HttpStatus.NOT_FOUND);
      }

      await this.cache.set(`${this.prefix}gethouse`, absence);

      return absence;
    } catch (error) {
      throw error;
    }
  }

  async getAbsenceByUserId(userId, url) {}

  async createAbsence(url) {}

  async updateAbsence(url) {}

  async deleteAbsence(url) {}
}
