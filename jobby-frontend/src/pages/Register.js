import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import './Auth.css';

function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'jobseeker' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const selectRole = (role) => setForm({ ...form, role });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', form);
      login(data.user, data.token);
      navigate(data.user.role === 'employer' ? '/dashboard' : '/jobs');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">💼</span>
          <h2>Create your account</h2>
          <p>Join Jobby and find your dream job</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">I am a...</label>
            <div className="role-selector">
              <div
                className={`role-card ${form.role === 'jobseeker' ? 'selected' : ''}`}
                onClick={() => selectRole('jobseeker')}
              >
                <span className="role-icon">🔍</span>
                <span className="role-label">Job Seeker</span>
                <span className="role-desc">Looking for jobs</span>
              </div>
              <div
                className={`role-card ${form.role === 'employer' ? 'selected' : ''}`}
                onClick={() => selectRole('employer')}
              >
                <span className="role-icon">🏢</span>
                <span className="role-label">Employer</span>
                <span className="role-desc">Hiring talent</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              type="text"
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              name="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
              minLength={6}
              required
            />
          </div>

          <button className="btn btn-primary auth-btn" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;