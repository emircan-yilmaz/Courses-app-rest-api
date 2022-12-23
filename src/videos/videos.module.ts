import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { CoursesModule } from '../courses/courses.module';
import { SectionsModule } from '../sections/sections.module';
import VideoSchema from './schema/videos.schema';
import { VideosController } from './videos.controller';
import { VideosGuard } from './videos.guard';
import { VideosRepository } from './videos.repository';
import { VideosService } from './videos.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Video', schema: VideoSchema }]),
    forwardRef(() => SectionsModule),
    CoursesModule,
    AuthModule,
  ],
  controllers: [VideosController],
  providers: [VideosService, VideosGuard, VideosRepository],
  exports: [VideosRepository],
})
export class VideosModule {}
