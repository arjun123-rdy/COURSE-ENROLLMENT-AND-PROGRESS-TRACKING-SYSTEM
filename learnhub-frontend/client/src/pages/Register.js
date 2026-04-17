import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error('Please fill in all fields'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome to LearnHub 🎉');
      navigate('/courses');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabel = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'][strength];
  const strengthColor = ['', 'var(--red)', 'var(--red)', 'var(--yellow)', 'var(--green)', 'var(--teal)'][strength];

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
      </div>

      <div className="auth-card card fade-in">
        <div className="auth-logo">
          <span className="auth-logo-icon">🎓</span>
          <span className="auth-logo-text">LearnHub</span>
        </div>

        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Start learning today — it's free</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="Jane Doe"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-input-wrap">
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                className="form-input"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
              <button type="button" className="password-toggle" onClick={() => setShowPass(!showPass)}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
            {form.password && (
              <div className="password-strength">
                <div className="strength-bars">
                  {[1,2,3,4,5].map(n => (
                    <div key={n} className="strength-bar" style={{ background: n <= strength ? strengthColor : 'var(--surface1)' }} />
                  ))}
                </div>
                <span className="strength-label" style={{ color: strengthColor }}>{strengthLabel}</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm password</label>
            <input
              type="password"
              name="confirm"
              className="form-input"
              placeholder="Repeat your password"
              value={form.confirm}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
            {form.confirm && form.password !== form.confirm && (
              <span className="field-error">Passwords do not match</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner spinner-sm" style={{ borderTopColor: 'var(--crust)' }} /> Creating account...</>
            ) : 'Create Free Account'}
          </button>
        </form>

        <p className="auth-terms">
          By registering, you agree to our <a href="#terms">Terms</a> & <a href="#privacy">Privacy Policy</a>.
        </p>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in →</Link>
        </p>
      </div>
    </div>
  );
}
