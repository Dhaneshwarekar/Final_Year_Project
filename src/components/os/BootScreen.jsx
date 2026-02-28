import React, { useState, useEffect } from 'react';

const BootScreen = ({ progress }) => {
  const [bootMessages, setBootMessages] = useState([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const bootSequence = [
    'Initializing CrimeSolver OS...',
    'Loading investigation modules...',
    'Mounting secure file system...',
    'Starting forensic tools...',
    'Establishing secure connection...',
    'Loading case files...',
    'Preparing investigation environment...',
    'System ready.'
  ];

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prev => {
        if (prev < bootSequence.length - 1) {
          setBootMessages(prevMsgs => [...prevMsgs, bootSequence[prev]]);
          return prev + 1;
        }
        clearInterval(messageInterval);
        return prev;
      });
    }, 400);

    return () => clearInterval(messageInterval);
  }, []);

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div className="boot-container">
      <div className="boot-background"></div>
      <div className="boot-content">
        <div className="boot-logo-section">
          <div className="boot-logo-icon">🕵️</div>
          <h1 className="boot-logo-title">CRIME SOLVER OS</h1>
          <div className="boot-logo-badge">v2.1.4</div>
        </div>

        <div className="boot-messages">
          {bootMessages.map((message, index) => (
            <div key={index} className="boot-message">
              <span className="message-bullet">▶</span>
              <span className="message-text">{message}</span>
              <span className="message-status">OK</span>
            </div>
          ))}
        </div>

        <div className="boot-progress-container">
          <div className="boot-progress-bar">
            <div 
              className="boot-progress-fill"
              style={{ width: `${progress}%` }}
            >
              <div className="progress-glow"></div>
            </div>
          </div>
          <div className="boot-progress-text">
            <span>{progress}%</span>
            <span>System Initialization</span>
          </div>
        </div>

        <div className="boot-system-info">
          <div className="info-row">
            <span className="info-label">System</span>
            <span className="info-value">CrimeSolver OS v2.1.4</span>
          </div>
          <div className="info-row">
            <span className="info-label">Build</span>
            <span className="info-value">2026.02.11-2140</span>
          </div>
          <div className="info-row">
            <span className="info-label">Date</span>
            <span className="info-value">{currentDate}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Time</span>
            <span className="info-value">{currentTime}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Security</span>
            <span className="info-value security-level">Level 3 - Secure</span>
          </div>
        </div>

        <div className="boot-copyright">
          © 2026 CrimeSolver Investigations. All rights reserved.
          <br />
          Unauthorized access is prohibited and monitored.
        </div>
      </div>
    </div>
  );
};

export default BootScreen;