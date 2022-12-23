import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './../auth/auth.module';
import { CourseController } from './courses.controller';
import { CoursesGuard } from './courses.guard';
import { CourseService } from './courses.service';
import CourseSchema from './schemas/courses.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema }]),
    AuthModule,
  ],
  controllers: [CourseController],
  providers: [CourseService, CoursesGuard],
  exports: [CourseService, CoursesGuard],
})
export class CoursesModule {}
