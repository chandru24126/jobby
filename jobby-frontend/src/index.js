import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// PWA Install Banner
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // Create banner
  const banner = document.createElement('div');
  banner.id = 'install-banner';
  banner.innerHTML = `
    <div style="
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #1a56db;
      color: white;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 9999;
      box-shadow: 0 -4px 20px rgba(0,0,0,0.2);
      font-family: 'Segoe UI', sans-serif;
    ">
      <div style="display: flex; align-items: center; gap: 12px;">
        <img src="/logo192.png" style="width: 44px; height: 44px; border-radius: 10px;" />
        <div>
          <div style="font-weight: 700; font-size: 15px;">Install Jobby App</div>
          <div style="font-size: 12px; opacity: 0.85;">Add to home screen for quick access</div>
        </div>
      </div>
      <div style="display: flex; gap: 10px;">
        <button id="install-dismiss" style="
          background: transparent;
          border: 1.5px solid rgba(255,255,255,0.5);
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          cursor: pointer;
          font-weight: 500;
        ">Not Now</button>
        <button id="install-btn" style="
          background: white;
          border: none;
          color: #1a56db;
          padding: 8px 20px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        ">Install</button>
      </div>
    </div>
  `;

  document.body.appendChild(banner);

  // Install button click
  document.getElementById('install-btn').addEventListener('click', async () => {
    banner.remove();
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('User choice:', outcome);
    deferredPrompt = null;
  });

  // Dismiss button click
  document.getElementById('install-dismiss').addEventListener('click', () => {
    banner.remove();
    deferredPrompt = null;
  });
});

// Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered'))
      .catch(err => console.log('SW failed:', err));
  });
}