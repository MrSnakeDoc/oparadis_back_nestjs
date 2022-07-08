import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AnimalService } from './animal.service';
import { AnimalController } from './animal.controller';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [RedisCacheModule, CloudinaryModule, ConfigModule],
  providers: [AnimalService],
  controllers: [AnimalController],
})
export class AnimalModule {}
