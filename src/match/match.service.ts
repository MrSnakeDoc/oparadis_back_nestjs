import {
  Injectable,
  HttpException,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import { MatchFullDto } from './dto';
import { MatchDto } from './dto/Match.dto';

@Injectable()
export class MatchService {
  private readonly prefix: string = 'matches:';
  constructor(
    private prisma: PrismaService,
    private readonly cache: RedisCacheService,
  ) {}

  async getMatches(url: string): Promise<MatchDto[]> {
    try {
      const cachedMatches: MatchDto[] = await this.cache.get(
        `${this.prefix}${url}`,
      );

      if (cachedMatches) {
        return cachedMatches;
      }

      const matches: MatchDto[] = await this.prisma.match.findMany({
        include: {
          absence: true,
        },
      });

      if (!matches) {
        throw new HttpException('Matches not found', HttpStatus.NOT_FOUND);
      }

      await this.cache.set(`${this.prefix}${url}`, matches);

      return matches;
    } catch (error) {
      throw error;
    }
  }
  async getMatchById(
    userId: string,
    id: string,
    url: string,
  ): Promise<MatchFullDto> {
    try {
      const cachedMatch: MatchFullDto = await this.cache.get(
        `${this.prefix}${url}`,
      );

      if (cachedMatch) {
        const verif = new Set([
          cachedMatch.user_id,
          cachedMatch.absence.user_id,
        ]);
        if (!verif.has(userId))
          throw new ForbiddenException(
            HttpStatus.FORBIDDEN,
            'Access to ressources denied',
          );

        return cachedMatch;
      }

      const match: MatchFullDto = await this.prisma.match.findUnique({
        where: {
          id,
        },
        include: {
          absence: true,
        },
      });

      if (!match) {
        throw new Error('Match not found');
      }

      const verif = new Set([match.user_id, match.absence.user_id]);

      if (!verif.has(userId))
        throw new ForbiddenException(
          HttpStatus.FORBIDDEN,
          'Access to ressources denied',
        );

      await this.cache.set(`${this.prefix}${url}`, match);

      return match;
    } catch (error) {
      throw error;
    }
  }
  async getMatchByUserId(user_id: string, url: string): Promise<MatchDto[]> {
    try {
      const cachedMatches: MatchDto[] = await this.cache.get(
        `${this.prefix}${url}`,
      );

      if (cachedMatches) {
        return cachedMatches;
      }

      const matches: MatchDto[] = await this.prisma.match.findMany({
        where: {
          user_id,
        },
      });

      if (!matches) {
        throw new HttpException('Matches not found', HttpStatus.NOT_FOUND);
      }

      await this.cache.set(`${this.prefix}${url}`, matches);

      return matches;
    } catch (error) {
      throw error;
    }
  }
  async getMatchByAbsenceId(
    absence_id: string,
    url: string,
  ): Promise<MatchDto[]> {
    try {
      const cachedMatches: MatchDto[] = await this.cache.get(
        `${this.prefix}${url}`,
      );

      if (cachedMatches) {
        return cachedMatches;
      }

      const matches: MatchDto[] = await this.prisma.match.findMany({
        where: {
          absence_id,
        },
      });

      if (!matches) {
        throw new HttpException('Matches not found', HttpStatus.NOT_FOUND);
      }

      await this.cache.set(`${this.prefix}${url}`, matches);

      return matches;
    } catch (error) {
      throw error;
    }
  }

  async saveMatch(user_id: string, dto: MatchDto): Promise<MatchDto> {
    try {
      const match: MatchDto = await this.prisma.match.create({
        data: {
          ...dto,
          user_id,
        },
      });
      if (!match) {
        throw new HttpException('Match not found', HttpStatus.BAD_REQUEST);
      }

      await this.cache.del(this.prefix);

      return match;
    } catch (error) {
      throw error;
    }
  }

  async updateMatch(user_id, id, dto): Promise<MatchDto> {
    try {
      const match: MatchFullDto = await this.prisma.match.findUnique({
        where: {
          id,
        },
      });

      if (!match) {
        throw new HttpException('Match not found', HttpStatus.NOT_FOUND);
      }

      if (match.user_id !== user_id) {
        throw new ForbiddenException(
          HttpStatus.FORBIDDEN,
          'Access to ressources denied',
        );
      }

      const updatedMatch: MatchDto = await this.prisma.match.update({
        where: {
          id,
        },
        data: {
          ...dto,
        },
      });

      await this.cache.del(this.prefix);

      return updatedMatch;
    } catch (error) {
      throw error;
    }
  }
  async deleteMatch(user_id: string, id: string) {
    try {
      const match: MatchFullDto = await this.prisma.match.findUnique({
        where: {
          id,
        },
      });

      if (!match) {
        throw new HttpException('Match not found', HttpStatus.NOT_FOUND);
      }

      if (match.user_id !== user_id) {
        throw new ForbiddenException(
          HttpStatus.FORBIDDEN,
          'Access to ressources denied',
        );
      }

      await this.prisma.match.delete({
        where: {
          id,
        },
      });

      await this.cache.del(this.prefix);

      return HttpStatus.OK;
    } catch (error) {
      throw error;
    }
  }
}
