import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AllowedRoles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserInterface } from '../users/interface/users.interface';
import { UserRoles } from '../users/roles.enum';
import { CoursesGuard } from './courses.guard';
import { CourseService } from './courses.service';
import { createCourseDto } from './dto/create-course.dto';
import { updateCourseDto } from './dto/update-course.dto';

@Controller('courses')
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Get()
  getAllCourses() {
    return this.courseService.getAllCourses();
  }

  @Post()
  @HttpCode(201)
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard(), RolesGuard)
  @AllowedRoles([UserRoles.ADMIN, UserRoles.INSTRUCTOR])
  createCourse(
    @Body() course: createCourseDto,
    @Req() req: { user: UserInterface },
  ) {
    return this.courseService.createCourse(course, req.user.id);
  }

  @Get(':id')
  getCourse(@Param('id') id: string) {
    return this.courseService.getCourse(id);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard(), RolesGuard, CoursesGuard)
  @AllowedRoles([UserRoles.ADMIN, UserRoles.INSTRUCTOR])
  updateCourse(@Param('id') id: string, @Body() update: updateCourseDto) {
    return this.courseService.updateCourse(id, update);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AuthGuard(), RolesGuard, CoursesGuard)
  @AllowedRoles([UserRoles.ADMIN, UserRoles.INSTRUCTOR])
  deleteCourse(@Param('id') id: string) {
    return this.courseService.deleteCourse(id);
  }
}
