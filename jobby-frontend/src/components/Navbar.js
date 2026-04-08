import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">💼</span>
          <span className="brand-name">Jobby</span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/')}`} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/jobs" className={`nav-link ${isActive('/jobs')}`} onClick={() => setMenuOpen(false)}>Browse Jobs</Link>
          {user && (
            <>
              {user.role === 'employer' && (
                <>
                  <Link to="/post-job" className={`nav-link ${isActive('/post-job')}`} onClick={() => setMenuOpen(false)}>Post Job</Link>
                  <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`} onClick={() => setMenuOpen(false)}>Dashboard</Link>
                </>
              )}
              {user.role === 'jobseeker' && (
                <Link to="/applications" className={`nav-link ${isActive('/applications')}`} onClick={() => setMenuOpen(false)}>My Applications</Link>
              )}
              <Link to="/profile" className={`nav-link ${isActive('/profile')}`} onClick={() => setMenuOpen(false)}>Profile</Link>
            </>
          )}
        </div>

        <div className="navbar-actions">
          {user ? (
            <div className="user-menu">
              <span className="user-avatar">{user.name?.charAt(0).toUpperCase()}</span>
              <span className="user-name">{user.name}</span>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;