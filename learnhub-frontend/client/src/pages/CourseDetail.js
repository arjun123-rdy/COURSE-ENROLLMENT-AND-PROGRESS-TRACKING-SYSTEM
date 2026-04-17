import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { courseAPI, enrollAPI, progressAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import './CourseDetail.css';

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [progress, setProgress] = useState({ progressPercentage: 0, completedLessons: [] });
  const [updatingLesson, setUpdatingLesson] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const { data } = await courseAPI.getOne(id);
      setCourse(data.course);

      if (user) {
        const enrollRes = await enrollAPI.getUserEnrollments('me');
        const isEnrolled = enrollRes.data.enrollments.some(e => e.course._id === id);
        setEnrolled(isEnrolled);

        if (isEnrolled) {
          const progRes = await progressAPI.getUserProgress('me');
          const cp = progRes.data.progress.find(p => p.course?._id === id);
          if (cp) setProgress(cp);
        }
      }
    } catch {
      toast.error('Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) { navigate('/login'); return; }
    setEnrolling(true);
    try {
      await enrollAPI.enroll(id);
      setEnrolled(true);
      toast.success('Enrolled successfully! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  const handleLessonComplete = async (lessonId) => {
    if (!enrolled) return;
    setUpdatingLesson(lessonId);
    try {
      const { data } = await progressAPI.update(id, lessonId);
      setProgress(data.progress);
      if (data.progress.progressPercentage === 100) {
        toast.success('🎉 Course completed! Congratulations!');
      } else {
        toast.success('Lesson marked as complete ✓');
      }
    } catch {
      toast.error('Failed to update progress');
    } finally {
      setUpdatingLesson(null);
    }
  };

  const isLessonCompleted = (lessonId) =>
    progress.completedLessons?.some(l => l.lessonId === lessonId || l.lessonId?._id === lessonId || l.lessonId?.toString() === lessonId);

  if (loading) return <div className="page-wrapper"><LoadingSpinner fullscreen /></div>;
  if (!course) return <div className="page-wrapper"><div className="container"><h2>Course not found</h2></div></div>;

  const typeIcon = { video: '🎬', reading: '📖', quiz: '❓' };
  const pct = progress.progressPercentage || 0;

  return (
    <div className="page-wrapper">
      <div className="course-detail-page">
        {/* Hero */}
        <div className="course-hero">
          <div className="container">
            <div className="course-hero-content">
              <div className="course-hero-left">
                <div className="breadcrumb">
                  <Link to="/courses">Courses</Link> / <span>{course.category}</span>
                </div>
                <h1 className="course-hero-title">{course.title}</h1>
                <p className="course-hero-desc">{course.description}</p>

                <div className="course-hero-meta">
                  <span>⭐ {course.rating}</span>
                  <span>👥 {course.enrolledCount?.toLocaleString()} students</span>
                  <span>📚 {course.lessons?.length} lessons</span>
                  <span>⏱ {course.duration}</span>
                </div>

                <div className="course-instructor-row">
                  <div className="instructor-avatar-lg">{course.instructor?.charAt(0)}</div>
                  <div>
                    <div style={{fontSize:'13px',color:'var(--subtext0)'}}>Instructor</div>
                    <div style={{fontWeight:'600'}}>{course.instructor}</div>
                  </div>
                </div>

                <div className="course-tags">
                  {course.tags?.map(tag => (
                    <span key={tag} className="badge badge-blue">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="course-hero-right">
                <div className="course-enroll-card card">
                  {course.thumbnail && <img src={course.thumbnail} alt={course.title} className="enroll-card-img" />}
                  <div className="card-body">
                    <div className="enroll-price">
                      {course.price === 0 ? <span className="price-free">Free</span> : <span className="price-tag">${course.price}</span>}
                    </div>

                    {enrolled ? (
                      <div className="enrolled-status">
                        <div className="progress-section" style={{marginBottom:'16px'}}>
                          <div className="progress-header flex-between" style={{marginBottom:'6px'}}>
                            <span style={{fontSize:'14px',color:'var(--subtext0)'}}>Your Progress</span>
                            <span style={{fontWeight:'700',color:'var(--blue)'}}>{pct}%</span>
                          </div>
                          <div className="progress-bar-container">
                            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                        <div className="badge badge-green" style={{width:'100%',justifyContent:'center',padding:'10px'}}>
                          ✓ You are enrolled
                        </div>
                        {pct === 100 && (
                          <div className="badge badge-yellow" style={{width:'100%',justifyContent:'center',padding:'10px',marginTop:'8px'}}>
                            🏆 Course Completed!
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        className="btn btn-primary btn-full btn-lg"
                        onClick={handleEnroll}
                        disabled={enrolling}
                      >
                        {enrolling ? <><span className="spinner spinner-sm" /> Enrolling...</> : 'Enroll Now — It\'s Free'}
                      </button>
                    )}

                    <ul className="enroll-perks">
                      <li>✓ Lifetime access</li>
                      <li>✓ Certificate of completion</li>
                      <li>✓ {course.lessons?.length} on-demand lessons</li>
                      <li>✓ Access on mobile & desktop</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lessons */}
        <div className="container course-detail-body">
          <div className="lessons-section">
            <h2 className="section-title">Course Curriculum</h2>
            <p className="section-subtitle">{course.lessons?.length} lessons · {course.duration}</p>

            <div className="lessons-list">
              {course.lessons?.map((lesson, idx) => {
                const completed = isLessonCompleted(lesson._id);
                return (
                  <div key={lesson._id} className={`lesson-item ${completed ? 'completed' : ''}`}>
                    <div className="lesson-num">{completed ? '✓' : idx + 1}</div>
                    <div className="lesson-info">
                      <span className="lesson-type">{typeIcon[lesson.type]}</span>
                      <div>
                        <div className="lesson-title">{lesson.title}</div>
                        <div className="lesson-desc">{lesson.description}</div>
                      </div>
                    </div>
                    <div className="lesson-right">
                      <span className="lesson-duration">{lesson.duration} min</span>
                      {enrolled && !completed && (
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleLessonComplete(lesson._id)}
                          disabled={updatingLesson === lesson._id}
                        >
                          {updatingLesson === lesson._id ? '...' : 'Mark Done'}
                        </button>
                      )}
                      {completed && <span className="lesson-done-badge">Done ✓</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
