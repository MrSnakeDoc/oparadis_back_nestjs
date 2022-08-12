import { MailModule } from 'src/mail/mail.module';
import { JwtStrategy } from './strategy/';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';

@Module({
  imports: [JwtModule.register({}), RedisCacheModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
