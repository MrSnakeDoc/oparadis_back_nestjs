import { Module } from '@nestjs/common';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import { TypeController } from './type.controller';
import { TypeService } from './type.service';

@Module({
  imports: [RedisCacheModule],
  controllers: [TypeController],
  providers: [TypeService],
})
export class TypeModule {}
