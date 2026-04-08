import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import './Profile.css';

function Profile() {
  const { user, login, token } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    skills: user?.skills?.join(', ') || '',
    location: user?.location || '',
    phone: user?.phone || '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        location: form.location,
        bio: form.bio,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean)
      };
      console.log('Sending profile update:', payload);
      const { data } = await API.put('/auth/profile', payload);
      console.log('Profile response:', data);
      login(data.user, token);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      console.log('Profile error:', err.response?.data);
      setError(err.response?.data?.message || err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrap">
      <div className="page-header">
        <h2>My Profile</h2>
        <p>Update your personal information</p>
      </div>

      <div className="profile-layout">
        <div className="profile-avatar-card">
          <div className="profile-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <h3>{user?.name}</h3>
          <p>{user?.email}</p>
          <span className={`tag ${user?.role === 'employer' ? 'tag-blue' : 'tag-green'}`}>
            {user?.role === 'employer' ? '🏢 Employer' : '🔍 Job Seeker'}
          </span>
        </div>

        <div className="profile-form-card">
          {success && <div className="alert alert-success">✅ Profile updated successfully!</div>}
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" name="email" type="email" value={form.email} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" name="phone" placeholder="+91 00000 00000" value={form.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input className="form-input" name="location" placeholder="City, Country" value={form.location} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Skills (comma separated)</label>
              <input className="form-input" name="skills" placeholder="React, Node.js, MongoDB..." value={form.skills} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea className="form-textarea" name="bio" placeholder="Tell employers about yourself..." value={form.bio} onChange={handleChange} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;