import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CourseService } from '../courses/courses.service';
import { VideosRepository } from '../videos/videos.repository';
import { SectionInterface } from './interface/sections.interface';

@Injectable()
export class SectionService {
  constructor(
    @InjectModel('Section') private Section: Model<SectionInterface>,
    private courseService: CourseService,
    private videoRepository: VideosRepository,
  ) {}

  async getAllSectionsOfCourse(courseId: string) {
    return this.courseService.getAllSectionsOfCourse(courseId);
  }

  async createSection(title: string, courseId: string) {
    const section = await this.Section.create({ title });
    const sectionId = section.id;
    await this.courseService.createSectionForCourse(courseId, sectionId);
    return section;
  }

  async getSection(id: string) {
    const section = await this.Section.findById(id);
    if (!section) throw new NotFoundException();

    for (let i = 0; i < section.contents.length; i++) {
      const content = section.contents[i];
      if (content.type === 'video') {
        const video = await this.videoRepository.getVideo(content.ref_id);
        section.contents[i] = {
          ref_id: content.ref_id,
          type: 'video',
          content: video,
        };
      }
    }

    return section;
  }

  async updateSection(sectionId, title: string) {
    const section = await this.Section.findByIdAndUpdate(
      sectionId,
      { title },
      { new: true },
    );
    return section;
  }

  async deleteSection(courseId: string, sectionId: string) {
    await this.courseService.deleteSectionFromCourse(courseId, sectionId);

    const section = await this.Section.findById(sectionId);

    for (let i = 0; i < section.contents.length; i++) {
      const { ref_id, type } = section.contents[i];
      if (type === 'video') {
        await this.videoRepository.deleteVideo(ref_id);
      }
    }

    await this.Section.findByIdAndDelete(sectionId);
  }

  async createVideoForSection(sectionId: string, videoId: string) {
    const section = await this.Section.findById(sectionId);
    section.contents.push({
      type: 'video',
      ref_id: videoId,
    });
    await section.save();
  }

  async deleteVideoFromSection(videoId: string, sectionId: string) {
    const section = await this.Section.findById(sectionId);
    const videoIndex = section.contents.findIndex(
      (el) => el.ref_id.toString() === videoId.toString(),
    );
    section.contents.splice(videoIndex, 1);
    await section.save();
  }
}
