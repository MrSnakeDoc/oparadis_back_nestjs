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

  // async getMatches(url: string): Promise<MatchDto[]> {}
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
  // async getMatchByUserId(userId: string, url: string): Promise<MatchDto[]> {}
  // async getMatchBySitterId(
  //   sitter_id: string,
  //   url: string,
  // ): Promise<MatchDto[]> {}

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

  // async updateMatch(): Promise<MatchDto> {}
  // async deleteMatch() {}
}
