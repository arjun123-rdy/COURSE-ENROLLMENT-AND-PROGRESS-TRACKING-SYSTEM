import React, { useState, useEffect, useCallback } from 'react';
import { courseAPI, enrollAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import './Courses.css';

const CATEGORIES = ['All', 'Web Development', 'Data Science', 'Mobile Development', 'DevOps', 'Design', 'Business', 'AI/ML', 'Cybersecurity'];
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function Courses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [enrollingId, setEnrollingId] = useState(null);
  const [filters, setFilters] = useState({ category: '', level: '', search: '' });
  const [searchInput, setSearchInput] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: pagination.page, limit: 9 };
      if (filters.category) params.category = filters.category;
      if (filters.level) params.level = filters.level;
      if (filters.search) params.search = filters.search;
      const { data } = await courseAPI.getAll(params);
      setCourses(data.courses || []);
      setPagination(p => ({ ...p, pages: data.pages, total: data.total }));
    } catch {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page]);

  useEffect(() => { fetchCourses(); }, [filters, pagination.page]);

  useEffect(() => {
    if (user) {
      enrollAPI.getUserEnrollments('me').then(({ data }) => {
        setEnrolledIds(new Set(data.enrollments.map(e => e.course._id)));
      }).catch(() => {});
    }
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(f => ({ ...f, search: searchInput }));
    setPagination(p => ({ ...p, page: 1 }));
  };

  const handleFilter = (key, value) => {
    setFilters(f => ({ ...f, [key]: value === 'All' ? '' : value }));
    setPagination(p => ({ ...p, page: 1 }));
  };

  const handleEnroll = async (courseId) => {
    if (!user) { toast.error('Please login to enroll'); return; }
    setEnrollingId(courseId);
    try {
      await enrollAPI.enroll(courseId);
      setEnrolledIds(prev => new Set([...prev, courseId]));
      toast.success('Successfully enrolled! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="courses-page">
        <div className="courses-header">
          <div className="container">
            <h1 className="section-title">Explore Courses</h1>
            <p className="section-subtitle">{pagination.total} courses to help you grow</p>

            <form className="search-bar" onSubmit={handleSearch}>
              <input
                type="text"
                className="form-input search-input"
                placeholder="Search courses, topics, instructors..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">Search</button>
            </form>
          </div>
        </div>

        <div className="container courses-body">
          {/* Filters */}
          <aside className="filters-sidebar">
            <div className="filter-section">
              <h4 className="filter-title">Category</h4>
              <div className="filter-options">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    className={`filter-btn ${(filters.category === cat || (!filters.category && cat === 'All')) ? 'active' : ''}`}
                    onClick={() => handleFilter('category', cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-section">
              <h4 className="filter-title">Level</h4>
              <div className="filter-options">
                {LEVELS.map(lvl => (
                  <button
                    key={lvl}
                    className={`filter-btn ${(filters.level === lvl || (!filters.level && lvl === 'All')) ? 'active' : ''}`}
                    onClick={() => handleFilter('level', lvl)}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Course Grid */}
          <main className="courses-main">
            {loading ? (
              <LoadingSpinner text="Loading courses..." />
            ) : courses.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <h3>No courses found</h3>
                <p>Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <>
                <div className="courses-grid">
                  {courses.map(course => (
                    <CourseCard
                      key={course._id}
                      course={course}
                      enrolled={enrolledIds.has(course._id)}
                      onEnroll={handleEnroll}
                      enrolling={enrollingId === course._id}
                    />
                  ))}
                </div>

                {pagination.pages > 1 && (
                  <div className="pagination">
                    <button
                      className="btn btn-ghost btn-sm"
                      disabled={pagination.page === 1}
                      onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                    >← Prev</button>
                    <span className="page-info">Page {pagination.page} of {pagination.pages}</span>
                    <button
                      className="btn btn-ghost btn-sm"
                      disabled={pagination.page === pagination.pages}
                      onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                    >Next →</button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
