import { Module } from '@nestjs/common';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';

@Module({
  imports: [RedisCacheModule],
  controllers: [CountryController],
  providers: [CountryService],
})
export class CountryModule {}
