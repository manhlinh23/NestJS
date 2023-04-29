import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { request, spec } from 'pactum';

const PORT = 3002;

describe('App e2e test', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  beforeAll(async () => {
    const appModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = appModule.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    await app.listen(PORT);
    prismaService = app.get(PrismaService);
    await prismaService.cleanDatabase();
    request.setBaseUrl(`http://localhost:${PORT}`);
  });
  /** Main test */
  describe('Test authentication', () => {
    describe('test Register', () => {
      it('should Register', () => {
        return spec()
          .post('/auth/register')
          .withBody({
            email: 'linhnm@vitalify.asia',
            password: '123456aA@',
          })
          .expectStatus(201);
      });
      it('should error msg when empty email', () => {
        return spec()
          .post('/auth/register')
          .withBody({
            email: '',
            password: '123456aA@',
          })
          .expectStatus(400);
        //inspect to show request and reponse
        //   .inspect();
      });
      it('should error msg when invalid email', () => {
        return spec()
          .post('/auth/register')
          .withBody({
            email: 'linhnm@vitalify',
            password: '123456aA@',
          })
          .expectStatus(400);
        //inspect to show request and reponse
        //   .inspect();
      });
    });
    describe('test Login', () => {
      it('should Login', () => {
        return spec()
          .post('/auth/login')
          .withBody({
            email: 'linhnm@vitalify.asia',
            password: '123456aA@',
          })
          .expectStatus(201)
          .stores('accessToken', 'accessToken');
      });
    });
    describe('test User', () => {
      describe('get details user', () => {
        it('should get detail info user', () => {
          return spec()
            .get('/users/me')
            .withBearerToken('$S{accessToken}')
            .expectStatus(200);
        });
      });
    });
    describe('Note', () => {
      describe('insert note', () => {});
      describe('get all notes', () => {});
      describe('get note by id', () => {});
      describe('delete note', () => {});
    });
  });

  /** Main test */
  afterAll(() => {
    app.close();
  });

  it.todo('pass all');
});
