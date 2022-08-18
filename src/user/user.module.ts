import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RedisCacheModule } from '../redis-cache/redis-cache.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [RedisCacheModule, CloudinaryModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
