import { Module } from '@nestjs/common';
import { AnimalService } from './animal.service';
import { AnimalController } from './animal.controller';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';

@Module({
  imports: [RedisCacheModule],
  providers: [AnimalService],
  controllers: [AnimalController],
})
export class AnimalModule {}
