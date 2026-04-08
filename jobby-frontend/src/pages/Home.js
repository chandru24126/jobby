import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import './Home.css';

function Home() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/jobs?limit=6').then(({ data }) => setJobs(data.jobs || data)).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${search}`);
  };

  const categories = [
    { icon: '💻', label: 'Technology' },
    { icon: '📊', label: 'Finance' },
    { icon: '🎨', label: 'Design' },
    { icon: '📣', label: 'Marketing' },
    { icon: '🏥', label: 'Healthcare' },
    { icon: '📚', label: 'Education' },
  ];

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <h1>Find Your <span>Dream Job</span> Today</h1>
          <p>Thousands of job opportunities from top companies across all industries.</p>
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              className="search-input"
              type="text"
              placeholder="Job title, keyword or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-primary search-btn" type="submit">Search Jobs</button>
          </form>
          <div className="hero-stats">
            <div className="stat"><strong>10K+</strong><span>Jobs Posted</span></div>
            <div className="stat"><strong>5K+</strong><span>Companies</span></div>
            <div className="stat"><strong>50K+</strong><span>Job Seekers</span></div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="page-wrap">
          <h2 className="section-title">Browse by Category</h2>
          <div className="grid-3">
            {categories.map((cat) => (
              <Link to={`/jobs?category=${cat.label}`} key={cat.label} className="cat-card">
                <span className="cat-icon">{cat.icon}</span>
                <span className="cat-label">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="section section-gray">
        <div className="page-wrap">
          <div className="section-header">
            <h2 className="section-title">Featured Jobs</h2>
            <Link to="/jobs" className="btn btn-outline btn-sm">View All →</Link>
          </div>
          {jobs.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📋</div>
              <h3>No jobs yet</h3>
              <p>Be the first to post a job!</p>
            </div>
          ) : (
            <div className="grid-2">
              {jobs.map((job) => (
                <div key={job._id} className="card job-card">
                  <div className="job-card-top">
                    <div className="job-logo">{job.company?.charAt(0) || 'C'}</div>
                    <div>
                      <h3 className="job-title">{job.title}</h3>
                      <p className="job-company">{job.company}</p>
                    </div>
                  </div>
                  <div className="job-tags">
                    <span className="tag tag-blue">{job.type || 'Full-time'}</span>
                    <span className="tag tag-gray">{job.location}</span>
                    {job.salary && <span className="tag tag-green">{job.salary}</span>}
                  </div>
                  <p className="job-desc">{job.description?.slice(0, 100)}...</p>
                  <Link to="/jobs" className="btn btn-outline btn-sm" style={{ marginTop: 10 }}>View Details</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="page-wrap cta-inner">
          <div>
            <h2>Are you an employer?</h2>
            <p>Post a job and reach thousands of qualified candidates today.</p>
          </div>
          <Link to="/post-job" className="btn btn-primary">Post a Job →</Link>
        </div>
      </section>
    </div>
  );
}

export default Home;