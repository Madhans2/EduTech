import express from 'express';
import {
  createCourse,
  getCourses,
  getCourseById,
  enrollCourse,
  addLesson,
  markLessonComplete
} from '../controllers/courseController.js';
import { protect, instructor } from '../middleware/auth.js';
import multer from 'multer';

const router = express.Router();

// Multer: Store file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', getCourses);
router.get('/:id', protect, getCourseById);


// THUMBNAIL UPLOAD
router.post('/', protect, instructor, upload.single('thumbnail'), createCourse);

router.post('/:id/enroll', protect, enrollCourse);

// VIDEO UPLOAD
router.post('/:courseId/lessons', protect, instructor, upload.single('video'), addLesson);

router.post('/progress', protect, markLessonComplete);


export default router;

