import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import { HouseController } from './house.controller';
import { HouseService } from './house.service';

@Module({
  imports: [RedisCacheModule, ConfigModule],
  controllers: [HouseController],
  providers: [HouseService],
})
export class HouseModule {}
