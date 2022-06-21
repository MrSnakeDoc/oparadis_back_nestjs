import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';

@Module({
  imports: [RedisCacheModule],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}
