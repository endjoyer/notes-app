import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  position: {
    type: Number,
    required: true,
  },
});

export default mongoose.models.Note || mongoose.model('Note', noteSchema);
