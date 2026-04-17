const Progress = require('../models/Progress');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Update lesson progress
// @route   PUT /api/progress/update
const updateProgress = async (req, res) => {
  try {
    const { courseId, lessonId } = req.body;
    const userId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    let progress = await Progress.findOne({ user: userId, course: courseId });
    if (!progress) {
      progress = await Progress.create({ user: userId, course: courseId });
    }

    // Add lesson if not already completed
    const alreadyCompleted = progress.completedLessons.some(
      (l) => l.lessonId.toString() === lessonId
    );

    if (!alreadyCompleted) {
      progress.completedLessons.push({ lessonId, completedAt: new Date() });
    }

    // Calculate percentage
    const totalLessons = course.lessons.length;
    const completedCount = progress.completedLessons.length;
    progress.progressPercentage = totalLessons > 0
      ? Math.round((completedCount / totalLessons) * 100)
      : 0;

    progress.lastAccessedAt = new Date();
    await progress.save();

    // If 100%, mark enrollment as completed
    if (progress.progressPercentage === 100) {
      await Enrollment.findOneAndUpdate(
        { user: userId, course: courseId },
        { status: 'completed', completedAt: new Date() }
      );
    }

    res.json({
      success: true,
      message: 'Progress updated',
      progress: {
        completedLessons: progress.completedLessons,
        progressPercentage: progress.progressPercentage,
        lastAccessedAt: progress.lastAccessedAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's progress for all courses
// @route   GET /api/progress/:userId
const getUserProgress = async (req, res) => {
  try {
    const userId = req.params.userId === 'me' ? req.user._id : req.params.userId;

    const progressList = await Progress.find({ user: userId })
      .populate('course', 'title thumbnail instructor category level lessons');

    res.json({ success: true, progress: progressList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get progress for a specific course
// @route   GET /api/progress/:userId/:courseId
const getCourseProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.params;

    const progress = await Progress.findOne({ user: userId, course: courseId });
    if (!progress) {
      return res.json({ success: true, progress: { progressPercentage: 0, completedLessons: [] } });
    }

    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { updateProgress, getUserProgress, getCourseProgress };
