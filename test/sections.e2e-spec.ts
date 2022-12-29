import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import generateString from '../src/utils';
import { AppModule } from '../src/app.module';

describe('SectionsModuleController (e2e)', () => {
  let sections: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    sections = moduleFixture.createNestApplication();
    await sections.init();
  });

  describe('(GET)', () => {
    it('/sections/courses/:courseId, should get all sections of the course', () => {
      return request(sections.getHttpServer())
        .get('/sections/courses/62d933f8e96aad5f8dda6bb0')
        .expect(200);
    });

    it('/sections/courses/:courseId, should give an error, course does not exist', () => {
      return request(sections.getHttpServer())
        .get('/sections/courses/62d933f8e96aad5f8dda6baa')
        .expect(404);
    });

    it('/sections/:id, should get section', () => {
      return request(sections.getHttpServer())
        .get('/sections/62d93434e96aad5f8dda6bb5')
        .expect(200);
    });

    it('/sections/:id, should give an error, section does not exist', () => {
      return request(sections.getHttpServer())
        .get('/sections/62d93434e96aad5f8dda6baa')
        .expect(404);
    });
  });

  describe('(POST)', () => {
    it('/sections/courses/:courseId, should create section', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(sections.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const sectionInfo = generateString(5);
          const section = {
            title: sectionInfo,
          };
          return request(sections.getHttpServer())
            .post('/sections/courses/63ab5210aec858c8464aaf00')
            .set('Authorization', `Bearer ${token}`)
            .send(section)
            .expect(201);
        });
    });

    it('/sections/courses/:courseId, should give a forbidden request error, user role has no permission to create section', () => {
      const login = {
        username: 'user',
        password: 'test1234',
      };
      return request(sections.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const sectionInfo = generateString(5);
          const section = {
            title: sectionInfo,
          };
          return request(sections.getHttpServer())
            .post('/sections/courses/63ab5210aec858c8464aaf00')
            .set('Authorization', `Bearer ${token}`)
            .send(section)
            .expect(403);
        });
    });

    it('/sections/courses/:courseId, should give an error, course does not exist', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(sections.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const sectionInfo = generateString(5);
          const section = {
            title: sectionInfo,
          };
          return request(sections.getHttpServer())
            .post('/sections/courses/63ab5210aec858c8464aafaa')
            .set('Authorization', `Bearer ${token}`)
            .send(section)
            .expect(404);
        });
    });

    it('/sections/courses/:courseId, should give a forbidden resource error, signed user is not owner of the course', () => {
      const login = {
        username: 'instructor',
        password: 'test1234',
      };
      return request(sections.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const sectionInfo = generateString(5);
          const section = {
            title: sectionInfo,
          };
          return request(sections.getHttpServer())
            .post('/sections/courses/63ab5210aec858c8464aaf00')
            .set('Authorization', `Bearer ${token}`)
            .send(section)
            .expect(403);
        });
    });
  });

  describe('(PATCH)', () => {
    it('/sections/:sectionId/courses/:courseId, should update section', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(sections.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const sectionInfo = generateString(5);
          const update = {
            title: sectionInfo,
          };
          return request(sections.getHttpServer())
            .patch(
              '/sections/63acb78945d6aca87a1b3622/courses/63ab5210aec858c8464aaf00',
            )
            .set('Authorization', `Bearer ${token}`)
            .send(update)
            .expect(200);
        });
    });

    it('/sections/:sectionId/courses/:courseId, should give forbidden resource error, section does not exist', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(sections.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const sectionInfo = generateString(5);
          const update = {
            title: sectionInfo,
          };
          return request(sections.getHttpServer())
            .patch(
              '/sections/63acb78945d6aca87a1b36aa/courses/63ab5210aec858c8464aaf00',
            )
            .set('Authorization', `Bearer ${token}`)
            .send(update)
            .expect(403);
        });
    });

    it('/sections/:sectionId/courses/:courseId, should give forbidden resource error, section does not belong to the course', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(sections.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const sectionInfo = generateString(5);
          const update = {
            title: sectionInfo,
          };
          return request(sections.getHttpServer())
            .patch(
              '/sections/63a7000cac5674882d2a5180/courses/63ab5210aec858c8464aaf00',
            )
            .set('Authorization', `Bearer ${token}`)
            .send(update)
            .expect(403);
        });
    });

    it('/sections/:sectionId/courses/:courseId, should give not found error, course does not exist', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(sections.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const sectionInfo = generateString(5);
          const update = {
            title: sectionInfo,
          };
          return request(sections.getHttpServer())
            .patch(
              '/sections/63acb78945d6aca87a1b3622/courses/63ab5210aec858c8464aafaa',
            )
            .set('Authorization', `Bearer ${token}`)
            .send(update)
            .expect(404);
        });
    });

    it('/sections/:sectionId/courses/:courseId, should give forbidden resource error, signed user is not owner of the course', () => {
      const login = {
        username: 'instructor',
        password: 'test1234',
      };
      return request(sections.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const sectionInfo = generateString(5);
          const update = {
            title: sectionInfo,
          };
          return request(sections.getHttpServer())
            .patch(
              '/sections/63acb78945d6aca87a1b3622/courses/63ab5210aec858c8464aaf00',
            )
            .set('Authorization', `Bearer ${token}`)
            .send(update)
            .expect(403);
        });
    });
  });

  describe('(DELETE)', () => {
    it('/sections/courses/:courseId, should delete section', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(sections.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const sectionInfo = generateString(5);
          const section = {
            title: sectionInfo,
          };
          return request(sections.getHttpServer())
            .post('/sections/courses/63ab5210aec858c8464aaf00')
            .set('Authorization', `Bearer ${token}`)
            .send(section)
            .then((res) => {
              const id = res.body._id.toString();
              return request(sections.getHttpServer())
                .delete(`/sections/${id}/courses/63ab5210aec858c8464aaf00`)
                .set('Authorization', `Bearer ${token}`)
                .expect(204);
            });
        });
    });

    it('/sections/:sectionId/courses/:courseId, should give forbidden resource error, section does not exist', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(sections.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          return request(sections.getHttpServer())
            .delete(
              '/sections/63acb78945d6aca87a1b36aa/courses/63ab5210aec858c8464aaf00',
            )
            .set('Authorization', `Bearer ${token}`)
            .expect(403);
        });
    });

    it('/sections/:sectionId/courses/:courseId, should give not found error, course does not exist', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(sections.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          return request(sections.getHttpServer())
            .delete(
              '/sections/63acb78945d6aca87a1b3622/courses/63ab5210aec858c8464aafaa',
            )
            .set('Authorization', `Bearer ${token}`)
            .expect(404);
        });
    });

    it('/sections/:sectionId/courses/:courseId, should give forbidden resource error, section does not belong to the course', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(sections.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          return request(sections.getHttpServer())
            .delete(
              '/sections/63a7000cac5674882d2a5180/courses/63ab5210aec858c8464aaf00',
            )
            .set('Authorization', `Bearer ${token}`)
            .expect(403);
        });
    });

    it('/sections/:sectionId/courses/:courseId, should give forbidden resource error, signed user is not owner of the course', () => {
      const login = {
        username: 'instructor',
        password: 'test1234',
      };
      return request(sections.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          return request(sections.getHttpServer())
            .delete(
              '/sections/63acb78945d6aca87a1b3622/courses/63ab5210aec858c8464aaf00',
            )
            .set('Authorization', `Bearer ${token}`)
            .expect(403);
        });
    });
  });
});
