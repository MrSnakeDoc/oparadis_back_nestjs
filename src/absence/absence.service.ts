import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisCacheService } from '../redis-cache/redis-cache.service';
import { CreateAbsenceDto, UpdateAbsenceDto, AbsenceDto } from './dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AbsenceService {
  private readonly prefix: string = 'absences:';
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: RedisCacheService,
    private readonly configService: ConfigService,
  ) {}
  async getAbsences(url): Promise<AbsenceDto[]> {
    try {
      const cachedAbsences: AbsenceDto[] = await this.cache.get(
        `${this.prefix}${url}`,
      );

      if (cachedAbsences) return cachedAbsences;

      const absences: AbsenceDto[] = await this.prisma.absence.findMany();

      if (!absences) {
        throw new HttpException('No absences found', HttpStatus.NOT_FOUND);
      }

      await this.cache.set(
        `${this.prefix}${url}`,
        absences,
        this.configService.get('CACHE_TTL'),
      );

      return absences;
    } catch (error) {
      throw error;
    }
  }

  async getAbsenceById(id, url) {
    try {
      const cachedAbsence: AbsenceDto = await this.cache.get(
        `${this.prefix}${url}`,
      );

      if (cachedAbsence) return cachedAbsence;

      const absence = this.prisma.absence.findFirst({ where: { id } });
      if (!absence) {
        throw new HttpException('Absence not found', HttpStatus.NOT_FOUND);
      }

      await this.cache.set(
        `${this.prefix}${url}`,
        absence,
        this.configService.get('CACHE_TTL'),
      );

      return absence;
    } catch (error) {
      throw error;
    }
  }

  async getAbsencesByUserId(user_id, url): Promise<AbsenceDto[]> {
    try {
      const cachedAbsences: AbsenceDto[] = await this.cache.get(
        `${this.prefix}${url}`,
      );

      if (cachedAbsences) return cachedAbsences;

      const absences: AbsenceDto[] = await this.prisma.absence.findMany({
        where: {
          user_id,
        },
      });

      if (!absences) {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }

      await this.cache.set(
        `${this.prefix}${url}`,
        absences,
        this.configService.get('CACHE_TTL'),
      );

      return absences;
    } catch (error) {
      throw error;
    }
  }

  async createAbsence(
    user_id: string,
    dto: CreateAbsenceDto,
  ): Promise<AbsenceDto> {
    try {
      const absence: AbsenceDto = await this.prisma.absence.create({
        data: {
          ...dto,
          user_id,
        },
      });

      if (!absence) {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }

      await this.cache.del(this.prefix);

      return absence;
    } catch (error) {
      throw error;
    }
  }

  async updateAbsence(
    user_id: string,
    id: string,
    dto: UpdateAbsenceDto,
  ): Promise<AbsenceDto> {
    try {
      const cachedAbsence: AbsenceDto = await this.prisma.absence.findUnique({
        where: {
          id,
        },
      });

      if (!cachedAbsence || cachedAbsence.user_id === user_id) {
        throw new ForbiddenException('Access to ressources denied');
      }

      const absence: AbsenceDto = await this.prisma.absence.update({
        where: { id },
        data: {
          ...dto,
          user_id,
        },
      });

      if (!absence) {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }

      await this.cache.del(this.prefix);

      return absence;
    } catch (error) {
      throw error;
    }
  }

  async deleteAbsence(user_id, id) {
    const cachedAbsence: AbsenceDto = await this.prisma.absence.findUnique({
      where: {
        id,
      },
    });

    if (!cachedAbsence || cachedAbsence.user_id === user_id) {
      throw new ForbiddenException('Access to ressources denied');
    }

    await this.cache.del(this.prefix);

    await this.prisma.absence.delete({ where: { id } });

    return HttpStatus.OK;
  }
}
