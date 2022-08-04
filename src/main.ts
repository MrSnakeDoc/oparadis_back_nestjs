import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AuthModule } from './auth/auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle("O'Paradis API")
    .setDescription("The API for O'Paradis website")
    .setVersion('1.0')
    .addTag('auth')
    .addTag('users')
    .addTag('houses')
    .addTag('photos')
    .addTag('animals')
    .addTag('plants')
    .addTag('types')
    .addTag('matches')
    .addTag('countries')
    .addTag('absences')
    .addTag('home')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(5000);
}
bootstrap();
