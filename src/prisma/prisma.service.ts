import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  cleanDb() {
    return this.$transaction([
      this.photo.deleteMany(),
      this.animal.deleteMany(),
      this.plant.deleteMany(),
      this.absence.deleteMany(),
      this.match.deleteMany(),
      this.house.deleteMany(),
      // this.user.deleteMany(),
    ]);
  }

  resetUsers() {
    return this.$transaction([this.user.deleteMany()]);
  }
}
