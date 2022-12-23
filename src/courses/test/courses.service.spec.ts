import { forwardRef } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { jwtConstants } from '../../auth/constants';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesModule } from '../courses.module';
import { CourseController } from '../courses.controller';
import { CourseService } from '../courses.service';

describe('CourseService', () => {
  let courseService: CourseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(jwtConstants.DATABASE),
        forwardRef(() => CoursesModule),
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

      expect(response._id).toEqual(id);
    });
  });

  //   describe('Sign up', () => {
  //     function generateString(length) {
  //       const characters =
  //         'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  //       let result = ' ';
  //       const charactersLength = characters.length;
  //       for (let i = 0; i < length; i++) {
  //         result += characters.charAt(
  //           Math.floor(Math.random() * charactersLength),
  //         );
  //       }

  //       return result;
  //     }

  //     it('should sign up user', async () => {
  //       const dto = {
  //         username: generateString(4),
  //         name: 'emir',
  //         surname: 'can',
  //         password: 'test1234',
  //         passwordConfirm: 'test1234',
  //       };
  //       expect(await authService.signUp(dto)).toStrictEqual({
  //         token: expect.any(String),
  //       });
  //     });
  //   });
});
