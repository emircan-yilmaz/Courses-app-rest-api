import { Document } from 'mongoose';

export interface VideoInterface extends Document {
  title: string;
  link: string;
  length: string;
  extra?: string;
}
