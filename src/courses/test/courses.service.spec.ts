import { forwardRef } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { jwtConstants } from '../../auth/constants';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesModule } from '../courses.module';
import { CourseController } from '../courses.controller';
import { CourseService } from '../courses.service';
import CourseSchema from '../schemas/courses.schema';
import { PassportModule } from '@nestjs/passport';
import generateString from '../../utils';

describe('CourseService', () => {
  let courseService: CourseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(jwtConstants.DATABASE),
        MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema }]),
        forwardRef(() => CoursesModule),
        PassportModule.register({
          defaultStrategy: 'jwt',
        }),
      ],
      controllers: [CourseController],
      providers: [CourseService],
    }).compile();

    courseService = module.get<CourseService>(CourseService);
  });

  describe('Get Course', () => {
    it('should get course', async () => {
      const id = '62d933f8e96aad5f8dda6bb0';

      const response = await courseService.getCourse(id);

      expect(response.id).toEqual(id);
    });

    it('should not get a course, course id does not exist', async () => {
      const id = '62d933f8e96aad5f8dda6ba8';
      let err = 0;
      try {
        await courseService.getCourse(id);
      } catch (error) {
        err = 1;
      }

      expect(err).toEqual(1);
    });

    it('should get all courses', async () => {
      const response = await courseService.getAllCourses();

      expect(response.results).toEqual(response.courses.length);
    });
  });

  describe('Create Course', () => {
    it('should create course', async () => {
      const ownerId = '62d7be9e541181ece66edea8';
      const courseInfo = generateString(5);
      const course = {
        title: courseInfo,
        description: courseInfo,
        short_description: 'Hello',
        learn: ['web'],
        requirements: ['pc'],
        preview: 'link',
      };
      const response = await courseService.createCourse(course, ownerId);
      const control = {
        title: response.title,
        admin: response.administrators[0].toString(),
      };
      expect(control).toStrictEqual({
        title: course.title,
        admin: ownerId,
      });
    });
    it('should not create course, one required area is missing', async () => {
      let err = 0;
      const courseInfo = generateString(5);
      const course = {
        title: undefined,
        description: courseInfo,
        short_description: 'Hello',
        learn: ['web'],
        requirements: ['pc'],
        preview: 'link',
      };
      const ownerId = '62d7be9e541181ece66edea8';
      try {
        await courseService.createCourse(course, ownerId);
      } catch (error) {
        err = 1;
      }
      expect(err).toEqual(1);
    });
  });

  describe('Update Course', () => {
    it('should update course', async () => {
      const courseId = '63a5f337b5520426ebf45971';
      const courseInfo = generateString(5);
      const update = {
        description: courseInfo,
      };
      const response = await courseService.updateCourse(courseId, update);
      const control = {
        id: response.id,
        description: response.description,
      };
      expect(control).toStrictEqual({
        id: courseId,
        description: update.description,
      });
    });

    it('should not update course, course id does not exist', async () => {
      const id = '63a5f337b5520426ebf459aa';
      const courseInfo = generateString(5);
      const update = {
        description: courseInfo,
      };

      const result = await courseService.updateCourse(id, update);
      expect(result).toEqual(null);
    });
  });

  describe('Delete Course', () => {
    it('should delete course', async () => {
      const ownerId = '62d7be9e541181ece66edea8';
      const courseInfo = generateString(5);
      const course = {
        title: courseInfo,
        description: courseInfo,
        short_description: 'Hello',
        learn: ['web'],
        requirements: ['pc'],
        preview: 'link',
      };
      const response = await courseService.createCourse(course, ownerId);

      const deleted = await courseService.deleteCourse(response.id);

      expect(deleted).toBe(undefined);
    });
  });
});
