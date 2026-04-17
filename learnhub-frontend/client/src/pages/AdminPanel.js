import React, { useState, useEffect } from 'react';
import { courseAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import './AdminPanel.css';

const CATEGORIES = ['Web Development', 'Data Science', 'Mobile Development', 'DevOps', 'Design', 'Business', 'AI/ML', 'Cybersecurity'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const EMPTY_FORM = {
  title: '', description: '', instructor: '', category: 'Web Development',
  level: 'Beginner', price: 0, duration: '', thumbnail: '', tags: '',
  lessons: [{ title: '', description: '', duration: 10, order: 1, type: 'video' }]
};

export default function AdminPanel() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchCourses = async () => {
    try {
      const { data } = await courseAPI.getAll({ limit: 100 });
      setCourses(data.courses || []);
    } catch { toast.error('Failed to load courses'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCourses(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (course) => {
    setEditing(course._id);
    setForm({
      ...course,
      tags: course.tags?.join(', ') || '',
      lessons: course.lessons?.length ? course.lessons : EMPTY_FORM.lessons
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course? This cannot be undone.')) return;
    try {
      await courseAPI.delete(id);
      setCourses(c => c.filter(x => x._id !== id));
      toast.success('Course deleted');
    } catch { toast.error('Failed to delete course'); }
  };

  const handleLessonChange = (idx, field, value) => {
    const lessons = [...form.lessons];
    lessons[idx] = { ...lessons[idx], [field]: value };
    setForm(f => ({ ...f, lessons }));
  };

  const addLesson = () => {
    setForm(f => ({
      ...f,
      lessons: [...f.lessons, { title: '', description: '', duration: 10, order: f.lessons.length + 1, type: 'video' }]
    }));
  };

  const removeLesson = (idx) => {
    setForm(f => ({ ...f, lessons: f.lessons.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: typeof form.tags === 'string' ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : form.tags,
        price: Number(form.price),
      };
      if (editing) {
        const { data } = await courseAPI.update(editing, payload);
        setCourses(c => c.map(x => x._id === editing ? data.course : x));
        toast.success('Course updated!');
      } else {
        const { data } = await courseAPI.create(payload);
        setCourses(c => [data.course, ...c]);
        toast.success('Course created!');
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="admin-page">
        <div className="admin-header">
          <div className="container flex-between">
            <div>
              <h1 className="section-title">⚙️ Admin Panel</h1>
              <p className="section-subtitle" style={{margin:0}}>Manage courses and content</p>
            </div>
            <button className="btn btn-primary" onClick={openCreate}>+ Add Course</button>
          </div>
        </div>

        <div className="container admin-body">
          {loading ? <LoadingSpinner text="Loading..." /> : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Category</th>
                    <th>Level</th>
                    <th>Lessons</th>
                    <th>Enrolled</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map(course => (
                    <tr key={course._id}>
                      <td>
                        <div className="table-course-title">{course.title}</div>
                        <div className="table-course-instructor">{course.instructor}</div>
                      </td>
                      <td><span className="badge badge-blue">{course.category}</span></td>
                      <td><span className={`badge ${course.level === 'Beginner' ? 'badge-green' : course.level === 'Intermediate' ? 'badge-yellow' : 'badge-red'}`}>{course.level}</span></td>
                      <td>{course.lessons?.length || 0}</td>
                      <td>{course.enrolledCount?.toLocaleString()}</td>
                      <td>{course.price === 0 ? <span style={{color:'var(--green)'}}>Free</span> : `$${course.price}`}</td>
                      <td>
                        <div className="flex gap-1">
                          <button className="btn btn-ghost btn-sm" onClick={() => openEdit(course)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(course._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal admin-modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">{editing ? 'Edit Course' : 'Add New Course'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Title *</label>
                      <input className="form-input" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Instructor *</label>
                      <input className="form-input" value={form.instructor} onChange={e => setForm(f => ({...f, instructor: e.target.value}))} required />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description *</label>
                    <textarea className="form-textarea" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} required />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select className="form-select" value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}>
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Level</label>
                      <select className="form-select" value={form.level} onChange={e => setForm(f => ({...f, level: e.target.value}))}>
                        {LEVELS.map(l => <option key={l}>{l}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Price ($)</label>
                      <input type="number" className="form-input" value={form.price} min="0" onChange={e => setForm(f => ({...f, price: e.target.value}))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Duration (e.g. "20 hours")</label>
                      <input className="form-input" value={form.duration} onChange={e => setForm(f => ({...f, duration: e.target.value}))} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Thumbnail URL</label>
                    <input className="form-input" value={form.thumbnail} onChange={e => setForm(f => ({...f, thumbnail: e.target.value}))} placeholder="https://..." />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tags (comma-separated)</label>
                    <input className="form-input" value={form.tags} onChange={e => setForm(f => ({...f, tags: e.target.value}))} placeholder="React, JavaScript, Frontend" />
                  </div>

                  <div className="form-group">
                    <div className="flex-between" style={{marginBottom:'10px'}}>
                      <label className="form-label" style={{margin:0}}>Lessons</label>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={addLesson}>+ Add Lesson</button>
                    </div>
                    <div className="lessons-form-list">
                      {form.lessons.map((lesson, idx) => (
                        <div key={idx} className="lesson-form-item">
                          <div className="lesson-form-header flex-between">
                            <span style={{fontSize:'13px',fontWeight:'600',color:'var(--subtext0)'}}>Lesson {idx + 1}</span>
                            {form.lessons.length > 1 && (
                              <button type="button" className="btn btn-danger btn-sm" onClick={() => removeLesson(idx)}>Remove</button>
                            )}
                          </div>
                          <div className="form-row">
                            <div className="form-group">
                              <input className="form-input" placeholder="Lesson title" value={lesson.title} onChange={e => handleLessonChange(idx, 'title', e.target.value)} required />
                            </div>
                            <div className="form-group">
                              <select className="form-select" value={lesson.type} onChange={e => handleLessonChange(idx, 'type', e.target.value)}>
                                <option value="video">🎬 Video</option>
                                <option value="reading">📖 Reading</option>
                                <option value="quiz">❓ Quiz</option>
                              </select>
                            </div>
                          </div>
                          <div className="form-group">
                            <input className="form-input" placeholder="Description" value={lesson.description} onChange={e => handleLessonChange(idx, 'description', e.target.value)} />
                          </div>
                          <input type="number" className="form-input" placeholder="Duration (min)" value={lesson.duration} min="1" onChange={e => handleLessonChange(idx, 'duration', Number(e.target.value))} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2" style={{marginTop:'20px'}}>
                    <button type="button" className="btn btn-ghost btn-full" onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary btn-full" disabled={saving}>
                      {saving ? 'Saving...' : editing ? 'Update Course' : 'Create Course'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
