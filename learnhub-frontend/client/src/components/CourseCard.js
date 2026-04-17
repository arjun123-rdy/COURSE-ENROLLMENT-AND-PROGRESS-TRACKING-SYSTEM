import React from 'react';
import { Link } from 'react-router-dom';
import './CourseCard.css';

const levelColor = { Beginner: 'badge-green', Intermediate: 'badge-yellow', Advanced: 'badge-red' };
const categoryEmoji = {
  'Web Development': '🌐', 'Data Science': '📊', 'Mobile Development': '📱',
  'DevOps': '⚙️', 'Design': '🎨', 'Business': '💼', 'AI/ML': '🤖', 'Cybersecurity': '🔒'
};

export default function CourseCard({ course, enrolled, progress, onEnroll, enrolling }) {
  const pct = progress?.progressPercentage || 0;

  return (
    <div className="course-card card fade-in">
      <div className="course-thumbnail">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} />
        ) : (
          <div className="thumbnail-placeholder">
            <span>{categoryEmoji[course.category] || '📚'}</span>
          </div>
        )}
        <span className={`badge ${levelColor[course.level] || 'badge-blue'} level-badge`}>{course.level}</span>
        {enrolled && (
          <span className="enrolled-tag">✓ Enrolled</span>
        )}
      </div>

      <div className="course-card-body card-body">
        <div className="course-meta">
          <span className="course-category">{categoryEmoji[course.category]} {course.category}</span>
          <span className="course-rating">★ {course.rating?.toFixed(1) || '4.5'}</span>
        </div>

        <h3 className="course-title">{course.title}</h3>
        <p className="course-description">{course.description?.substring(0, 100)}...</p>

        <div className="course-instructor">
          <div className="instructor-avatar">{course.instructor?.charAt(0)}</div>
          <span>{course.instructor}</span>
        </div>

        <div className="course-stats">
          <span>📚 {course.lessons?.length || 0} lessons</span>
          <span>⏱ {course.duration}</span>
          <span>👥 {course.enrolledCount?.toLocaleString()}</span>
        </div>

        {enrolled && (
          <div className="progress-section">
            <div className="progress-header">
              <span>Progress</span>
              <span className="progress-pct">{pct}%</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
            </div>
            {pct === 100 && <span className="completed-badge">🎉 Completed!</span>}
          </div>
        )}

        <div className="course-footer">
          <div className="course-price">
            {course.price === 0 ? (
              <span className="price-free">Free</span>
            ) : (
              <span className="price">${course.price}</span>
            )}
          </div>
          <div className="course-actions">
            {enrolled ? (
              <Link to={`/courses/${course._id}`} className="btn btn-primary btn-sm">Continue →</Link>
            ) : (
              <>
                <Link to={`/courses/${course._id}`} className="btn btn-ghost btn-sm">View</Link>
                {onEnroll && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => onEnroll(course._id)}
                    disabled={enrolling}
                  >
                    {enrolling ? 'Enrolling...' : 'Enroll'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
