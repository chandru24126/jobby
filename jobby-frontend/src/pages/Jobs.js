import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import './Jobs.css';

function Jobs() {
  const { user } = useAuth();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(params.get('search') || '');
  const [filters, setFilters] = useState({ type: '', experience: '', category: params.get('category') || '' });
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyForm, setApplyForm] = useState({ coverLetter: '', resume: '' });
  const [applyMsg, setApplyMsg] = useState('');
  const [applying, setApplying] = useState(false);
  const [showModal, setShowModal] = useState(false);

useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filters]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.set('search', search);
      if (filters.type) query.set('type', filters.type);
      if (filters.category) query.set('category', filters.category);
      const { data } = await API.get(`/jobs?${query}`);
      setJobs(data.jobs || data);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    setApplyMsg('');
    try {
      await API.post('/applications', { jobId: selectedJob._id, ...applyForm });
      setApplyMsg('success');
      setTimeout(() => { setShowModal(false); setApplyMsg(''); }, 1500);
    } catch (err) {
      setApplyMsg(err.response?.data?.message || 'Failed to apply.');
    } finally {
      setApplying(false);
    }
  };

  const jobTypes = ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship'];
  const categories = ['Technology', 'Finance', 'Design', 'Marketing', 'Healthcare', 'Education'];

  return (
    <div className="page-wrap">
      <div className="jobs-layout">
        {/* Sidebar */}
        <aside className="jobs-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">Search</h3>
            <input
              className="form-input"
              placeholder="Title, keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="sidebar-section">
            <h3 className="sidebar-title">Job Type</h3>
            {jobTypes.map((t) => (
              <label key={t} className="filter-option">
                <input
                  type="radio"
                  name="type"
                  checked={filters.type === t}
                  onChange={() => setFilters({ ...filters, type: filters.type === t ? '' : t })}
                />
                {t}
              </label>
            ))}
          </div>
          <div className="sidebar-section">
            <h3 className="sidebar-title">Category</h3>
            {categories.map((c) => (
              <label key={c} className="filter-option">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === c}
                  onChange={() => setFilters({ ...filters, category: filters.category === c ? '' : c })}
                />
                {c}
              </label>
            ))}
          </div>
          <button className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: 8 }}
            onClick={() => { setFilters({ type: '', experience: '', category: '' }); setSearch(''); }}>
            Clear Filters
          </button>
        </aside>

        {/* Job List */}
        <div className="jobs-main">
          <div className="jobs-header">
            <h2>{loading ? 'Loading...' : `${jobs.length} Jobs Found`}</h2>
          </div>
          {loading ? (
            <div className="empty-state"><div className="icon">⏳</div><h3>Loading jobs...</h3></div>
          ) : jobs.length === 0 ? (
            <div className="empty-state"><div className="icon">🔍</div><h3>No jobs found</h3><p>Try different keywords or filters.</p></div>
          ) : (
            jobs.map((job) => (
              <div key={job._id} className="card job-list-card">
                <div className="job-list-top">
                  <div className="job-logo">{job.company?.charAt(0) || 'C'}</div>
                  <div className="job-list-info">
                    <h3 className="job-title">{job.title}</h3>
                    <p className="job-company">{job.company} • {job.location}</p>
                  </div>
                  {job.salary && <span className="job-salary">{job.salary}</span>}
                </div>
                <div className="job-tags" style={{ margin: '10px 0' }}>
                  <span className="tag tag-blue">{job.type || 'Full-time'}</span>
                  {job.category && <span className="tag tag-gray">{job.category}</span>}
                  {job.experience && <span className="tag tag-gray">{job.experience}</span>}
                </div>
                <p className="job-desc">{job.description?.slice(0, 150)}...</p>
                <div className="job-list-footer">
                  <span className="job-date">
                    {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : ''}
                  </span>
                  {user?.role === 'jobseeker' && (
                    <button className="btn btn-primary btn-sm" onClick={() => { setSelectedJob(job); setShowModal(true); }}>
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Apply Modal */}
      {showModal && selectedJob && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Apply for {selectedJob.title}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <p className="modal-company">{selectedJob.company} • {selectedJob.location}</p>
            {applyMsg === 'success' ? (
              <div className="alert alert-success">✅ Application submitted successfully!</div>
            ) : (
              <form onSubmit={handleApply}>
                {applyMsg && <div className="alert alert-error">{applyMsg}</div>}
                <div className="form-group">
                  <label className="form-label">Resume Link / URL</label>
                  <input
                    className="form-input"
                    placeholder="https://your-resume-link.com"
                    value={applyForm.resume}
                    onChange={(e) => setApplyForm({ ...applyForm, resume: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Cover Letter</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Tell the employer why you're a great fit..."
                    value={applyForm.coverLetter}
                    onChange={(e) => setApplyForm({ ...applyForm, coverLetter: e.target.value })}
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={applying}>
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Jobs;