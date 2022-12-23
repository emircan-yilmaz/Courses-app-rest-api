import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CourseService } from './courses.service';

@Injectable()
export class CoursesGuard implements CanActivate {
  constructor(private courseService: CourseService) {}

  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    const { id, courseId } = req.params;
    const idOfCourse = id || courseId;

    let course;
    try {
      course = await this.courseService.getCourse(idOfCourse);
    } catch (error) {
      throw new NotFoundException('Course not found');
    }

    if (!course.administrators.includes(req.user.id)) return false;

    return true;
  }
}
