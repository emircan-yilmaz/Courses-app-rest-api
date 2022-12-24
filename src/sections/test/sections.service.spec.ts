import { Test, TestingModule } from '@nestjs/testing';
import { jwtConstants } from '../../auth/constants';
import { MongooseModule } from '@nestjs/mongoose';
import generateString from '../../utils';
import { AuthModule } from '../../auth/auth.module';
import { SectionService } from '../sections.service';
import { CoursesModule } from '../../courses/courses.module';
import { SectionController } from '../sections.controller';
import SectionSchema from '../schema/sections.schema';
import { VideosRepository } from '../../videos/videos.repository';
import VideoSchema from '../../videos/schema/videos.schema';

describe('CourseService', () => {
  let sectionService: SectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(jwtConstants.DATABASE),
        MongooseModule.forFeature([{ name: 'Section', schema: SectionSchema }]),
        MongooseModule.forFeature([{ name: 'Video', schema: VideoSchema }]),
        AuthModule,
        CoursesModule,
      ],
      controllers: [SectionController],
      providers: [SectionService, VideosRepository],
      exports: [SectionService],
    }).compile();

    sectionService = module.get<SectionService>(SectionService);
  });

  describe('Get Section', () => {
    it('should get all sections of course', async () => {
      const courseId = '62d933f8e96aad5f8dda6bb0';
      const results = 3;
      const sections = await sectionService.getAllSectionsOfCourse(courseId);
      expect(sections.length).toEqual(results);
    });

    it('should not get sections, course id does not exist', async () => {
      const courseId = '62d933f8e96aad5f8dda6baa';
      let err = 0;
      try {
        await sectionService.getAllSectionsOfCourse(courseId);
      } catch (error) {
        err = 1;
      }

      expect(err).toEqual(1);
    });

    it('should get section', async () => {
      const id = '62d93434e96aad5f8dda6bb5';

      const response = await sectionService.getSection(id);

      expect(response.id).toEqual(id);
    });

    it('should not get section, section does not exist', async () => {
      const id = '62d93434e96aad5f8dda6baa';
      let err = 0;

      try {
        await sectionService.getSection(id);
      } catch (error) {
        err = 1;
      }

      expect(err).toEqual(1);
    });
  });

  describe('Create Section', () => {
    it('should create section', async () => {
      const courseId = '62d84a469da35cd059b13024';
      const title = generateString(6);

      const response = await sectionService.createSection(title, courseId);

      expect(response.title).toEqual(title);
    });

    it('should not create section, course does not exist', async () => {
      let err = 0;
      const courseId = '62d933f8e96aad5f8dda6baa';
      const title = 'sectionTitle';

      try {
        await sectionService.createSection(title, courseId);
      } catch (error) {
        err = 1;
      }
      expect(err).toEqual(1);
    });
  });

  describe('Update Section', () => {
    it('should update section', async () => {
      const sectionId = '63a704833c4c92da625286dc';
      const title = 'machine learning';
      const response = await sectionService.updateSection(sectionId, title);

      expect(response.title).toEqual(title);
    });

    it('should not update section, section does not exist', async () => {
      const sectionId = '62d93434e96aad5f8dda6baa';
      const title = generateString(5);

      const result = await sectionService.updateSection(sectionId, title);
      expect(result).toEqual(null);
    });
  });

  describe('Delete Section', () => {
    it('should delete section', async () => {
      const courseId = '62d84a469da35cd059b13024';
      const title = generateString(6);

      const response = await sectionService.createSection(title, courseId);
      const deleted = await sectionService.deleteSection(courseId, response.id);

      expect(deleted).toEqual(undefined);
    });
  });
});
