import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import generateString from '../src/utils';
import { AppModule } from '../src/app.module';

describe('CoursesModuleController (e2e)', () => {
  let courses: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    courses = moduleFixture.createNestApplication();
    await courses.init();
  });

  describe('(GET)', () => {
    it('/courses, should get courses', () => {
      return request(courses.getHttpServer()).get('/courses').expect(200);
    });

    it('/courses/:id, should get course', () => {
      return request(courses.getHttpServer())
        .get('/courses/62d933f8e96aad5f8dda6bb0')
        .expect(200);
    });

    it('/courses/:id, should give not found error, course does not exist', () => {
      return request(courses.getHttpServer())
        .get('/courses/62d933f8e96aad5f8dda6baa')
        .expect(404);
    });
  });

  describe('(POST)', () => {
    it('/courses, should create course', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(courses.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const courseInfo = generateString(5);
          const course = {
            title: courseInfo,
            description: courseInfo,
            short_description: 'Hello',
            learn: ['web'],
            requirements: ['pc'],
            preview: 'link',
          };

          return request(courses.getHttpServer())
            .post('/courses')
            .set('Authorization', `Bearer ${token}`)
            .send(course)
            .expect(201);
        });
    });

    it('/courses, should give a forbidden request error, user role has no permission to create course', () => {
      const login = {
        username: 'user',
        password: 'test1234',
      };
      return request(courses.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const courseInfo = generateString(5);
          const course = {
            title: courseInfo,
            description: courseInfo,
            short_description: 'Hello',
            learn: ['web'],
            requirements: ['pc'],
            preview: 'link',
          };

          return request(courses.getHttpServer())
            .post('/courses')
            .set('Authorization', `Bearer ${token}`)
            .send(course)
            .expect(403);
        });
    });

    it('/courses, should give a bad request error, one required field is missing', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(courses.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const courseInfo = generateString(5);
          const course = {
            description: courseInfo,
            short_description: 'Hello',
            learn: ['web'],
            requirements: ['pc'],
            preview: 'link',
          };

          return request(courses.getHttpServer())
            .post('/courses')
            .set('Authorization', `Bearer ${token}`)
            .send(course)
            .expect(400);
        });
    });

    it('/course, should give a bad request error, one field type is wrong', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(courses.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const courseInfo = generateString(5);
          const course = {
            title: courseInfo,
            description: 5645485,
            short_description: 'Hello',
            learn: ['web'],
            requirements: ['pc'],
            preview: 'link',
          };

          return request(courses.getHttpServer())
            .post('/courses')
            .set('Authorization', `Bearer ${token}`)
            .send(course)
            .expect(400);
        });
    });
  });

  describe('(PATCH)', () => {
    it('/courses/:id, should update course', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(courses.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const courseInfo = generateString(5);
          const update = {
            short_description: courseInfo,
          };

          return request(courses.getHttpServer())
            .patch('/courses/63ab5210aec858c8464aaf00')
            .set('Authorization', `Bearer ${token}`)
            .send(update)
            .expect(200);
        });
    });

    it('/courses/:id, should give a not found error, course does not exist', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(courses.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const courseInfo = generateString(5);
          const update = {
            short_description: courseInfo,
          };

          return request(courses.getHttpServer())
            .patch('/courses/63ab5210aec858c8464aafaa')
            .set('Authorization', `Bearer ${token}`)
            .send(update)
            .expect(404);
        });
    });

    it('/courses/:id, should give a forbidden resource error, user role has no permission to update course', () => {
      const login = {
        username: 'user',
        password: 'test1234',
      };
      return request(courses.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const courseInfo = generateString(5);
          const update = {
            short_description: courseInfo,
          };

          return request(courses.getHttpServer())
            .patch('/courses/63ab5210aec858c8464aaf00')
            .set('Authorization', `Bearer ${token}`)
            .send(update)
            .expect(403);
        });
    });

    it('/courses/:id, should give forbidden resource error, signed user is not owner of the course', () => {
      const login = {
        username: 'instructor',
        password: 'test1234',
      };
      return request(courses.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const courseInfo = generateString(5);
          const update = {
            short_description: courseInfo,
          };

          return request(courses.getHttpServer())
            .patch('/courses/63ab6259445f94c6e0ef81d3')
            .set('Authorization', `Bearer ${token}`)
            .send(update)
            .expect(403);
        });
    });

    it('/courses/:id, should give a bad request error, one field type is wrong', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(courses.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const update = {
            short_description: 5555555555,
          };

          return request(courses.getHttpServer())
            .patch('/courses/63ab5210aec858c8464aaf00')
            .set('Authorization', `Bearer ${token}`)
            .send(update)
            .expect(400);
        });
    });
  });

  describe('(DELETE)', () => {
    it('/courses/:id, should delete course', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(courses.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const courseInfo = generateString(5);
          const course = {
            title: courseInfo,
            description: courseInfo,
            short_description: 'Hello',
            learn: ['web'],
            requirements: ['pc'],
            preview: 'link',
          };

          return request(courses.getHttpServer())
            .post('/courses')
            .set('Authorization', `Bearer ${token}`)
            .send(course)
            .then((res) => {
              const id = res.body._id.toString();
              return request(courses.getHttpServer())
                .delete(`/courses/${id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(204);
            });
        });
    });

    it('/courses/:id, should give a not found error, course does not exist', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(courses.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          return request(courses.getHttpServer())
            .delete('/courses/63ab5210aec858c8464aafaa')
            .set('Authorization', `Bearer ${token}`)
            .expect(404);
        });
    });

    it('/courses/:id, should give a forbidden resource error, user role has no permission to delete course', () => {
      const login = {
        username: 'user',
        password: 'test1234',
      };
      return request(courses.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          return request(courses.getHttpServer())
            .delete('/courses/63ab6259445f94c6e0ef81d3')
            .set('Authorization', `Bearer ${token}`)
            .expect(403);
        });
    });

    it('/courses/:id, should give forbidden resource error, signed user is not owner of the course', () => {
      const login = {
        username: 'instructor',
        password: 'test1234',
      };
      return request(courses.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          return request(courses.getHttpServer())
            .delete('/courses/63ab6259445f94c6e0ef81d3')
            .set('Authorization', `Bearer ${token}`)
            .expect(403);
        });
    });
  });
});
