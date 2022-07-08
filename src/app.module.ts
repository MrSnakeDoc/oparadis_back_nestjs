import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { HouseModule } from './house/house.module';
import { PhotoModule } from './photo/photo.module';
import { AnimalModule } from './animal/animal.module';
import { PlantModule } from './plant/plant.module';
import { TypeModule } from './type/type.module';
import { MatchModule } from './match/match.module';
import { CountryModule } from './country/country.module';
import { RedisCacheModule } from './redis-cache/redis-cache.module';
import { AbsenceModule } from './absence/absence.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MailModule } from './mail/mail.module';
import { HomeModule } from './home/home.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    PrismaModule,
    HouseModule,
    PhotoModule,
    AnimalModule,
    PlantModule,
    TypeModule,
    MatchModule,
    CountryModule,
    RedisCacheModule,
    AbsenceModule,
    CloudinaryModule,
    NotificationsModule,
    MailModule,
    HomeModule,
  ],
})
export class AppModule {}
