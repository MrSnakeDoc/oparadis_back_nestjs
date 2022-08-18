import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { RedisCacheModule } from '../redis-cache/redis-cache.module';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';

@Module({
  imports: [RedisCacheModule, CloudinaryModule, ConfigModule],
  controllers: [PhotoController],
  providers: [PhotoService],
})
export class PhotoModule {}
