import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import generateString from '../src/utils';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('Login', () => {
    it('/auth/login, should login', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(login)
        .expect(201);
    });

    it('/auth/login, should give unauthorized error, password is not correct', () => {
      const login = {
        username: 'admin',
        password: 'test12345',
      };
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(login)
        .expect(401);
    });
  });

  describe('Sign Up', () => {
    it('/auth/signup, should sign up', () => {
      const dto = {
        username: generateString(4),
        name: 'emir',
        surname: 'can',
        password: 'test1234',
        passwordConfirm: 'test1234',
      };
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(dto)
        .expect(201);
    });

    it('/auth/signup, should give bad request error, confirmation password is not equal to password', () => {
      const dto = {
        username: generateString(4),
        name: 'emir',
        surname: 'can',
        password: 'test1234',
        passwordConfirm: 'test12345',
      };
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(dto)
        .expect(400);
    });

    it('/auth/signup, should give bad request error, username already exist', () => {
      const dto = {
        username: 'user',
        name: 'emir',
        surname: 'can',
        password: 'test1234',
        passwordConfirm: 'test12345',
      };
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(dto)
        .expect(400);
    });

    it('/auth/singup, should give bad request error, password must be longer than or equal to 8 characters', () => {
      const dto = {
        username: generateString(4),
        name: 'emir',
        surname: 'can',
        password: 'test12',
        passwordConfirm: 'test12',
      };
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(dto)
        .expect(400);
    });
  });
});
