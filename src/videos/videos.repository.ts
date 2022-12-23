import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VideoInterface } from './interface/videos.interface';

@Injectable()
export class VideosRepository {
  constructor(@InjectModel('Video') private Video: Model<VideoInterface>) {}

  async getVideo(id: string) {
    return await this.Video.findById(id);
  }

  async deleteVideo(id: string) {
    await this.Video.findByIdAndDelete(id);
  }
}
