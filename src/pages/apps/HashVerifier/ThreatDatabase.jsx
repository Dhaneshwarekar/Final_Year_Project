import React, { useState } from 'react';
import { AlertTriangle, Shield, Download, CheckCircle } from 'lucide-react';

/**
 * Threat Intelligence Database
 * Checks if file hash matches known malware
 */
const ThreatDatabase = ({ hash, onAddToNotes, caseId = '101' }) => {
  const [checking, setChecking] = useState(false);
  const [threatResult, setThreatResult] = useState(null);

  // Pre-defined threat database (simplified)
  const threatDB = {
    // Case #101 threats
    'a7f8c9d3b5e6f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6': {
      name: 'ransom.exe',
      family: 'WannaCry',
      risk: 'CRITICAL',
      firstSeen: '2024-01-15',
      description: 'Ransomware that encrypts user files'
    },
    'b6e7d8c9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7': {
      name: 'keylogger.dll',
      family: 'AgentTesla',
      risk: 'HIGH',
      firstSeen: '2024-02-03',
      description: 'Keylogger that captures keystrokes'
    },
    // Case #102 credentials.txt hash (clean)
    'a47f8c3d9e2b1a5f6c8d7e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1': {
      clean: true,
      name: 'credentials.txt',
      description: 'Stolen credentials file - verify with hashes.txt'
    }
  };

  const checkThreat = () => {
    if (!hash) {
      alert('Calculate a hash first');
      return;
    }

    setChecking(true);

    // Simulate database lookup
    setTimeout(() => {
      const threat = threatDB[hash];
      setThreatResult(threat || { clean: true });
      setChecking(false);
    }, 800);
  };

  return (
    <div className="threat-panel">
      <div className="threat-header">
        <div className="threat-title">
          <Shield size={16} />
          THREAT INTELLIGENCE DATABASE
        </div>
        <button className="search-threat-btn" onClick={checkThreat} disabled={checking}>
          {checking ? 'SEARCHING...' : 'SEARCH DATABASE'}
        </button>
      </div>

      {threatResult && (
        <div className="threat-result">
          {threatResult.clean ? (
            // Clean file result
            <div>
              <div className="threat-clean">
                <CheckCircle size={16} />
                No matches in threat database
              </div>
              <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                This hash is not associated with any known malware.
                {caseId === '102' && hash.includes('a47f8c') && (
                  <span style={{ display: 'block', marginTop: '0.5rem', color: '#fbbf24' }}>
                    ⭐ This is the credentials.txt file from Case #102.
                  </span>
                )}
              </p>
            </div>
          ) : (
            // Malware detected
            <div>
              <div className="threat-warning">
                <AlertTriangle size={16} />
                WARNING: Known malware detected!
              </div>
              
              <div className="threat-detail">
                <span className="threat-label">File name:</span>
                <span className="threat-value">{threatResult.name}</span>
                
                <span className="threat-label">Malware family:</span>
                <span className="threat-value">{threatResult.family}</span>
                
                <span className="threat-label">Risk level:</span>
                <span className="threat-value" style={{ 
                  color: threatResult.risk === 'CRITICAL' ? '#ef4444' : '#f59e0b' 
                }}>
                  {threatResult.risk}
                </span>
                
                <span className="threat-label">First seen:</span>
                <span className="threat-value">{threatResult.firstSeen}</span>
              </div>
              
              <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                {threatResult.description}
              </p>
            </div>
          )}

          {/* Add to Case Notes button */}
          <button className="add-notes-btn" onClick={() => onAddToNotes?.(threatResult)}>
            <Download size={12} style={{ marginRight: '0.25rem' }} />
            ADD TO CASE NOTES
          </button>
        </div>
      )}
    </div>
  );
};

export default ThreatDatabase;