import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SectionService } from '../sections/sections.service';
import { createVideoDto } from './dto/create-video.dto';
import { updateVideoDto } from './dto/update-vide.dto';
import { VideoInterface } from './interface/videos.interface';

@Injectable()
export class VideosService {
  constructor(
    @InjectModel('Video') private Video: Model<VideoInterface>,
    private sectionService: SectionService,
  ) {}

  async createVideo(sectionId: string, video: createVideoDto) {
    const data = await this.Video.create(video);
    const videoId = data.id;
    await this.sectionService.createVideoForSection(sectionId, videoId);
    return data;
  }

  async getVideo(videoId: string) {
    const video = await this.Video.findById(videoId);
    if (!video) throw new NotFoundException();
    return video;
  }

  async updateVideo(id: string, update: updateVideoDto) {
    const data = this.Video.findByIdAndUpdate(id, update, { new: true });
    return data;
  }

  async deleteVideo(videoId: string, sectionId: string) {
    await this.sectionService.deleteVideoFromSection(videoId, sectionId);
    await this.Video.findByIdAndDelete(videoId);
  }
}
