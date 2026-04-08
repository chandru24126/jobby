import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import './Applications.css';

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await API.get('/applications/my');
      setApplications(data);
    } catch {
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (id) => {
    if (!window.confirm('Withdraw this application?')) return;
    try {
      await API.delete(`/applications/${id}`);
      setApplications(applications.filter((a) => a._id !== id));
    } catch {}
  };

  return (
    <div className="page-wrap">
      <div className="page-header">
        <h2>My Applications</h2>
        <p>Track all your job applications in one place</p>
      </div>

      {loading ? (
        <div className="empty-state"><div className="icon">⏳</div><h3>Loading...</h3></div>
      ) : applications.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📋</div>
          <h3>No applications yet</h3>
          <p>Start applying to jobs to see them here.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Job</th>
                <th>Company</th>
                <th>Applied On</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td><strong>{app.job?.title || 'N/A'}</strong></td>
                  <td>{app.job?.company || 'N/A'}</td>
                  <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge status-${app.status || 'pending'}`}>
                      {app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <button className="btn-danger" onClick={() => handleWithdraw(app._id)}>Withdraw</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Applications;