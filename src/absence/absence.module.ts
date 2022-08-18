import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { RedisCacheModule } from '../redis-cache/redis-cache.module';
import { AbsenceController } from './absence.controller';
import { AbsenceService } from './absence.service';

@Module({
  imports: [RedisCacheModule, ConfigModule],
  controllers: [AbsenceController],
  providers: [AbsenceService],
})
export class AbsenceModule {}
