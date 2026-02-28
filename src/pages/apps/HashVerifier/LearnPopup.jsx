import React from 'react';
import { X, Fingerprint, AlertTriangle } from 'lucide-react';

/**
 * Quick learn modal with hash basics
 */
const LearnPopup = ({ onClose }) => {
  return (
    <div className="learn-modal">
      <div className="learn-header">
        <h3 style={{ color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Fingerprint size={18} style={{ color: '#3b82f6' }} />
          WHAT IS A HASH?
        </h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
          <X size={18} />
        </button>
      </div>

      <div className="learn-content">
        <p style={{ color: '#e5e7eb', marginBottom: '1rem' }}>
          A hash is a <strong>digital fingerprint</strong> for a file.
        </p>

        <div style={{ background: '#252850', padding: '1rem', borderRadius: '0.375rem', marginBottom: '1rem' }}>
          <p style={{ color: '#9ca3af', marginBottom: '0.5rem' }}>🔑 <strong>Key Properties:</strong></p>
          <ul style={{ color: '#9ca3af', fontSize: '0.85rem', paddingLeft: '1.2rem', lineHeight: '1.6' }}>
            <li>Same file → Same hash (always)</li>
            <li>Different file → Different hash</li>
            <li>One-way: Can't get file from hash</li>
            <li>Change 1 letter → Completely different hash</li>
          </ul>
        </div>

        <div style={{ background: '#1a1d3a', padding: '1rem', borderRadius: '0.375rem', marginBottom: '1rem' }}>
          <p style={{ color: '#f59e0b', marginBottom: '0.5rem' }}>📝 Example:</p>
          <div style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
            <div style={{ color: '#9ca3af' }}>"Hello World"</div>
            <div style={{ color: '#22c55e', wordBreak: 'break-all' }}>b10a8db164e0754105b7a99be72e3fe5</div>
            <div style={{ color: '#9ca3af', marginTop: '0.5rem' }}>"Hello World!"</div>
            <div style={{ color: '#22c55e', wordBreak: 'break-all' }}>ed076287532e86365e841e92bfc50d8c</div>
          </div>
        </div>

        <div style={{ background: 'rgba(239,68,68,0.1)', padding: '1rem', borderRadius: '0.375rem' }}>
          <p style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <AlertTriangle size={14} />
            <strong>Real-World Use:</strong>
          </p>
          <p style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
            • Verify evidence wasn't tampered<br/>
            • Check if file is known malware<br/>
            • Prove two files are identical<br/>
            • Chain of custody documentation
          </p>
        </div>
      </div>
    </div>
  );
};

export default LearnPopup;