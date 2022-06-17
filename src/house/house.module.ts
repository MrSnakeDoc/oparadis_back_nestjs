import { Module } from '@nestjs/common';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import { HouseController } from './house.controller';
import { HouseService } from './house.service';

@Module({
  imports: [RedisCacheModule],
  controllers: [HouseController],
  providers: [HouseService],
})
export class HouseModule {}
