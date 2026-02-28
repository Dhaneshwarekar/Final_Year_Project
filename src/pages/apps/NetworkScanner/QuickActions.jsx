import React from 'react';
import { Globe, Target, Settings, History, Download, Zap, Info } from 'lucide-react';

const QuickActions = ({ activeAction, onAction, onNavigate }) => {
  const actions = [
    { id: 'local', name: 'Local', icon: '🖥️', action: () => onAction('127.0.0.1') },
    { id: 'target', name: 'Target', icon: '🎯', action: () => onAction('203.45.67.89') },
    { id: 'custom', name: 'Custom', icon: '⚙️', action: () => onAction('custom') },
    { id: 'details', name: 'Details', icon: '📚', action: () => onNavigate('details') },
    { id: 'history', name: 'History', icon: '📋', action: () => onNavigate('history') },
    { id: 'export', name: 'Export', icon: '📤', action: () => onNavigate('export') }
  ];

  return (
    <div className="quick-actions-sidebar">
      <div className="sidebar-section">
        <h3 className="sidebar-section-title">QUICK ACTIONS</h3>
        <div className="sidebar-nav">
          {actions.map((action) => (
            <button
              key={action.id}
              className={`sidebar-action-btn ${activeAction === action.id ? 'active' : ''}`}
              onClick={action.action}
            >
              <span className="sidebar-action-icon">{action.icon}</span>
              <span className="sidebar-item-text">{action.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-section-title">SCAN STATS</h3>
        <div style={{ padding: '0 1rem', color: '#9ca3af', fontSize: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Total Scans:</span>
            <span style={{ color: '#3b82f6' }}>12</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Open Ports Found:</span>
            <span style={{ color: '#22c55e' }}>47</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Suspicious IPs:</span>
            <span style={{ color: '#ef4444' }}>3</span>
          </div>
        </div>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-section-title">QUICK TIP</h3>
        <div style={{ padding: '0 1rem' }}>
          <div style={{
            background: '#252850',
            borderRadius: '0.375rem',
            padding: '0.75rem',
            fontSize: '0.75rem',
            color: '#9ca3af'
          }}>
            <Info size={14} style={{ display: 'inline', marginRight: '0.25rem', color: '#3b82f6' }} />
            <strong style={{ color: '#e5e7eb' }}>Port 4444:</strong> Often used by malware
            <div style={{ marginTop: '0.25rem', fontSize: '0.7rem' }}>
              Click "Details" to learn more about networking
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;