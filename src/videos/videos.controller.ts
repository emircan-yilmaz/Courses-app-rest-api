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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AllowedRoles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CoursesGuard } from '../courses/courses.guard';
import { SectionsGuard } from '../sections/sections.guard';
import { UserRoles } from '../users/roles.enum';
import { createVideoDto } from './dto/create-video.dto';
import { updateVideoDto } from './dto/update-vide.dto';
import { VideosGuard } from './videos.guard';
import { VideosService } from './videos.service';

@Controller('videos')
export class VideosController {
  constructor(private videoService: VideosService) {}

  @Get(':videoId')
  getVideo(@Param('videoId') videoId: string) {
    return this.videoService.getVideo(videoId);
  }

  @Post('sections/:sectionId/courses/:courseId')
  @HttpCode(201)
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard(), RolesGuard, CoursesGuard, SectionsGuard)
  @AllowedRoles([UserRoles.ADMIN, UserRoles.INSTRUCTOR])
  createVideo(
    @Body() video: createVideoDto,
    @Param('sectionId') sectionId: string,
  ) {
    return this.videoService.createVideo(sectionId, video);
  }

  @Patch(':videoId/sections/:sectionId/courses/:courseId')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard(), RolesGuard, CoursesGuard, SectionsGuard, VideosGuard)
  @AllowedRoles([UserRoles.ADMIN, UserRoles.INSTRUCTOR])
  updateVideo(@Body() update: updateVideoDto, @Param('videoId') id: string) {
    return this.videoService.updateVideo(id, update);
  }

  @Delete(':videoId/sections/:sectionId/courses/:courseId')
  @HttpCode(204)
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard(), RolesGuard, CoursesGuard, SectionsGuard, VideosGuard)
  @AllowedRoles([UserRoles.ADMIN, UserRoles.INSTRUCTOR])
  deleteVideo(
    @Param('videoId') videoId: string,
    @Param('sectionId') sectionId: string,
  ) {
    return this.videoService.deleteVideo(videoId, sectionId);
  }
}
