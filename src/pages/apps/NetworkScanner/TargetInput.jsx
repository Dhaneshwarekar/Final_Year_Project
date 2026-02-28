import React, { useState } from 'react';
import { Search, X, Zap } from 'lucide-react';

const TargetInput = ({ onScan, isScanning, recentScans, onSelectRecent }) => {
  const [target, setTarget] = useState('');
  const [scanType, setScanType] = useState('quick');
  const [error, setError] = useState('');

  // Validate IP format
  const validateIP = (ip) => {
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
  };

  const handleScan = () => {
    if (!target) {
      setError('Please enter a target IP');
      return;
    }

    if (!validateIP(target)) {
      setError('Invalid IP format. Use: xxx.xxx.xxx.xxx');
      return;
    }

    setError('');
    onScan(target, scanType);
  };

  const handleClear = () => {
    setTarget('');
    setError('');
  };

  const handleQuickAction = (ip) => {
    setTarget(ip);
    setError('');
  };

  return (
    <div className="scanner-toolbar">
      <div className="target-input-section">
        <div className="target-input-group">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="Enter target IP (e.g., 192.168.1.100)"
            className="target-input"
            disabled={isScanning}
          />
          {target && (
            <X 
              size={16} 
              className="text-gray-400 cursor-pointer hover:text-white"
              onClick={handleClear}
            />
          )}
        </div>

        <div className="scan-type-selector">
          <label className="scan-radio">
            <input
              type="radio"
              name="scanType"
              value="quick"
              checked={scanType === 'quick'}
              onChange={(e) => setScanType(e.target.value)}
              disabled={isScanning}
            />
            <span>Quick (Top 20 ports)</span>
          </label>
          <label className="scan-radio">
            <input
              type="radio"
              name="scanType"
              value="full"
              checked={scanType === 'full'}
              onChange={(e) => setScanType(e.target.value)}
              disabled={isScanning}
            />
            <span>Full (1-1024 ports)</span>
          </label>
          <label className="scan-radio">
            <input
              type="radio"
              name="scanType"
              value="custom"
              checked={scanType === 'custom'}
              onChange={(e) => setScanType(e.target.value)}
              disabled={isScanning}
            />
            <span>Custom</span>
          </label>
        </div>

        <button 
          className="scan-button"
          onClick={handleScan}
          disabled={isScanning}
        >
          <Zap size={16} />
          {isScanning ? 'SCANNING...' : 'SCAN'}
        </button>

        <button 
          className="clear-button"
          onClick={handleClear}
          disabled={isScanning}
        >
          CLEAR
        </button>
      </div>

      {error && (
        <div style={{ 
          color: '#ef4444', 
          fontSize: '0.75rem', 
          marginTop: '0.5rem',
          background: 'rgba(239,68,68,0.1)',
          padding: '0.25rem 0.75rem',
          borderRadius: '0.25rem'
        }}>
          ✗ {error}
        </div>
      )}

      <div className="recent-scans-bar">
        <div className="recent-scans-title">RECENT SCANS</div>
        <div className="recent-scans-list">
          {recentScans.map((scan, index) => (
            <div
              key={index}
              className="recent-scan-item"
              onClick={() => {
                handleQuickAction(scan.ip);
                onSelectRecent(scan);
              }}
            >
              <span>🌐 {scan.ip}</span>
              <span style={{ color: '#3b82f6' }}>{scan.openPorts} ports</span>
              <span style={{ fontSize: '0.7rem' }}>{scan.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TargetInput;