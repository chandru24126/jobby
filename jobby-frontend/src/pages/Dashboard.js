import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import './Dashboard.css';

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await API.get('/jobs/my');
      setJobs(data);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job posting?')) return;
    try {
      await API.delete(`/jobs/${id}`);
      setJobs(jobs.filter((j) => j._id !== id));
    } catch {}
  };

  const viewApplicants = async (job) => {
    setSelectedJob(job);
    setShowModal(true);
    setLoadingApplicants(true);
    try {
      const { data } = await API.get(`/applications/job/${job._id}`);
      setApplicants(data);
    } catch {
      setApplicants([]);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const updateStatus = async (appId, status) => {
    try {
      await API.put(`/applications/${appId}`, { status });
      setApplicants(applicants.map((a) =>
        a._id === appId ? { ...a, status } : a
      ));
    } catch {}
  };

  const totalApps = jobs.reduce((sum, j) => sum + (j.applicationCount || 0), 0);

  return (
    <div className="page-wrap">
      <div className="dash-header">
        <div>
          <h2>Employer Dashboard</h2>
          <p>Manage your job postings and applications</p>
        </div>
        <Link to="/post-job" className="btn btn-primary">+ Post New Job</Link>
      </div>

      {/* Stats */}
      <div className="dash-stats">
        <div className="stat-card">
          <span className="stat-icon">📋</span>
          <div><div className="stat-num">{jobs.length}</div><div className="stat-lbl">Jobs Posted</div></div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">👥</span>
          <div><div className="stat-num">{totalApps}</div><div className="stat-lbl">Total Applications</div></div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">✅</span>
          <div><div className="stat-num">{jobs.filter(j => j.isActive !== false).length}</div><div className="stat-lbl">Active Jobs</div></div>
        </div>
      </div>

      {/* Job List */}
      <h3 className="section-title">Your Job Postings</h3>
      {loading ? (
        <div className="empty-state"><div className="icon">⏳</div><h3>Loading...</h3></div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📋</div>
          <h3>No jobs posted yet</h3>
          <p>Post your first job to start receiving applications.</p>
          <Link to="/post-job" className="btn btn-primary" style={{ marginTop: 14 }}>Post a Job</Link>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Location</th>
                <th>Type</th>
                <th>Applications</th>
                <th>Posted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td>
                    <strong>{job.title}</strong><br />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text2)' }}>{job.company}</span>
                  </td>
                  <td>{job.location}</td>
                  <td><span className="tag tag-blue">{job.type || 'Full-time'}</span></td>
                  <td>
                    <button
                      className="applicants-btn"
                      onClick={() => viewApplicants(job)}
                    >
                      👥 {job.applicationCount || 0} applicants
                    </button>
                  </td>
                  <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="btn-danger" onClick={() => handleDelete(job._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Applicants Modal */}
      {showModal && selectedJob && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Applicants for {selectedJob.title}</h3>
                <p className="modal-company">{selectedJob.company} • {selectedJob.location}</p>
              </div>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            {loadingApplicants ? (
              <div className="empty-state"><div className="icon">⏳</div><h3>Loading applicants...</h3></div>
            ) : applicants.length === 0 ? (
              <div className="empty-state">
                <div className="icon">👥</div>
                <h3>No applicants yet</h3>
                <p>Share your job posting to attract candidates.</p>
              </div>
            ) : (
              <div className="applicants-list">
                {applicants.map((app) => (
                  <div key={app._id} className="applicant-card">
                    <div className="applicant-top">
                      <div className="applicant-avatar">
                        {app.applicant?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="applicant-info">
                        <h4>{app.applicant?.name || 'Unknown'}</h4>
                        <p>{app.applicant?.email || ''}</p>
                      </div>
                      <div className="applicant-actions">
                        <select
                          className="status-select"
                          value={app.status}
                          onChange={(e) => updateStatus(app._id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        <span className={`status-badge status-${app.status}`}>
                          {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
                        </span>
                      </div>
                    </div>
                    {app.resume && (
                      <div className="applicant-resume">
                        <span>📄 Resume: </span>
                        <a href={app.resume} target="_blank" rel="noreferrer">{app.resume}</a>
                      </div>
                    )}
                    {app.coverLetter && (
                      <div className="applicant-cover">
                        <strong>Cover Letter:</strong>
                        <p>{app.coverLetter}</p>
                      </div>
                    )}
                    <div className="applicant-date">
                      Applied on {new Date(app.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;