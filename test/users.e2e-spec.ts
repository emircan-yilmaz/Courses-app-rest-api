import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import generateString from '../src/utils';

describe('UsersModuleController (e2e)', () => {
  let users: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    users = moduleFixture.createNestApplication();
    await users.init();
  });

  describe('(GET)', () => {
    it('/users, should get all users', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(users.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          return request(users.getHttpServer())
            .get('/users')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        });
    });

    it('/users/:id, should get user', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(users.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          return request(users.getHttpServer())
            .get('/users/62d7becc541181ece66edeb2')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        });
    });

    it('/users/:id, should give not found error, user does not exist', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(users.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          return request(users.getHttpServer())
            .get('/users/62d7becc541181ece66edeaa')
            .set('Authorization', `Bearer ${token}`)
            .expect(404);
        });
    });

    it('/users, should give forbidden resource error, only admin role has permission to get users', () => {
      const login = {
        username: 'instructor',
        password: 'test1234',
      };
      return request(users.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          return request(users.getHttpServer())
            .get('/users')
            .set('Authorization', `Bearer ${token}`)
            .expect(403);
        });
    });
  });

  describe('(POST)', () => {
    it('/users, should create user', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(users.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const userInfo = generateString(5);
          const user = {
            username: userInfo,
            name: userInfo,
            surname: userInfo,
            password: 'test1234',
          };
          return request(users.getHttpServer())
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send(user)
            .expect(201);
        });
    });

    it('/users, should give a forbidden resource error, only admin role has permission to create user', () => {
      const login = {
        username: 'instructor',
        password: 'test1234',
      };
      return request(users.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const userInfo = generateString(5);
          const user = {
            username: userInfo,
            name: userInfo,
            surname: userInfo,
            password: 'test1234',
          };
          return request(users.getHttpServer())
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send(user)
            .expect(403);
        });
    });

    it('/users, should give a bad request error, one required field is missing', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(users.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const userInfo = generateString(5);
          const user = {
            name: userInfo,
            surname: userInfo,
            password: 'test1234',
          };
          return request(users.getHttpServer())
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send(user)
            .expect(400);
        });
    });

    it('/users, should give a bad request error, username already exists', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(users.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const userInfo = generateString(5);
          const user = {
            username: 'user',
            name: userInfo,
            surname: userInfo,
            password: 'test1234',
          };
          return request(users.getHttpServer())
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send(user)
            .expect(400);
        });
    });

    it('/users, should give a bad request error, one field type is wrong', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(users.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const userInfo = generateString(5);
          const user = {
            username: 123452,
            name: userInfo,
            surname: userInfo,
            password: 'test1234',
          };
          return request(users.getHttpServer())
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send(user)
            .expect(400);
        });
    });
  });

  describe('(PATCH)', () => {
    it('/users/:id, should update user', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(users.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const userInfo = generateString(5);
          const update = {
            name: userInfo,
          };
          return request(users.getHttpServer())
            .patch('/users/62d7fb25f5423e3b1d019abf')
            .set('Authorization', `Bearer ${token}`)
            .send(update)
            .expect(200);
        });
    });

    it('/users/:id, should give not found error, user does not exist', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(users.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const userInfo = generateString(5);
          const update = {
            name: userInfo,
          };
          return request(users.getHttpServer())
            .patch('/users/63937b02df844a361d472daa')
            .set('Authorization', `Bearer ${token}`)
            .send(update)
            .expect(404);
        });
    });

    it('/users/:id, should give forbidden resource error, only admin role has permission to update user', () => {
      const login = {
        username: 'instructor',
        password: 'test1234',
      };
      return request(users.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const userInfo = generateString(5);
          const update = {
            name: userInfo,
          };
          return request(users.getHttpServer())
            .patch('/users/62d7fb25f5423e3b1d019abf')
            .set('Authorization', `Bearer ${token}`)
            .send(update)
            .expect(403);
        });
    });

    it('/users/:id, should give bad request error, field validation is wrong', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(users.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const update = {
            name: 'ab',
          };
          return request(users.getHttpServer())
            .patch('/users/62d7fb25f5423e3b1d019abf')
            .set('Authorization', `Bearer ${token}`)
            .send(update)
            .expect(400);
        });
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
    it('/users/:id, should delete user', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(users.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const userInfo = generateString(5);
          const user = {
            username: userInfo,
            name: userInfo,
            surname: userInfo,
            password: 'test1234',
          };
          return request(users.getHttpServer())
            .post('/users/')
            .set(`Authorization`, `Bearer ${token}`)
            .send(user)
            .then((res) => {
              const id = res.body._id.toString();
              return request(users.getHttpServer())
                .delete(`/users/${id}`)
                .set(`Authorization`, `Bearer ${token}`)
                .expect(204);
            });
        });
    });

    it('/users/:id, should give a not found error, user does not exist', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(users.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          return request(users.getHttpServer())
            .delete('/users/63937b02df844a361d472daa')
            .set(`Authorization`, `Bearer ${token}`)
            .expect(404);
        });
    });

    it('/courses/:id, should give a forbidden resource error, only admin role has permission to delete user', () => {
      const login = {
        username: 'instructor',
        password: 'test1234',
      };
      return request(users.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          return request(users.getHttpServer())
            .delete('/users/63ac6b7b4561e5c78f5c60aa')
            .set(`Authorization`, `Bearer ${token}`)
            .expect(403);
        });
    });
  });
});
