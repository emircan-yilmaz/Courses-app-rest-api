import * as mongoose from 'mongoose';

const SectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  contents: [
    {
      type: {
        type: String,
        enum: ['video', 'article'],
      },
      ref_id: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
    },
  ],
});

export default SectionSchema;
