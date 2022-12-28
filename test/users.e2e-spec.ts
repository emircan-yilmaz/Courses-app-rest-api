import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import generateString from '../src/utils';

describe('AppController (e2e)', () => {
  let users: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    users = moduleFixture.createNestApplication();
    await users.init();
  });

  describe('(GET)', () => {
    it('/users', () => {
      return request(users.getHttpServer())
        .get('/users')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwibmFtZSI6ImVtaXIiLCJpYXQiOjE2NzIxNjY3MzQsImV4cCI6MTY3NzM1MDczNH0.y4ns75DDAf-xz_hCZl1ArEV3HL9HavDlwj0x4t3_MGo',
        )
        .expect(200);
    });

    it('/users/:id', () => {
      return request(users.getHttpServer())
        .get('/users/62d7becc541181ece66edeb2')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwibmFtZSI6ImVtaXIiLCJpYXQiOjE2NzIxNjY3MzQsImV4cCI6MTY3NzM1MDczNH0.y4ns75DDAf-xz_hCZl1ArEV3HL9HavDlwj0x4t3_MGo',
        )
        .expect(200);
    });

    it('/users/:id, should give not found error, user does not exist', () => {
      return request(users.getHttpServer())
        .get('/users/62d7becc541181ece66edeaa')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwibmFtZSI6ImVtaXIiLCJpYXQiOjE2NzIxNjY3MzQsImV4cCI6MTY3NzM1MDczNH0.y4ns75DDAf-xz_hCZl1ArEV3HL9HavDlwj0x4t3_MGo',
        )
        .expect(404);
    });

    it('/users, should give forbidden resource error, only admin role has permission to get users', () => {
      return request(users.getHttpServer())
        .get('/users')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imluc3RydWN0b3IiLCJuYW1lIjoiZW1pcmNhbiIsImlhdCI6MTY3MjIyODU4MiwiZXhwIjoxNjc3NDEyNTgyfQ.QhdOFZzMQwIxltBzxWRy-j2tCVbm5ZX2Ory8bCosLNY',
        )
        .expect(403);
    });
  });

  describe('(POST)', () => {
    it('/users', () => {
      const userInfo = generateString(5);
      const user = {
        username: userInfo,
        name: userInfo,
        surname: userInfo,
        password: 'test1234',
      };
      return request(users.getHttpServer())
        .post('/users')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwibmFtZSI6ImVtaXIiLCJpYXQiOjE2NzIxNjY3MzQsImV4cCI6MTY3NzM1MDczNH0.y4ns75DDAf-xz_hCZl1ArEV3HL9HavDlwj0x4t3_MGo',
        )
        .send(user)
        .expect(201);
    });

    it('/users, should give a forbidden resource error, only admin role has permission to create user', () => {
      const userInfo = generateString(5);
      const user = {
        username: userInfo,
        name: userInfo,
        surname: userInfo,
        password: 'test1234',
      };
      return request(users.getHttpServer())
        .post('/users')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imluc3RydWN0b3IiLCJuYW1lIjoiZW1pcmNhbiIsImlhdCI6MTY3MjIyODU4MiwiZXhwIjoxNjc3NDEyNTgyfQ.QhdOFZzMQwIxltBzxWRy-j2tCVbm5ZX2Ory8bCosLNY',
        )
        .send(user)
        .expect(403);
    });

    it('/users, should give a bad request error, one required field is missing', () => {
      const userInfo = generateString(5);
      const user = {
        name: userInfo,
        surname: userInfo,
        password: 'test1234',
      };
      return request(users.getHttpServer())
        .post('/users')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwibmFtZSI6ImVtaXIiLCJpYXQiOjE2NzIxNjY3MzQsImV4cCI6MTY3NzM1MDczNH0.y4ns75DDAf-xz_hCZl1ArEV3HL9HavDlwj0x4t3_MGo',
        )
        .send(user)
        .expect(400);
    });

    it('/users, should give a bad request error, username already exists', () => {
      const userInfo = generateString(5);
      const user = {
        username: 'user',
        name: userInfo,
        surname: userInfo,
        password: 'test1234',
      };
      return request(users.getHttpServer())
        .post('/users')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwibmFtZSI6ImVtaXIiLCJpYXQiOjE2NzIxNjY3MzQsImV4cCI6MTY3NzM1MDczNH0.y4ns75DDAf-xz_hCZl1ArEV3HL9HavDlwj0x4t3_MGo',
        )
        .send(user)
        .expect(400);
    });

    it('/users, should give a bad request error, one field type is wrong', () => {
      const userInfo = generateString(5);
      const user = {
        username: 123452,
        name: userInfo,
        surname: userInfo,
        password: 'test1234',
      };
      return request(users.getHttpServer())
        .post('/users')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwibmFtZSI6ImVtaXIiLCJpYXQiOjE2NzIxNjY3MzQsImV4cCI6MTY3NzM1MDczNH0.y4ns75DDAf-xz_hCZl1ArEV3HL9HavDlwj0x4t3_MGo',
        )
        .send(user)
        .expect(400);
    });
  });

  describe('(PATCH)', () => {
    it('/users/:id', () => {
      const userInfo = generateString(5);
      const update = {
        name: userInfo,
      };
      return request(users.getHttpServer())
        .patch('/users/63937b02df844a361d472dcf')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwibmFtZSI6ImVtaXIiLCJpYXQiOjE2NzIxNjY3MzQsImV4cCI6MTY3NzM1MDczNH0.y4ns75DDAf-xz_hCZl1ArEV3HL9HavDlwj0x4t3_MGo',
        )
        .send(update)
        .expect(200);
    });

    it('/users/:id, should give not found error, user does not exist', () => {
      const userInfo = generateString(5);
      const update = {
        name: userInfo,
      };
      return request(users.getHttpServer())
        .patch('/users/63937b02df844a361d472daa')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwibmFtZSI6ImVtaXIiLCJpYXQiOjE2NzIxNjY3MzQsImV4cCI6MTY3NzM1MDczNH0.y4ns75DDAf-xz_hCZl1ArEV3HL9HavDlwj0x4t3_MGo',
        )
        .send(update)
        .expect(404);
    });

    it('/users/:id, should give forbidden resource error, only admin role has permission to update user', () => {
      const userInfo = generateString(5);
      const update = {
        name: userInfo,
      };
      return request(users.getHttpServer())
        .patch('/users/63937b02df844a361d472dcf')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imluc3RydWN0b3IiLCJuYW1lIjoiZW1pcmNhbiIsImlhdCI6MTY3MjIyODU4MiwiZXhwIjoxNjc3NDEyNTgyfQ.QhdOFZzMQwIxltBzxWRy-j2tCVbm5ZX2Ory8bCosLNY',
        )
        .send(update)
        .expect(403);
    });

    it('/users/:id, should give bad request error, field validation is wrong', () => {
      const update = {
        name: 'ab',
      };
      return request(users.getHttpServer())
        .patch('/users/63937b02df844a361d472dcf')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwibmFtZSI6ImVtaXIiLCJpYXQiOjE2NzIxNjY3MzQsImV4cCI6MTY3NzM1MDczNH0.y4ns75DDAf-xz_hCZl1ArEV3HL9HavDlwj0x4t3_MGo',
        )
        .send(update)
        .expect(400);
    });

    it('/users/me/update', () => {
      const login = {
        username: 'user',
        password: 'test1234',
      };
      return request(users.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const userInfo = generateString(5);
          const update = {
            surname: userInfo,
          };
          return request(users.getHttpServer())
            .patch('/users/me/update')
            .set(`Authorization`, `Bearer ${token}`)
            .send(update)
            .expect(200);
        });
    });

    it('/users/me/update, should give bad request error, this url is not for update password', () => {
      const login = {
        username: 'user',
        password: 'test1234',
      };
      return request(users.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const userInfo = generateString(9);
          const update = {
            password: userInfo,
          };
          return request(users.getHttpServer())
            .patch('/users/me/update')
            .set(`Authorization`, `Bearer ${token}`)
            .send(update)
            .expect(400);
        });
    });

    it('/users/me/password', () => {
      const login = {
        username: 'user',
        password: 'test1234',
      };
      return request(users.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const update = {
            oldPassword: 'test1234',
            newPassword: 'test1234',
            correctNewPassword: 'test1234',
          };
          return request(users.getHttpServer())
            .patch('/users/me/password')
            .set(`Authorization`, `Bearer ${token}`)
            .send(update)
            .expect(200);
        });
    });

    it('/users/me/password, should give unauthorized error, password is not correct', () => {
      const login = {
        username: 'user',
        password: 'test1234',
      };
      return request(users.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const update = {
            oldPassword: 'test12345',
            newPassword: 'test1234',
            correctNewPassword: 'test1234',
          };
          return request(users.getHttpServer())
            .patch('/users/me/password')
            .set(`Authorization`, `Bearer ${token}`)
            .send(update)
            .expect(401);
        });
    });

    it('/users/me/password, should give bad request error, correct password is not equal to new password', () => {
      const login = {
        username: 'user',
        password: 'test1234',
      };
      return request(users.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const update = {
            oldPassword: 'test1234',
            newPassword: 'test1234',
            correctNewPassword: 'test123456',
          };
          return request(users.getHttpServer())
            .patch('/users/me/password')
            .set(`Authorization`, `Bearer ${token}`)
            .send(update)
            .expect(400);
        });
    });
  });

  describe('(DELETE)', () => {
    it('/users/:id', () => {
      const userInfo = generateString(5);
      const user = {
        username: userInfo,
        name: userInfo,
        surname: userInfo,
        password: 'test1234',
      };
      return request(users.getHttpServer())
        .post('/users')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwibmFtZSI6ImVtaXIiLCJpYXQiOjE2NzIxNjY3MzQsImV4cCI6MTY3NzM1MDczNH0.y4ns75DDAf-xz_hCZl1ArEV3HL9HavDlwj0x4t3_MGo',
        )
        .send(user)
        .then((res) => {
          const id = res.body._id.toString();
          return request(users.getHttpServer())
            .delete(`/users/${id}`)
            .set(
              'Authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwibmFtZSI6ImVtaXIiLCJpYXQiOjE2NzIxNjY3MzQsImV4cCI6MTY3NzM1MDczNH0.y4ns75DDAf-xz_hCZl1ArEV3HL9HavDlwj0x4t3_MGo',
            )
            .expect(204);
        });
    });

    it('/users/:id, should give a not found error, user does not exist', () => {
      return request(users.getHttpServer())
        .delete('/users/63937b02df844a361d472daa')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwibmFtZSI6ImVtaXIiLCJpYXQiOjE2NzIxNjY3MzQsImV4cCI6MTY3NzM1MDczNH0.y4ns75DDAf-xz_hCZl1ArEV3HL9HavDlwj0x4t3_MGo',
        )
        .expect(404);
    });

    it('/courses/:id, should give a forbidden resource error, only admin role has permission to delete user', () => {
      return request(users.getHttpServer())
        .delete('/courses/63ab5210aec858c8464aaf00')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIiLCJuYW1lIjoiZW1pcl91c2VyIiwiaWF0IjoxNjcyMTc0NDUyLCJleHAiOjE2NzczNTg0NTJ9.WRLlhckGMwjU_7J-RSn1m4W9O9C9qQo6hRfCX_alinc',
        )
        .expect(403);
    });
  });
});
