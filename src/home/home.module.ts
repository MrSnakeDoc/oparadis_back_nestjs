import { Module } from '@nestjs/common';
import { RedisCacheModule } from '../redis-cache/redis-cache.module';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [RedisCacheModule, ConfigModule],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
