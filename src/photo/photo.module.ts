import { Module } from '@nestjs/common';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';

@Module({
  imports: [RedisCacheModule],
  controllers: [PhotoController],
  providers: [PhotoService],
})
export class PhotoModule {}
