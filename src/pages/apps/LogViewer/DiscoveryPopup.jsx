import React, { useEffect } from 'react';
import { Zap, Terminal, BookOpen, X, Award, FileText, Shield, AlertTriangle } from 'lucide-react';

const GuidancePopup = ({ discovery, onClose, onAction }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 15000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!discovery) return null;

  // Get icon based on next step app
  const getAppIcon = () => {
    switch(discovery.nextStepApp) {
      case 'terminal':
        return <Terminal size={20} />;
      case 'case-notes':
        return <BookOpen size={20} />;
      case 'file-explorer':
        return <FileText size={20} />;
      case 'log-viewer':
        return <FileText size={20} />;
      case 'hash-verifier':
        return <Shield size={20} />;
      default:
        return <Award size={20} />;
    }
  };

  // Get button color based on next step app
  const getButtonColor = () => {
    switch(discovery.nextStepApp) {
      case 'terminal':
        return '#00ff00';
      case 'case-notes':
        return '#8b5cf6';
      case 'file-explorer':
        return '#3b82f6';
      case 'log-viewer':
        return '#00b4d8';
      case 'hash-verifier':
        return '#f59e0b';
      default:
        return '#00b4d8';
    }
  };

  // Get button text color
  const getButtonTextColor = () => {
    return discovery.nextStepApp === 'terminal' ? '#000' : '#fff';
  };

  // Get app display name
  const getAppName = () => {
    switch(discovery.nextStepApp) {
      case 'terminal':
        return 'Terminal';
      case 'case-notes':
        return 'Case Notes';
      case 'file-explorer':
        return 'File Explorer';
      case 'log-viewer':
        return 'Log Viewer';
      case 'hash-verifier':
        return 'Hash Verifier';
      default:
        return 'Next Step';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      background: '#1e2139',
      border: '2px solid #fbbf24',
      borderRadius: '1rem',
      padding: '1.5rem',
      maxWidth: '400px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
      zIndex: 10000,
      animation: 'slideUp 0.3s ease',
      borderLeft: '4px solid #fbbf24'
    }}>
      <button 
        onClick={onClose} 
        style={{ 
          position: 'absolute', 
          top: '10px', 
          right: '10px', 
          background: 'none', 
          border: 'none', 
          color: '#9ca3af', 
          cursor: 'pointer',
          padding: '5px',
          borderRadius: '4px',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.background = '#374151'}
        onMouseLeave={(e) => e.target.style.background = 'transparent'}
      >
        <X size={16} />
      </button>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ 
          background: '#fbbf24', 
          width: '48px', 
          height: '48px', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontSize: '1.5rem' 
        }}>
          🎉
        </div>
        <div>
          <h3 style={{ color: '#fbbf24', margin: 0, fontSize: '1.2rem' }}>
            DISCOVERY! ({discovery.id}/6)
          </h3>
          <p style={{ color: '#00b4d8', margin: 0, fontSize: '0.9rem' }}>
            {discovery.name}
          </p>
        </div>
      </div>

      {/* Description */}
      <p style={{ color: '#e5e7eb', marginBottom: '1rem', fontSize: '0.95rem', lineHeight: '1.5' }}>
        {discovery.description}
      </p>

      {/* XP Badge */}
      <div style={{ 
        background: '#fbbf2410', 
        border: '1px solid #fbbf24', 
        borderRadius: '2rem', 
        padding: '0.5rem 1rem', 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '0.5rem', 
        marginBottom: '1rem' 
      }}>
        <Zap size={16} color="#fbbf24" />
        <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>+{discovery.xp} XP</span>
      </div>

      {/* Evidence Box */}
      <div style={{ 
        background: '#1a1d3a', 
        padding: '1rem', 
        borderRadius: '0.5rem', 
        marginBottom: '1rem', 
        borderLeft: '4px solid #fbbf24',
        fontFamily: 'monospace',
        fontSize: '0.85rem',
        color: '#22c55e',
        whiteSpace: 'pre-wrap'
      }}>
        {discovery.evidence}
      </div>

      {/* Next Step */}
      <div style={{ 
        background: '#00b4d810', 
        border: '1px solid #00b4d8', 
        borderRadius: '0.5rem', 
        padding: '1rem', 
        marginBottom: '1rem' 
      }}>
        <p style={{ color: '#00b4d8', fontWeight: 'bold', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={14} />
          WHAT'S NEXT?
        </p>
        <p style={{ color: '#e5e7eb', margin: 0, fontSize: '0.9rem' }}>
          {discovery.nextStep}
        </p>
        {discovery.nextStepCommand && (
          <div style={{ 
            marginTop: '0.75rem', 
            background: '#0a0a0a', 
            padding: '0.5rem', 
            borderRadius: '0.25rem', 
            fontFamily: 'monospace', 
            color: '#00b4d8',
            fontSize: '0.8rem',
            border: '1px solid #00b4d8'
          }}>
            💻 Try: <strong>{discovery.nextStepCommand}</strong>
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={() => { 
          onAction(discovery.nextStepApp); 
          onClose(); 
        }}
        style={{
          width: '100%',
          background: getButtonColor(),
          border: 'none',
          color: getButtonTextColor(),
          padding: '0.85rem',
          borderRadius: '0.5rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          transition: 'transform 0.2s, opacity 0.2s'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.02)';
          e.target.style.opacity = '0.9';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.opacity = '1';
        }}
      >
        {getAppIcon()}
        Go to {getAppName()}
      </button>

      {/* Hint */}
      <p style={{
        margin: '1rem 0 0 0',
        fontSize: '0.7rem',
        opacity: 0.6,
        textAlign: 'center',
        color: '#9ca3af'
      }}>
        This popup will auto-close in 15 seconds
      </p>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default GuidancePopup;