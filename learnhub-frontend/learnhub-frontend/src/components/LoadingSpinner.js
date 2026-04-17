import React from 'react';
import './LoadingSpinner.css';

export default function LoadingSpinner({ fullscreen, size = 'md', text }) {
  if (fullscreen) {
    return (
      <div className="spinner-fullscreen">
        <div className="spinner-wrap">
          <div className="spinner spinner-lg" />
          <span className="spinner-brand">LearnHub</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`spinner-container ${text ? 'with-text' : ''}`}>
      <div className={`spinner spinner-${size}`} />
      {text && <span className="spinner-text">{text}</span>}
    </div>
  );
}
