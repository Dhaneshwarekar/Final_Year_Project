import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';

const ScanHistory = ({ history, onSelectScan, onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: '#1a1d3a',
      border: '1px solid #374151',
      borderRadius: '0.5rem',
      width: '500px',
      maxHeight: '400px',
      overflow: 'auto',
      zIndex: 1000,
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
    }}>
      <div style={{
        padding: '1rem',
        borderBottom: '1px solid #374151',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ color: 'white', margin: 0 }}>Scan History</h3>
        <button 
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            cursor: 'pointer',
            fontSize: '1.2rem'
          }}
        >
          ✕
        </button>
      </div>
      <div style={{ padding: '0.5rem' }}>
        {history.map((scan, index) => (
          <div
            key={index}
            onClick={() => {
              onSelectScan(scan);
              onClose();
            }}
            style={{
              padding: '0.75rem',
              borderBottom: '1px solid #2d2d4a',
              cursor: 'pointer',
              transition: 'background 0.2s',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#252850'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <div>
              <div style={{ color: '#3b82f6', fontWeight: 'bold' }}>{scan.ip}</div>
              <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                <Clock size={10} style={{ display: 'inline', marginRight: '0.25rem' }} />
                {scan.time}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: '#22c55e', fontSize: '0.8rem' }}>
                {scan.openPorts} open ports
              </span>
              <ArrowRight size={14} className="text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScanHistory;