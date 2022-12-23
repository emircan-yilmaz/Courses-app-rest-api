import { Document } from 'mongoose';

export interface CourseInterface extends Document {
  title: string;
  description: string;
  short_description: string;
  learn: string[];
  requirements: string[];
  preview: string;
  sections: string[];
  administrators: string[];
}
