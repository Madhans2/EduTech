import Course from '../models/Course.js';
import Progress from '../models/Progress.js';
import User from '../models/User.js';
import { uploadToCloudinary, uploadThumbnail } from '../utils/cloudinary.js';
import multer from 'multer';

const storage = multer.memoryStorage(); // safer for cloud upload
const upload = multer({ storage });

// CREATE COURSE
export const createCourse = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!req.file) return res.status(400).json({ message: 'Thumbnail is required' });

    // Upload thumbnail to Cloudinary
    const thumbnailRes = await uploadThumbnail(req.file);

    const course = await Course.create({
      title,
      description,
      instructor: req.user._id,
      thumbnail: thumbnailRes.secure_url,
      category,
      lessons: [],
      enrolledStudents: [],
      ratings: [],
    });

    res.status(201).json(course);
  } catch (err) {
    console.error('CREATE COURSE ERROR:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET ALL COURSES
export const getCourses = async (req, res) => {
  try {
    const { search = '', category = '' } = req.query;
    const query = {};

    if (search) query.title = { $regex: search, $options: 'i' };
    if (category && category !== 'All') query.category = category;

    const courses = await Course.find(query)
      .populate('instructor', 'name')
      .select('-lessons');

    res.json(courses);
  } catch (err) {
    console.error('GET COURSES ERROR:', err);
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
};

// GET COURSE BY ID
export const getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    if (!courseId) return res.status(400).json({ message: 'Invalid course ID' });

    const course = await Course.findById(courseId)
      .populate('instructor', 'name avatar')
      .populate('ratings.user', 'name');

    if (!course) return res.status(404).json({ message: 'Course not found' });

    let progress = null;
    if (req.user) {
      progress = await Progress.findOne({ user: req.user._id, course: courseId });
    }

    res.json({ course, progress });
  } catch (err) {
    console.error('GET COURSE ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ENROLL IN COURSE
export const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.enrolledStudents.includes(req.user._id))
      return res.status(400).json({ message: 'Already enrolled' });

    // Add student to course
    course.enrolledStudents.push(req.user._id);
    await course.save();

    // Add course to user's enrolledCourses
    await User.findByIdAndUpdate(req.user._id, {
      $push: { enrolledCourses: course._id },
    });

    // Create initial progress
    await Progress.create({ user: req.user._id, course: course._id, completedLessons: [] });

    res.json({ message: 'Enrolled successfully' });
  } catch (err) {
    console.error('ENROLL ERROR:', err);
    res.status(500).json({ message: 'Failed to enroll', error: err.message });
  }
};

// ADD LESSON
export const addLesson = async (req, res) => {
  try {
    const { title, description, isFree } = req.body;
    const { courseId } = req.params;

    if (!req.file) return res.status(400).json({ message: 'Video file is required' });

    // Upload video to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file);
    const videoUrl = uploadResult.secure_url;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.lessons.push({
      title,
      description,
      isFree: isFree === 'true',
      videoUrl,
    });

    await course.save();
    res.json({ message: 'Lesson added successfully', course });
  } catch (err) {
    console.error('ADD LESSON ERROR:', err);
    res.status(500).json({ message: 'Failed to add lesson' });
  }
};

// MARK LESSON COMPLETE
export const markLessonComplete = async (req, res) => {
  try {
    const { courseId, lessonId } = req.body;

    let progress = await Progress.findOne({ user: req.user._id, course: courseId });
    if (!progress) {
      progress = await Progress.create({ user: req.user._id, course: courseId, completedLessons: [] });
    }

    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
      progress.lastWatched = new Date();
      await progress.save();
    }

    res.json(progress);
  } catch (err) {
    console.error('MARK LESSON COMPLETE ERROR:', err);
    res.status(500).json({ message: 'Failed to mark lesson complete' });
  }
};
