const express = require('express');
const router = express.Router();
const { enrollCourse, getUserEnrollments, unenrollCourse } = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, enrollCourse);
router.get('/:userId', protect, getUserEnrollments);
router.delete('/:courseId', protect, unenrollCourse);

module.exports = router;
