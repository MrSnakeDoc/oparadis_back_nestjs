import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { AuthDto, SignInDto } from '../src/auth/dto';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();

    await app.listen(5000);

    prisma = app.get(PrismaService);

    await prisma.cleanDb();

    pactum.request.setBaseUrl('http://localhost:5000/api');
  });

  afterAll(() => {
    app.close();
  });

  describe('Home', () => {
    describe('Home Check', () => {
      it('should return a list of 4 houses', async () => {
        return pactum.spec().get('/').expectStatus(200);
      });
    });

    describe('Search bar', () => {
      it('Should return multiple houses', async () => {
        return pactum.spec().get('/houses').expectStatus(200);
      });
    });
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'titogomez4455@gmail.com',
      password: 'Paradis13$',
      firstname: 'tito',
      lastname: 'gomez',
      pseudo: 'Mirajane',
      phone_number: '0184546443',
    };

    const connection: SignInDto = {
      email: 'a@a.com',
      password: 'Paradis13$',
    };
    describe('Signup', () => {
      it('Should throw an exception if email empty', async () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('Should throw an error if password empty', async () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
            firstname: dto.firstname,
            lastname: dto.lastname,
            phone_number: dto.phone_number,
          })
          .expectStatus(400);
      });

      it('Should throw an error if firstname empty', async () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
            password: dto.password,
            lastname: dto.lastname,
            phone_number: dto.phone_number,
          })
          .expectStatus(400);
      });

      it('Should throw an error if lastname empty', async () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
            password: dto.password,
            firstname: dto.firstname,
            phone_number: dto.phone_number,
          })
          .expectStatus(400);
      });

      it('Should throw an error if phone_number empty', async () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
            password: dto.password,
            firstname: dto.firstname,
            lastname: dto.lastname,
          })
          .expectStatus(400);
      });

      // it('Should pass', async () => {
      //   return pactum
      //     .spec()
      //     .post('/auth/signup')
      //     .withBody({
      //       ...dto,
      //     })
      //     .expectStatus(201);
      // });
    });

    describe('Signin ', () => {
      it('Should throw an error if email empty', async () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            password: connection.password,
          })
          .expectStatus(400);
      });

      it('Should throw an error if password empty', async () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: connection.email,
          })
          .expectStatus(400);
      });

      it('should give a 200', async () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: connection.email,
            password: connection.password,
          })
          .expectStatus(200)
          .stores('userAt', 'accessToken')
          .stores('refresh', 'refreshToken');
      });
    });
  });

  describe('User', () => {
    describe('Get Me', () => {
      it('Should get curret user', async () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });
  });

  describe('Health', () => {
    describe('Health Check', () => {
      it('should return a 200', async () => {
        return pactum.spec().get('/health').expectStatus(200);
      });
    });
  });
});
