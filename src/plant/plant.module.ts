import { Module } from '@nestjs/common';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import { PlantController } from './plant.controller';
import { PlantService } from './plant.service';

@Module({
  imports: [RedisCacheModule],
  controllers: [PlantController],
  providers: [PlantService],
})
export class PlantModule {}
