import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import generateString from '../src/utils';
import { AppModule } from '../src/app.module';

describe('VideosModuleController (e2e)', () => {
  let videos: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    videos = moduleFixture.createNestApplication();
    await videos.init();
  });

  describe('(GET)', () => {
    it('/videos/:id, should get video', () => {
      return request(videos.getHttpServer())
        .get('/videos/63ad82cc45781acf362b0644')
        .expect(200);
    });

    it('/videos/:id, should give an error, video does not exist', () => {
      return request(videos.getHttpServer())
        .get('/videos/63ad82cc45781acf362b06aa')
        .expect(404);
    });
  });

  describe('(POST)', () => {
    it('/videos/sections/:sectionId/courses/:courseId, should create video', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(videos.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const videoInfo = generateString(5);
          const video = {
            title: videoInfo,
            link: 'link',
            length: '3',
          };
          return request(videos.getHttpServer())
            .post(
              '/videos/sections/62d98af5fb2c4643a4ff0b41/courses/62d84a469da35cd059b13024',
            )
            .set('Authorization', `Bearer ${token}`)
            .send(video)
            .expect(201);
        });
    });

    it('/videos/sections/:sectionId/courses/:courseId, should give a forbidden request error, user role has no permission to create video', () => {
      const login = {
        username: 'user',
        password: 'test1234',
      };
      return request(videos.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const videoInfo = generateString(5);
          const video = {
            title: videoInfo,
            link: 'link',
            length: '3',
          };
          return request(videos.getHttpServer())
            .post(
              '/videos/sections/62d98af5fb2c4643a4ff0b41/courses/62d84a469da35cd059b13024',
            )
            .set('Authorization', `Bearer ${token}`)
            .send(video)
            .expect(403);
        });
    });

    it('/videos/sections/:sectionId/courses/:courseId, should give an error, course does not exist', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(videos.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const videoInfo = generateString(5);
          const video = {
            title: videoInfo,
            link: 'link',
            length: '3',
          };
          return request(videos.getHttpServer())
            .post(
              '/videos/sections/62d98af5fb2c4643a4ff0b41/courses/62d84a469da35cd059b130aa',
            )
            .set('Authorization', `Bearer ${token}`)
            .send(video)
            .expect(404);
        });
    });

    it('/videos/sections/:sectionId/courses/:courseId, should give a forbidden resource error, signed user is not owner of the course', () => {
      const login = {
        username: 'instructor',
        password: 'test1234',
      };
      return request(videos.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const videoInfo = generateString(5);
          const video = {
            title: videoInfo,
            link: 'link',
            length: '3',
          };
          return request(videos.getHttpServer())
            .post(
              '/videos/sections/62d98af5fb2c4643a4ff0b41/courses/62d84a469da35cd059b13024',
            )
            .set('Authorization', `Bearer ${token}`)
            .send(video)
            .expect(403);
        });
    });

    it('/videos/sections/:sectionId/courses/:courseId, should give a forbidden resource error, section does not belong to course', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(videos.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const videoInfo = generateString(5);
          const video = {
            title: videoInfo,
            link: 'link',
            length: '3',
          };
          return request(videos.getHttpServer())
            .post(
              '/videos/sections/62d93434e96aad5f8dda6bb5/courses/62d84a469da35cd059b13024',
            )
            .set('Authorization', `Bearer ${token}`)
            .send(video)
            .expect(403);
        });
    });
  });

  describe('(PATCH)', () => {
    it('/videos/:videoId/sections/:sectionId/courses/:courseId, should update video', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(videos.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const videoInfo = generateString(5);
          const update = {
            link: videoInfo,
          };
          return request(videos.getHttpServer())
            .patch(
              '/videos/63ad82cc45781acf362b0644/sections/63a704833c4c92da625286dc/courses/62d84a469da35cd059b13024',
            )
            .set('Authorization', `Bearer ${token}`)
            .send(update)
            .expect(200);
        });
    });

    it('/videos/:videoId/sections/:sectionId/courses/:courseId, should give forbidden resource error, section does not belong to the course', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(videos.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const videoInfo = generateString(5);
          const update = {
            link: videoInfo,
          };
          return request(videos.getHttpServer())
            .patch(
              '/videos/62d96a833b623b7798535d23/sections/62d93434e96aad5f8dda6bb5/courses/62d84a469da35cd059b13024',
            )
            .set('Authorization', `Bearer ${token}`)
            .send(update)
            .expect(403);
        });
    });

    it('/videos/:videoId/sections/:sectionId/courses/:courseId, should give a not found error, course does not exist', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(videos.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const videoInfo = generateString(5);
          const update = {
            link: videoInfo,
          };
          return request(videos.getHttpServer())
            .patch(
              '/videos/63ad82cc45781acf362b0644/sections/63a704833c4c92da625286dc/courses/62d84a469da35cd059b130aa',
            )
            .set('Authorization', `Bearer ${token}`)
            .send(update)
            .expect(404);
        });
    });

    it('/videos/:videoId/sections/:sectionId/courses/:courseId, should give forbidden resource error, video does not belong to the section', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(videos.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const videoInfo = generateString(5);
          const update = {
            link: videoInfo,
          };
          return request(videos.getHttpServer())
            .patch(
              '/videos/62d96a833b623b7798535d23/sections/63a704833c4c92da625286dc/courses/62d84a469da35cd059b13024',
            )
            .set('Authorization', `Bearer ${token}`)
            .send(update)
            .expect(403);
        });
    });

    it('/videos/:videoId/sections/:sectionId/courses/:courseId, should give forbidden resource error, signed user is not owner of the course', () => {
      const login = {
        username: 'instructor',
        password: 'test1234',
      };
      return request(videos.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const videoInfo = generateString(5);
          const update = {
            link: videoInfo,
          };
          return request(videos.getHttpServer())
            .patch(
              '/videos/63ad82cc45781acf362b0644/sections/63a704833c4c92da625286dc/courses/62d84a469da35cd059b13024',
            )
            .set('Authorization', `Bearer ${token}`)
            .send(update)
            .expect(403);
        });
    });

    it('/videos/:videoId/sections/:sectionId/courses/:courseId, should give forbidden resource error, user role has no permission to update course', () => {
      const login = {
        username: 'user',
        password: 'test1234',
      };
      return request(videos.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const videoInfo = generateString(5);
          const update = {
            link: videoInfo,
          };
          return request(videos.getHttpServer())
            .patch(
              '/videos/63ad82cc45781acf362b0644/sections/63a704833c4c92da625286dc/courses/62d84a469da35cd059b13024',
            )
            .set('Authorization', `Bearer ${token}`)
            .send(update)
            .expect(403);
        });
    });
  });

  describe('(DELETE)', () => {
    it('/videos/:videoId/sections/:sectionId/courses/:courseId, should delete video', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(videos.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          const videoInfo = generateString(5);
          const video = {
            title: videoInfo,
            link: 'link',
            length: '3',
          };
          return request(videos.getHttpServer())
            .post(
              '/videos/sections/62d98af5fb2c4643a4ff0b41/courses/62d84a469da35cd059b13024',
            )
            .set('Authorization', `Bearer ${token}`)
            .send(video)
            .then((res) => {
              const id = res.body._id.toString();
              return request(videos.getHttpServer())
                .delete(
                  `/videos/${id}/sections/62d98af5fb2c4643a4ff0b41/courses/62d84a469da35cd059b13024`,
                )
                .set('Authorization', `Bearer ${token}`)
                .expect(204);
            });
        });
    });

    it('/videos/:videoId/sections/:sectionId/courses/:courseId, should give forbidden resource error, section does not belong to the course', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(videos.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          return request(videos.getHttpServer())
            .delete(
              '/videos/62d96a833b623b7798535d23/sections/62d93434e96aad5f8dda6bb5/courses/62d84a469da35cd059b13024',
            )
            .set('Authorization', `Bearer ${token}`)
            .expect(403);
        });
    });

    it('/videos/:videoId/sections/:sectionId/courses/:courseId, should give a not found error, course does not exist', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(videos.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          return request(videos.getHttpServer())
            .delete(
              '/videos/63ad82cc45781acf362b0644/sections/63a704833c4c92da625286dc/courses/62d84a469da35cd059b130aa',
            )
            .set('Authorization', `Bearer ${token}`)
            .expect(404);
        });
    });

    it('/videos/:videoId/sections/:sectionId/courses/:courseId, should give forbidden resource error, video does not belong to the section', () => {
      const login = {
        username: 'admin',
        password: 'test1234',
      };
      return request(videos.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          return request(videos.getHttpServer())
            .delete(
              '/videos/62d96a833b623b7798535d23/sections/63a704833c4c92da625286dc/courses/62d84a469da35cd059b13024',
            )
            .set('Authorization', `Bearer ${token}`)
            .expect(403);
        });
    });

    it('/videos/:videoId/sections/:sectionId/courses/:courseId, should give forbidden resource error, signed user is not owner of the course', () => {
      const login = {
        username: 'instructor',
        password: 'test1234',
      };
      return request(videos.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          return request(videos.getHttpServer())
            .delete(
              '/videos/63ad82cc45781acf362b0644/sections/63a704833c4c92da625286dc/courses/62d84a469da35cd059b13024',
            )
            .set('Authorization', `Bearer ${token}`)
            .expect(403);
        });
    });

    it('/videos/:videoId/sections/:sectionId/courses/:courseId, should give forbidden resource error, user role has no permission to delete course', () => {
      const login = {
        username: 'user',
        password: 'test1234',
      };
      return request(videos.getHttpServer())
        .post('/auth/login')
        .send(login)
        .then((res) => {
          const token = res.body.token;
          return request(videos.getHttpServer())
            .delete(
              '/videos/63ad82cc45781acf362b0644/sections/63a704833c4c92da625286dc/courses/62d84a469da35cd059b13024',
            )
            .set('Authorization', `Bearer ${token}`)
            .expect(403);
        });
    });
  });
});
