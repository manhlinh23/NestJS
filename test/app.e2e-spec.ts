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
      it('duplicate email', () => {
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
      describe('INSERT', () => {
        it('insert success', () => {
          return spec()
            .post('/notes')
            .withBearerToken('$S{accessToken}')
            .withBody({
              title: 'title 1',
              description: 'description 1',
              url: 'https://google.com',
            })
            .expectStatus(201);
        });
        it('insert failed when no id user', () => {
          return spec()
            .post('/notes')
            .withBody({
              title: 'title 1',
              description: 'description 1',
              url: 'https://google.com',
            })
            .expectStatus(401);
        });
        it('insert failed when body content', () => {
          return spec()
            .post('/notes')
            .withBearerToken('$S{accessToken}')
            .expectStatus(400);
        });
      });
      describe('GET ALL NOTES', () => {
        it('get all notes success', () => {
          return spec()
            .get('/notes')
            .withBearerToken('$S{accessToken}')
            .stores('noteId1', '[0].id')
            .expectStatus(200);
        });
        it('get all notes with no user id', () => {
          return spec().get('/notes').expectStatus(401);
        });
      });
      describe('GET NOTE BY ID', () => {
        it('success', () => {
          return spec()
            .get('/notes/{id}')
            .withBearerToken('$S{accessToken}')
            .withPathParams('id', '$S{noteId1}')
            .expectStatus(200);
        });
        it('not exists note', () => {
          return spec()
            .get('/notes/{id}')
            .withBearerToken('$S{accessToken}')
            .withPathParams('id', '4')
            .expectStatus(403)
            .inspect();
        });
        it('not user id', () => {
          return spec()
            .get('/notes/{id}')
            .withPathParams('id', '1')
            .expectStatus(401);
        });
      });
      // describe('delete note', () => {});
    });
  });

  /** Main test */
  afterAll(() => {
    app.close();
  });

  it.todo('pass all');
});
