import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';

@Module({
  imports: [RedisCacheModule, ConfigModule],
  controllers: [CountryController],
  providers: [CountryService],
})
export class CountryModule {}
