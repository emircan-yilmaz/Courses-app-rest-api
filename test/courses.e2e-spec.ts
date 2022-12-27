import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CoursesModule } from '../src/courses/courses.module';
import { MongooseModule } from '@nestjs/mongoose';
import { jwtConstants } from '../src/auth/constants';
import CourseSchema from '../src/courses/schemas/courses.schema';
import generateString from '../src/utils';

describe('AppController (e2e)', () => {
  let courses: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(jwtConstants.DATABASE),
        MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema }]),
        CoursesModule,
      ],
    }).compile();

    courses = moduleFixture.createNestApplication();
    await courses.init();
  });

  describe('(GET)', () => {
    it('/courses', () => {
      return request(courses.getHttpServer()).get('/courses').expect(200);
    });

    it('/courses/:id', () => {
      return request(courses.getHttpServer())
        .get('/courses/62d933f8e96aad5f8dda6bb0')
        .expect(200);
    });

    it('/courses/:id, course does not exists, should give an error', () => {
      return request(courses.getHttpServer())
        .get('/courses/62d933f8e96aad5f8dda6baa')
        .expect(404);
    });
  });

  describe('(POST)', () => {
    it('/courses', () => {
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
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwibmFtZSI6ImVtaXIiLCJpYXQiOjE2NzIxNjY3MzQsImV4cCI6MTY3NzM1MDczNH0.y4ns75DDAf-xz_hCZl1ArEV3HL9HavDlwj0x4t3_MGo',
        )
        .send(course)
        .expect(201);
    });

    it('/courses, should give a forbidden request error, user role has no permission to create course', () => {
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
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIiLCJuYW1lIjoiZW1pcl91c2VyIiwiaWF0IjoxNjcyMTY2OTIxLCJleHAiOjE2NzczNTA5MjF9.EklBuX6FmFLq8ASp-BpC1-TSgzeWQcCy5W8Zpq_fICY',
        )
        .send(course)
        .expect(403);
    });

    it('/courses, should give a bad request error, one required field is missing', () => {
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
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwibmFtZSI6ImVtaXIiLCJpYXQiOjE2NzIxNjg3NjYsImV4cCI6MTY3NzM1Mjc2Nn0.KBeLKDhr1JK0fBQ7kAD_pqqKMX8AsdL8sjlGsVPHvsQ',
        )
        .send(course)
        .expect(400);
    });

    it('/course, should give a bad request error, one field type is wrong', () => {
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
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwibmFtZSI6ImVtaXIiLCJpYXQiOjE2NzIxNjg3NjYsImV4cCI6MTY3NzM1Mjc2Nn0.KBeLKDhr1JK0fBQ7kAD_pqqKMX8AsdL8sjlGsVPHvsQ',
        )
        .send(course)
        .expect(400);
    });
  });

  describe('(PATCH)', () => {
    it('/courses/:id', () => {
      const courseInfo = generateString(5);
      const course = {
        short_description: courseInfo,
      };

      return request(courses.getHttpServer())
        .patch('/courses/63ab5210aec858c8464aaf00')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwibmFtZSI6ImVtaXIiLCJpYXQiOjE2NzIxNzQ4MzQsImV4cCI6MTY3NzM1ODgzNH0.R9XaeIeKNcORlJ2uGbYjJqqVH4lFb9WLyro3aVM1yGI',
        )
        .send(course)
        .expect(200);
    });

    it('/courses/:id, should give a not found error, course does not exist', () => {
      const courseInfo = generateString(5);
      const course = {
        short_description: courseInfo,
      };

      return request(courses.getHttpServer())
        .patch('/courses/63ab5210aec858c8464aafaa')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwibmFtZSI6ImVtaXIiLCJpYXQiOjE2NzIxNjY3MzQsImV4cCI6MTY3NzM1MDczNH0.y4ns75DDAf-xz_hCZl1ArEV3HL9HavDlwj0x4t3_MGo',
        )
        .send(course)
        .expect(404);
    });

    it('/courses/:id, should give a forbidden resource error, user role has no permission to update course', () => {
      const courseInfo = generateString(5);
      const course = {
        short_description: courseInfo,
      };

      return request(courses.getHttpServer())
        .patch('/courses/63ab5210aec858c8464aaf00')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIiLCJuYW1lIjoiZW1pcl91c2VyIiwiaWF0IjoxNjcyMTc0NDUyLCJleHAiOjE2NzczNTg0NTJ9.WRLlhckGMwjU_7J-RSn1m4W9O9C9qQo6hRfCX_alinc',
        )
        .send(course)
        .expect(403);
    });

    it('/courses/:id, should give a bad request error, one field type is wrong', () => {
      const course = {
        short_description: 5555555555,
      };

      return request(courses.getHttpServer())
        .patch('/courses/63ab5210aec858c8464aaf00')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwibmFtZSI6ImVtaXIiLCJpYXQiOjE2NzIxNjY3MzQsImV4cCI6MTY3NzM1MDczNH0.y4ns75DDAf-xz_hCZl1ArEV3HL9HavDlwj0x4t3_MGo',
        )
        .send(course)
        .expect(400);
    });
  });

  describe('(DELETE)', () => {
    it('/courses/:id', () => {
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
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwibmFtZSI6ImVtaXIiLCJpYXQiOjE2NzIxNzQ4MzQsImV4cCI6MTY3NzM1ODgzNH0.R9XaeIeKNcORlJ2uGbYjJqqVH4lFb9WLyro3aVM1yGI',
        )
        .send(course)
        .then((res) => {
          const id = res.body._id.toString();
          return request(courses.getHttpServer())
            .delete(`/courses/${id}`)
            .set(
              'Authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwibmFtZSI6ImVtaXIiLCJpYXQiOjE2NzIxNzQ4MzQsImV4cCI6MTY3NzM1ODgzNH0.R9XaeIeKNcORlJ2uGbYjJqqVH4lFb9WLyro3aVM1yGI',
            )
            .expect(204);
        });
    });

    it('/courses/:id, should give a not found error, course does not exist', () => {
      return request(courses.getHttpServer())
        .delete('/courses/63ab5210aec858c8464aafaa')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwibmFtZSI6ImVtaXIiLCJpYXQiOjE2NzIxNjY3MzQsImV4cCI6MTY3NzM1MDczNH0.y4ns75DDAf-xz_hCZl1ArEV3HL9HavDlwj0x4t3_MGo',
        )
        .expect(404);
    });

    it('/courses/:id, should give a forbidden resource error, user role has no permission to delete course', () => {
      return request(courses.getHttpServer())
        .delete('/courses/63ab5210aec858c8464aaf00')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIiLCJuYW1lIjoiZW1pcl91c2VyIiwiaWF0IjoxNjcyMTc0NDUyLCJleHAiOjE2NzczNTg0NTJ9.WRLlhckGMwjU_7J-RSn1m4W9O9C9qQo6hRfCX_alinc',
        )
        .expect(403);
    });
  });
});
