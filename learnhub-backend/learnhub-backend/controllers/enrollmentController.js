const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Progress = require('../models/Progress');

// @desc    Enroll in a course
// @route   POST /api/enroll
const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check duplicate enrollment
    const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (existingEnrollment) {
      return res.status(409).json({ success: false, message: 'Already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({ user: userId, course: courseId });

    // Create initial progress record
    await Progress.create({
      user: userId,
      course: courseId,
      completedLessons: [],
      progressPercentage: 0
    });

    // Increment enrolled count
    await Course.findByIdAndUpdate(courseId, { $inc: { enrolledCount: 1 } });

    const populated = await enrollment.populate('course', 'title description thumbnail instructor category level');

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course',
      enrollment: populated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user enrollments
// @route   GET /api/enroll/:userId
const getUserEnrollments = async (req, res) => {
  try {
    const userId = req.params.userId === 'me' ? req.user._id : req.params.userId;

    const enrollments = await Enrollment.find({ user: userId, status: { $ne: 'dropped' } })
      .populate('course', 'title description thumbnail instructor category level duration lessons rating')
      .sort({ enrolledAt: -1 });

    // Get progress for each enrollment
    const enrollmentsWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const progress = await Progress.findOne({ user: userId, course: enrollment.course._id });
        return {
          ...enrollment.toObject(),
          progress: progress || { progressPercentage: 0, completedLessons: [] }
        };
      })
    );

    res.json({
      success: true,
      count: enrollments.length,
      enrollments: enrollmentsWithProgress
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Unenroll from a course
// @route   DELETE /api/enroll/:courseId
const unenrollCourse = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOneAndUpdate(
      { user: req.user._id, course: req.params.courseId },
      { status: 'dropped' },
      { new: true }
    );

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    res.json({ success: true, message: 'Successfully unenrolled from course' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { enrollCourse, getUserEnrollments, unenrollCourse };
