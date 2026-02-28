import React from 'react';
import { Globe, Download } from 'lucide-react';

const ScanResults = ({ results, target, onExport }) => {
  if (!results) {
    return (
      <div className="no-results">
        <span style={{ fontSize: '3rem' }}>🌐</span>
        <p>Enter an IP address and click SCAN to begin</p>
        <p style={{ fontSize: '0.8rem', color: '#4b5563' }}>
          Try: 203.45.67.89 (case target) or 192.168.1.100 (local)
        </p>
      </div>
    );
  }

  const getStateClass = (state) => {
    switch(state) {
      case 'open': return 'state-open';
      case 'filtered': return 'state-filtered';
      case 'closed': return 'state-closed';
      default: return '';
    }
  };

  return (
    <div className="scan-results-container">
      <div className="results-header">
        <div className="results-title">
          <span>📡 SCAN RESULTS - TARGET: {target}</span>
          {results.scanType && (
            <span style={{ fontSize: '0.7rem', color: '#9ca3af', marginLeft: '1rem' }}>
              ({results.scanType} scan)
            </span>
          )}
        </div>
        <div className="results-geo">
          <Globe size={14} />
          <span>{results.geolocation?.country || 'Unknown'}</span>
          {results.geolocation?.city && <span> • {results.geolocation.city}</span>}
          {results.geolocation?.isp && <span> • {results.geolocation.isp}</span>}
        </div>
      </div>

      <table className="scan-results-table">
        <thead>
          <tr>
            <th>PORT</th>
            <th>STATE</th>
            <th>SERVICE</th>
            <th>BANNER</th>
          </tr>
        </thead>
        <tbody>
          {results.ports.map((port, index) => (
            <tr key={index}>
              <td>{port.port}</td>
              <td>
                <span className={`port-state ${getStateClass(port.state)}`}>
                  {port.state.toUpperCase()}
                </span>
              </td>
              <td>{port.service}</td>
              <td style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                {port.banner || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {results.whois && (
        <div style={{ 
          background: '#252850', 
          borderRadius: '0.375rem',
          padding: '1rem',
          marginBottom: '2rem'
        }}>
          <h4 style={{ color: '#e5e7eb', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            WHOIS Information
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Registrar:</span>
              <div style={{ color: '#e5e7eb' }}>{results.whois.registrar}</div>
            </div>
            <div>
              <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Created:</span>
              <div style={{ color: '#e5e7eb' }}>{results.whois.created}</div>
            </div>
          </div>
        </div>
      )}

      <button className="export-btn" onClick={onExport}>
        <Download size={14} />
        EXPORT TO CASE NOTES
      </button>
    </div>
  );
};

export default ScanResults;