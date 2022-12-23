import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AllowedRoles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CoursesGuard } from '../courses/courses.guard';
import { UserRoles } from '../users/roles.enum';
import { SectionsGuard } from './sections.guard';
import { SectionService } from './sections.service';

@Controller('sections')
export class SectionController {
  constructor(private sectionService: SectionService) {}

  @Get('courses/:courseId')
  getAllSectionsOfCourse(@Param('courseId') courseId: string) {
    return this.sectionService.getAllSectionsOfCourse(courseId);
  }

  @Post('courses/:courseId')
  @HttpCode(201)
  @UseGuards(AuthGuard(), RolesGuard, CoursesGuard)
  @AllowedRoles([UserRoles.ADMIN, UserRoles.INSTRUCTOR])
  createSection(
    @Body('title') title: string,
    @Param('courseId') courseId: string,
  ) {
    return this.sectionService.createSection(title, courseId);
  }

  @Get(':sectionId')
  getSection(@Param('sectionId') id: string) {
    return this.sectionService.getSection(id);
  }

  @Patch(':sectionId/courses/:courseId')
  @UseGuards(AuthGuard(), RolesGuard, CoursesGuard, SectionsGuard)
  @AllowedRoles([UserRoles.ADMIN, UserRoles.INSTRUCTOR])
  updateSection(
    @Body('title') title: string,
    @Param('sectionId') sectionId: string,
  ) {
    return this.sectionService.updateSection(sectionId, title);
  }

  @Delete(':sectionId/courses/:courseId')
  @HttpCode(204)
  @UseGuards(AuthGuard(), RolesGuard, CoursesGuard, SectionsGuard)
  @AllowedRoles([UserRoles.ADMIN, UserRoles.INSTRUCTOR])
  deleteSection(
    @Param('courseId') courseId: string,
    @Param('sectionId') sectionId: string,
  ) {
    return this.sectionService.deleteSection(courseId, sectionId);
  }
}
