
import Course from '../models/Course.js';
import Progress from '../models/Progress.js';
import User from '../models/User.js';  // ADD THIS LINE
import { uploadToCloudinary, uploadThumbnail } from '../utils/cloudinary.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({});
const upload = multer({ storage });

export const createCourse = async (req, res) => {
  try {
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);

    const { title, description, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Thumbnail is required' });
    }

    // Upload to Cloudinary
    const thumbnailRes = await uploadThumbnail(req.file);

    const course = await Course.create({
      title,
      description,
      instructor: req.user._id,
      thumbnail: thumbnailRes.secure_url,
      category
    });

    res.status(201).json(course);
  } catch (err) {
    console.error('CREATE COURSE ERROR:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getCourses = async (req, res) => {
  const { search, category } = req.query;
  let query = {};

  if (search) query.title = { $regex: search, $options: 'i' };
  if (category) query.category = category;

  const courses = await Course.find(query)
    .populate('instructor', 'name')
    .select('-lessons');

  res.json(courses);
};

export const getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;

    // ADD THIS CHECK
    if (!courseId || courseId === 'undefined') {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    const course = await Course.findById(courseId)
      .populate('instructor', 'name avatar')
      .populate('ratings.user', 'name');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    let progress = null;
    if (req.user) {
      progress = await Progress.findOne({
        user: req.user._id,
        course: courseId
      });
    }

    res.json({ course, progress });
  } catch (err) {
    console.error('Get course error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    if (course.enrolledStudents.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already enrolled' });
    }

    // Enroll student
    course.enrolledStudents.push(req.user._id);
    await course.save();

    // Add course to user's enrolledCourses
    await User.findByIdAndUpdate(req.user._id, {
      $push: { enrolledCourses: course._id }
    });

    // Create progress entry
    await Progress.create({
      user: req.user._id,
      course: course._id,
      completedLessons: []
    });

    res.json({ message: 'Enrolled successfully' });
  } catch (err) {
    console.error('Enroll error:', err);
    res.status(500).json({ message: 'Failed to enroll', error: err.message });
  }
};

export const addLesson = async (req, res) => {
  try {
    const { title, description, isFree } = req.body;
    const { courseId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "Video file is required" });
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file);

    // IMPORTANT: use secure_url
    const videoUrl = uploadResult.secure_url;

    console.log("Saved video URL:", videoUrl); // DEBUG

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.lessons.push({
      title,
      description,
      isFree: isFree === "true",
      videoUrl
    });

    await course.save();

    res.json({
      message: "Lesson added successfully",
      course
    });

  } catch (err) {
    console.error("Add lesson error:", err);
    res.status(500).json({ message: "Failed to add lesson" });
  }
};


export const markLessonComplete = async (req, res) => {
  const { courseId, lessonId } = req.body;

  let progress = await Progress.findOne({
    user: req.user._id,
    course: courseId
  });

  if (!progress) {
    progress = await Progress.create({ user: req.user._id, course: courseId });
  }

  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
    progress.lastWatched = new Date();
    await progress.save();
  }

  res.json(progress);
};


/*
export const createCourse = async (req, res) => {
  try {
    const { title, description, category, lessonTitle, isFree } = req.body;

    // ---- Thumbnail ----
    if (!req.files?.thumbnail?.[0]) {
      return res.status(400).json({ message: 'Thumbnail required' });
    }
    const thumbRes = await uploadThumbnail(req.files.thumbnail[0]);

    // ---- Video (first lesson) ----
    if (!req.files?.video?.[0]) {
      return res.status(400).json({ message: 'Intro video required' });
    }
    const videoRes = await uploadToCloudinary(req.files.video[0]);

    const course = await Course.create({
      title,
      description,
      instructor: req.user._id,
      thumbnail: thumbRes.secure_url,
      category,
      lessons: [
        {
          title: lessonTitle || 'Introduction',
          videoUrl: videoRes.secure_url,
          duration: Math.round(videoRes.duration || 0),
          isFree: isFree === 'true',
        },
      ],
    });
    */