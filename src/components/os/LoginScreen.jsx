import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginScreen = ({ onLoginSuccess, userEmail, userId }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    
    try {
      const response = await fetch('http://localhost:5000/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok && data.verified) {
        onLoginSuccess();
      } else {
        setError(true);
        setAttempts(prev => prev + 1);
        setPassword('');
        
        setTimeout(() => {
          setError(false);
        }, 3000);
      }
    } catch (error) {
      setError(true);
      setAttempts(prev => prev + 1);
      setPassword('');
      
      setTimeout(() => {
        setError(false);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background"></div>
      <div className="login-content">
        <div className="login-lock-section">
          <div className="login-lock-icon">🔐</div>
          <div className="login-system-status">
            <span className="status-indicator"></span>
            <span className="status-text">System Locked</span>
          </div>
        </div>

        <div className="login-user-section">
          <div className="user-avatar-large">
            <span>🕵️</span>
          </div>
          <div className="user-details">
            <h2 className="user-name">Lead Investigator</h2>
            <p className="user-badge">CrimeSolver OS • Level 1 Access</p>
            {userEmail && (
              <p className="text-xs text-cyan-400 mt-1">{userEmail}</p>
            )}
          </div>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="password-field">
            <label htmlFor="password" className="password-label">
              Enter Investigation Password
            </label>
            <div className="password-input-wrapper">
              <span className="input-icon">🔑</span>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`password-input ${error ? 'error' : ''}`}
                autoFocus
                disabled={loading}
              />
              {showCursor && <span className="input-cursor"></span>}
            </div>
          </div>

          {error && (
            <div className="login-error">
              <span className="error-icon">⚠️</span>
              <span className="error-text">
                Invalid password. Attempt {attempts}/3
              </span>
            </div>
          )}

          <div className="login-hint">
            <span className="hint-icon">ℹ️</span>
            <span className="hint-text">
              Use your account password to unlock
            </span>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            <span>{loading ? 'Verifying...' : 'Unlock System'}</span>
            <span className="button-icon">→</span>
          </button>
        </form>

        <div className="login-footer">
          <div className="footer-left">
            <span>Secure Investigation Environment</span>
          </div>
          <div className="footer-right">
            <span className="footer-time">
              {new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
            <span className="footer-date">
              {new Date().toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;