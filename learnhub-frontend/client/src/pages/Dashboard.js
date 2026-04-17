import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { enrollAPI, progressAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    enrollAPI.getUserEnrollments('me').then(({ data }) => {
      setEnrollments(data.enrollments || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = enrollments.filter(e => {
    if (activeTab === 'completed') return e.progress?.progressPercentage === 100;
    if (activeTab === 'in-progress') return e.progress?.progressPercentage > 0 && e.progress?.progressPercentage < 100;
    if (activeTab === 'not-started') return !e.progress?.progressPercentage;
    return true;
  });

  const stats = {
    total: enrollments.length,
    completed: enrollments.filter(e => e.progress?.progressPercentage === 100).length,
    inProgress: enrollments.filter(e => e.progress?.progressPercentage > 0 && e.progress?.progressPercentage < 100).length,
    avgProgress: enrollments.length
      ? Math.round(enrollments.reduce((acc, e) => acc + (e.progress?.progressPercentage || 0), 0) / enrollments.length)
      : 0
  };

  if (loading) return <div className="page-wrapper"><LoadingSpinner fullscreen /></div>;

  return (
    <div className="page-wrapper">
      <div className="dashboard-page">
        <div className="dashboard-header">
          <div className="container">
            <div className="welcome-section">
              <div className="welcome-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
              <div>
                <h1 className="welcome-title">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
                <p className="welcome-sub">Continue your learning journey</p>
              </div>
            </div>

            <div className="stats-row">
              <div className="stat-box">
                <span className="stat-box-value">{stats.total}</span>
                <span className="stat-box-label">Enrolled</span>
              </div>
              <div className="stat-box">
                <span className="stat-box-value" style={{color:'var(--green)'}}>{stats.completed}</span>
                <span className="stat-box-label">Completed</span>
              </div>
              <div className="stat-box">
                <span className="stat-box-value" style={{color:'var(--yellow)'}}>{stats.inProgress}</span>
                <span className="stat-box-label">In Progress</span>
              </div>
              <div className="stat-box">
                <span className="stat-box-value" style={{color:'var(--blue)'}}>{stats.avgProgress}%</span>
                <span className="stat-box-label">Avg Progress</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container dashboard-body">
          <div className="dashboard-main">
            <div className="tabs-row">
              {[
                { key: 'all', label: `All (${enrollments.length})` },
                { key: 'in-progress', label: `In Progress (${stats.inProgress})` },
                { key: 'completed', label: `Completed (${stats.completed})` },
                { key: 'not-started', label: `Not Started (${enrollments.length - stats.inProgress - stats.completed})` },
              ].map(tab => (
                <button
                  key={tab.key}
                  className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📚</div>
                <h3>{activeTab === 'all' ? 'No courses enrolled yet' : 'No courses in this category'}</h3>
                <p>Browse our catalog and start learning today</p>
                <Link to="/courses" className="btn btn-primary" style={{marginTop:'16px'}}>Browse Courses</Link>
              </div>
            ) : (
              <div className="enrollment-list">
                {filtered.map(enrollment => {
                  const course = enrollment.course;
                  const pct = enrollment.progress?.progressPercentage || 0;
                  const completedCount = enrollment.progress?.completedLessons?.length || 0;
                  const totalLessons = course?.lessons?.length || 0;

                  return (
                    <div key={enrollment._id} className="enrollment-card card">
                      <div className="enrollment-thumbnail">
                        {course?.thumbnail ? (
                          <img src={course.thumbnail} alt={course.title} />
                        ) : (
                          <div className="enroll-thumb-placeholder">📚</div>
                        )}
                        {pct === 100 && <div className="completion-overlay">🏆</div>}
                      </div>
                      <div className="enrollment-info card-body">
                        <div className="enrollment-top">
                          <div>
                            <span className="badge badge-blue" style={{marginBottom:'8px'}}>{course?.category}</span>
                            <h3 className="enrollment-title">{course?.title}</h3>
                            <p className="enrollment-instructor">👤 {course?.instructor}</p>
                          </div>
                          <div className="enrollment-status">
                            {pct === 100 ? (
                              <span className="badge badge-green">✓ Completed</span>
                            ) : pct > 0 ? (
                              <span className="badge badge-yellow">⚡ In Progress</span>
                            ) : (
                              <span className="badge badge-mauve">◌ Not Started</span>
                            )}
                          </div>
                        </div>

                        <div className="enrollment-progress">
                          <div className="progress-meta flex-between">
                            <span className="progress-lessons">{completedCount}/{totalLessons} lessons done</span>
                            <span className="progress-pct-label">{pct}%</span>
                          </div>
                          <div className="progress-bar-container">
                            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                          </div>
                        </div>

                        <div className="enrollment-footer flex-between">
                          <span className="enrolled-date">
                            Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <Link to={`/courses/${course?._id}`} className="btn btn-primary btn-sm">
                            {pct === 100 ? 'Review Course' : pct > 0 ? 'Continue →' : 'Start Learning →'}
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
