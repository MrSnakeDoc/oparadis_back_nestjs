import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle("O'Paradis API")
    .setDescription(
      "The API for O'Paradis website, this API provides all the data and routes needed to run the website.",
    )
    .setVersion('2.0')
    .setContact(
      'MrSnakeDoc',
      'https://github.com/MrSnakeDoc',
      'mrsnakedoc@gmail.com',
    )
    .addTag('home')
    .addTag('auth')
    .addTag('users')
    .addTag('houses')
    .addTag('photos')
    .addTag('animals')
    .addTag('plants')
    .addTag('absences')
    .addTag('matches')
    .addTag('types')
    .addTag('countries')
    .addBearerAuth()
    .build();

  const swaggerCustomOptions = {
    swaggerOptions: {
      operationsSorter: (a, b) => {
        const order = { get: '0', post: '1', patch: '2', delete: '3' };
        return order[a._root.entries[1][1]].localeCompare(
          order[b._root.entries[1][1]],
        );
      },
    },
  };
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, swaggerCustomOptions);
  await app.listen(5000);
}
bootstrap();
