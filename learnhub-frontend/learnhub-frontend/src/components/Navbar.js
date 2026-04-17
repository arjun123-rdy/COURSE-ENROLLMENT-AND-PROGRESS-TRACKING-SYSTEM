import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🎓</span>
          <span className="brand-text">LearnHub</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
          <Link to="/courses" className={`nav-link ${isActive('/courses') ? 'active' : ''}`}>Courses</Link>
          {user && <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>Dashboard</Link>}
          {user?.role === 'admin' && <Link to="/admin" className={`nav-link admin-link ${isActive('/admin') ? 'active' : ''}`}>Admin</Link>}
        </div>

        <div className="navbar-actions">
          {user ? (
            <div className="user-menu">
              <div className="user-avatar" onClick={() => setMenuOpen(!menuOpen)}>
                <span>{user.name.charAt(0).toUpperCase()}</span>
              </div>
              {menuOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-info">
                    <span className="dropdown-name">{user.name}</span>
                    <span className="dropdown-email">{user.email}</span>
                    {user.role === 'admin' && <span className="badge badge-mauve" style={{marginTop:'4px',alignSelf:'flex-start'}}>Admin</span>}
                  </div>
                  <div className="divider" style={{margin:'8px 0'}}/>
                  <Link to="/dashboard" className="dropdown-item" onClick={() => setMenuOpen(false)}>📊 Dashboard</Link>
                  {user.role === 'admin' && <Link to="/admin" className="dropdown-item" onClick={() => setMenuOpen(false)}>⚙️ Admin Panel</Link>}
                  <button className="dropdown-item danger" onClick={handleLogout}>🚪 Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          )}
        </div>
      </div>
      {menuOpen && <div className="overlay-close" onClick={() => setMenuOpen(false)} />}
    </nav>
  );
}
