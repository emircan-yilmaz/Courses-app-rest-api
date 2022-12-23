import { Document } from 'mongoose';
import { VideoInterface } from '../../videos/interface/videos.interface';

export interface SectionInterface extends Document {
  title: string;
  contents: {
    type: 'video' | 'article';
    ref_id: string;
    content?: VideoInterface;
  }[];
}
