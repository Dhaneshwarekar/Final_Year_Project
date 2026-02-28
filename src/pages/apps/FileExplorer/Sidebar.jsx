import React from 'react';

const Sidebar = ({ currentPath, onNavigate, discoveryCount, caseId = '101' }) => {
  const isActive = (path) => {
    return JSON.stringify(currentPath) === JSON.stringify(path);
  };

  const handleNavigate = (path) => {
    onNavigate(path);
  };

  // Get folders based on case
  const getCaseFolders = () => {
    if (caseId === '101') {
      return [
        { name: 'Evidence', icon: '📁' },
        { name: 'logs', icon: '📁' },
        { name: 'employees', icon: '📁' },
        { name: 'system_info', icon: '📁' }
      ];
    } else if (caseId === '102') {
      return [
        { name: 'email_logs', icon: '📧' },
        { name: 'employee_data', icon: '👥' },
        { name: 'network_logs', icon: '🌐' },
        { name: 'suspicious_files', icon: '⚠️' }
      ];
    }
    return [];
  };

  // Get case color
  const getCaseColor = () => {
    return caseId === '101' ? '#eab308' : '#06b6d4';
  };

  const caseFolders = getCaseFolders();

  return (
    <div className="file-explorer-sidebar">
      {/* QUICK ACCESS */}
      <div className="sidebar-section">
        <h3 className="sidebar-section-title">QUICK ACCESS</h3>
        <div className="sidebar-nav">
          {['Desktop', 'Downloads', 'Documents'].map((item, index) => (
            <button
              key={index}
              className={`sidebar-item ${isActive([item]) ? 'active' : ''}`}
              onClick={() => handleNavigate([item])}
            >
              <span className="sidebar-item-icon">📁</span>
              <span className="sidebar-item-text">{item}</span>
            </button>
          ))}
        </div>
      </div>

      {/* THIS PC */}
      <div className="sidebar-section">
        <h3 className="sidebar-section-title">THIS PC</h3>
        <div className="sidebar-nav">
          {[
            { name: 'OS (C:)', icon: '💾' },
            { name: 'Evidence (D:)', icon: '🔒' }
          ].map((item, index) => (
            <button
              key={index}
              className={`sidebar-item ${isActive([item.name]) ? 'active' : ''}`}
              onClick={() => handleNavigate([item.name])}
            >
              <span className="sidebar-item-icon">{item.icon}</span>
              <span className="sidebar-item-text">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CURRENT CASE */}
      <div className="sidebar-section">
        <h3 className="sidebar-section-title">CASE #{caseId}</h3>
        <div className="sidebar-nav">
          <button
            className={`sidebar-item ${isActive([`Evidence (D:)`, `Case #${caseId}`]) ? 'active' : ''}`}
            onClick={() => handleNavigate([`Evidence (D:)`, `Case #${caseId}`])}
            style={{
              borderLeft: `3px solid ${isActive([`Evidence (D:)`, `Case #${caseId}`]) ? getCaseColor() : 'transparent'}`
            }}
          >
            <span className="sidebar-item-icon">
              {caseId === '101' ? '🔓' : '🎣'}
            </span>
            <span className="sidebar-item-text">Case #{caseId}</span>
            {discoveryCount > 0 && (
              <span style={{
                marginLeft: 'auto',
                fontSize: '0.7rem',
                background: getCaseColor(),
                color: '#fff',
                padding: '0.1rem 0.4rem',
                borderRadius: '1rem'
              }}>
                {discoveryCount}/{caseId === '101' ? '5' : '6'}
              </span>
            )}
          </button>

          {/* Subfolders */}
          {currentPath.includes(`Case #${caseId}`) && (
            <div style={{ marginLeft: '1.5rem', marginTop: '0.25rem' }}>
              {caseFolders.map((folder, i) => {
                const folderPath = [`Evidence (D:)`, `Case #${caseId}`, folder.name];
                return (
                  <button
                    key={i}
                    className={`sidebar-item ${isActive(folderPath) ? 'active' : ''}`}
                    onClick={() => handleNavigate(folderPath)}
                    style={{ 
                      fontSize: '0.8rem', 
                      padding: '0.25rem 0.5rem',
                      borderLeft: `2px solid ${isActive(folderPath) ? getCaseColor() : 'transparent'}`
                    }}
                  >
                    <span className="sidebar-item-icon">{folder.icon}</span>
                    <span className="sidebar-item-text">{folder.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Case Info */}
      <div className="sidebar-section">
        <div style={{
          margin: '1rem',
          padding: '0.75rem',
          background: '#1a1d3a',
          border: `1px solid ${getCaseColor()}40`,
          borderRadius: '0.5rem',
          fontSize: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ color: getCaseColor(), fontSize: '1rem' }}>
              {caseId === '101' ? '🔓' : '🎣'}
            </span>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>
              {caseId === '101' ? 'The Unauthorized Login' : 'The Phishing Trap'}
            </span>
          </div>
          <p style={{ color: '#9ca3af', margin: 0, lineHeight: '1.4' }}>
            {caseId === '101' 
              ? 'Find evidence of the 3 AM unauthorized login.'
              : 'Investigate the phishing email and find who fell for it.'}
          </p>
          <div style={{ 
            marginTop: '0.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            color: '#6b7280',
            fontSize: '0.7rem'
          }}>
            <span>{discoveryCount} / {caseId === '101' ? '5' : '6'} discoveries</span>
            <span style={{ color: getCaseColor() }}>
              {caseId === '101' ? 'Beginner' : 'Beginner'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;