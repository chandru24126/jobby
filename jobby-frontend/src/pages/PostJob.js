import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import './PostJob.css';

function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', company: '', location: '', type: 'Full-time',
    category: '', experience: '', salary: '', description: '', requirements: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await API.post('/jobs', form);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrap">
      <div className="page-header">
        <h2>Post a New Job</h2>
        <p>Fill in the details to attract the right candidates</p>
      </div>

      <div className="postjob-card">
        {success && <div className="alert alert-success">✅ Job posted successfully! Redirecting...</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Job Title *</label>
              <input className="form-input" name="title" placeholder="e.g. Frontend Developer"
                value={form.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input className="form-input" name="company" placeholder="e.g. Acme Corp"
                value={form.company} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Location *</label>
              <input className="form-input" name="location" placeholder="e.g. Chennai, India"
                value={form.location} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Job Type</label>
              <select className="form-select" name="type" value={form.type} onChange={handleChange}>
                {['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship'].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" name="category" value={form.category} onChange={handleChange}>
                <option value="">Select category</option>
                {['Technology', 'Finance', 'Design', 'Marketing', 'Healthcare', 'Education'].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Experience Level</label>
              <select className="form-select" name="experience" value={form.experience} onChange={handleChange}>
                <option value="">Select level</option>
                {['Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Manager'].map((e) => (
                  <option key={e}>{e}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Salary Range</label>
            <input className="form-input" name="salary" placeholder="e.g. ₹8L - ₹12L per annum"
              value={form.salary} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Job Description *</label>
            <textarea className="form-textarea" name="description" placeholder="Describe the role, responsibilities..."
              value={form.description} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Requirements</label>
            <textarea className="form-textarea" name="requirements" placeholder="List required skills, qualifications..."
              value={form.requirements} onChange={handleChange} />
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/dashboard')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Posting...' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostJob;