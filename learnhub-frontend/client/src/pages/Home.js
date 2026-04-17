import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../services/api';
import CourseCard from '../components/CourseCard';
import LoadingSpinner from '../components/LoadingSpinner';
import './Home.css';

const stats = [
  { icon: '📚', value: '50+', label: 'Courses' },
  { icon: '👥', value: '10K+', label: 'Students' },
  { icon: '🏆', value: '98%', label: 'Satisfaction' },
  { icon: '🎓', value: '500+', label: 'Graduates' },
];

const features = [
  { icon: '🎯', title: 'Learn at Your Pace', desc: 'Access course content anytime, anywhere. No deadlines.' },
  { icon: '📊', title: 'Track Your Progress', desc: 'Visualize your learning journey with detailed progress bars.' },
  { icon: '🏅', title: 'Earn Certificates', desc: 'Complete courses and earn shareable certificates.' },
  { icon: '💬', title: 'Expert Instructors', desc: 'Learn from industry professionals with real experience.' },
];

export default function Home() {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseAPI.getAll({ limit: 3 }).then(({ data }) => {
      setFeaturedCourses(data.courses || []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrapper">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb orb-1" />
          <div className="hero-orb orb-2" />
          <div className="hero-orb orb-3" />
          <div className="hero-grid" />
        </div>
        <div className="container hero-content">
          <div className="hero-badge">
            <span className="badge badge-blue">✨ New courses added weekly</span>
          </div>
          <h1 className="hero-title">
            Unlock Your<br />
            <span className="gradient-text">Learning Potential</span>
          </h1>
          <p className="hero-subtitle">
            Master in-demand skills with expert-led courses. Track your progress,
            earn certificates, and transform your career.
          </p>
          <div className="hero-actions">
            <Link to="/courses" className="btn btn-primary btn-lg">Browse Courses →</Link>
            <Link to="/register" className="btn btn-ghost btn-lg">Get Started Free</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div key={i} className="stat-card">
                <span className="stat-icon">{s.icon}</span>
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured Courses</h2>
              <p className="section-subtitle">Start your learning journey with our top-rated courses</p>
            </div>
            <Link to="/courses" className="btn btn-ghost">View All →</Link>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading courses..." />
          ) : (
            <div className="courses-grid">
              {featuredCourses.map(course => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="section features-section">
        <div className="container">
          <h2 className="section-title" style={{textAlign:'center'}}>Why Choose LearnHub?</h2>
          <p className="section-subtitle" style={{textAlign:'center'}}>Everything you need to level up your skills</p>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <span className="feature-icon">{f.icon}</span>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-bg" />
            <h2 className="cta-title">Ready to Start Learning?</h2>
            <p className="cta-subtitle">Join thousands of learners already growing their skills</p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-primary btn-lg">Create Free Account</Link>
              <Link to="/courses" className="btn btn-ghost btn-lg">Explore Courses</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
