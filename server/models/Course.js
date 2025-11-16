import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
  duration: Number,
  isFree: { type: Boolean, default: false }
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  thumbnail: String,
  category: String,
  lessons: [lessonSchema],
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  ratings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String
  }]
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);