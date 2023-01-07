import { Test, TestingModule } from '@nestjs/testing';
import { jwtConstants } from '../../auth/constants';
import { MongooseModule } from '@nestjs/mongoose';
import generateString from '../../utils';
import { AuthModule } from '../../auth/auth.module';
import { VideosService } from '../videos.service';
import VideoSchema from '../schema/videos.schema';
import { CoursesModule } from '../../courses/courses.module';
import { SectionsModule } from '../../sections/sections.module';
import { forwardRef } from '@nestjs/common';
import { VideosRepository } from '../videos.repository';
import { VideosController } from '../videos.controller';
import { createVideoDto } from '../dto/create-video.dto';
import { updateVideoDto } from '../dto/update-vide.dto';

describe('VideoService', () => {
  let videoService: VideosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(jwtConstants.DATABASE),
        MongooseModule.forFeature([{ name: 'Video', schema: VideoSchema }]),
        forwardRef(() => SectionsModule),
        CoursesModule,
        AuthModule,
      ],
      controllers: [VideosController],
      providers: [VideosService, VideosRepository],
    }).compile();

    videoService = module.get<VideosService>(VideosService);
  });

  describe('Get Video', () => {
    it('should get video ', async () => {
      const id = '62d9738b3beb3d453b551fb1';
      const result = await videoService.getVideo(id);
      expect(result.id).toBe(id);
    });

    it('should not get video, video does not exist', async () => {
      const id = '62d9738b3beb3d453b551faa';
      let err = 0;
      try {
        await videoService.getVideo(id);
      } catch (error) {
        err = 1;
      }

      expect(err).toBe(1);
    });
  });

  describe('Create Video', () => {
    it('should create video', async () => {
      const sectionId = '63a7000cac5674882d2a5180';
      const videoInfo = generateString(5);
      const video: createVideoDto = {
        title: videoInfo,
        length: '3',
        link: 'link',
      };

      const result = await videoService.createVideo(sectionId, video);

      expect(result.title).toEqual(video.title);
    });

    it('should not create video, one of required fields is missing', async () => {
      const sectionId = '63a7000cac5674882d2a5180';
      const video: createVideoDto = {
        title: undefined,
        length: '3',
        link: 'link',
      };
      let err = 0;

      try {
        await videoService.createVideo(sectionId, video);
      } catch (error) {
        err = 1;
      }

      expect(err).toEqual(1);
    });
  });

  describe('Update Video', () => {
    it('should update video', async () => {
      const id = '63a71c363c4c92da62528715';
      const update: updateVideoDto = {
        title: 'neural networks',
      };

      const result = await videoService.updateVideo(id, update);
      expect(result.title).toEqual(update.title);
    });
  });

  describe('Delete Video', () => {
    it('should delete video', async () => {
      const sectionId = '63a7000cac5674882d2a5180';
      const videoInfo = generateString(5);
      const video: createVideoDto = {
        title: videoInfo,
        length: '3',
        link: 'link',
      };

      const result = await videoService.createVideo(sectionId, video);
      const deleted = await videoService.deleteVideo(result.id, sectionId);

      expect(deleted).toEqual(undefined);
    });
  });
});
