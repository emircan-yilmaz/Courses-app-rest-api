import * as mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  short_description: {
    type: String,
    required: true,
  },
  learn: [String],
  requirements: [String],
  preview: String,
  sections: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Section',
    },
  ],
  administrators: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  ],
});

export default CourseSchema;
