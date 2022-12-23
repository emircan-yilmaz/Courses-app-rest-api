import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CourseService } from '../courses/courses.service';

@Injectable()
export class SectionsGuard implements CanActivate {
  constructor(private courseService: CourseService) {}

  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    const { sectionId, courseId } = req.params;

    const course = await this.courseService.getCourse(courseId);
    const index = course.sections.findIndex(
      (el) => el.toString() === sectionId.toString(),
    );

    if (index === -1) return false;

    return true;
  }
}
