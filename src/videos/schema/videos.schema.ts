import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  length: {
    type: String,
    required: true,
  },
  extra: {
    type: String,
  },
});

export default VideoSchema;
