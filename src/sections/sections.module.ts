import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { CoursesModule } from '../courses/courses.module';
import { VideosModule } from '../videos/videos.module';
import SectionSchema from './schema/sections.schema';
import { SectionController } from './sections.controller';
import { SectionsGuard } from './sections.guard';
import { SectionService } from './sections.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Section', schema: SectionSchema }]),
    CoursesModule,
    AuthModule,
    VideosModule,
  ],
  controllers: [SectionController],
  providers: [SectionService, SectionsGuard],
  exports: [SectionService],
})
export class SectionsModule {}
