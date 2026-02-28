import React, { useEffect } from 'react';
import { Zap, Terminal, BookOpen, X } from 'lucide-react';

const GuidancePopup = ({ discovery, onClose, onAction }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 15000);
    return () => clearTimeout(timer);
  }, [onClose]);

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
      animation: 'slideUp 0.3s ease'
    }}>
      <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
        <X size={16} />
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ background: '#fbbf24', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🎉</div>
        <div>
          <h3 style={{ color: '#fbbf24', margin: 0 }}>NEW DISCOVERY!</h3>
          <p style={{ color: '#00b4d8', margin: 0 }}>{discovery.name}</p>
        </div>
      </div>

      <div style={{ background: '#fbbf2410', border: '1px solid #fbbf24', borderRadius: '2rem', padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Zap size={16} color="#fbbf24" />
        <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>+{discovery.xp} XP</span>
      </div>

      <div style={{ background: '#1a1d3a', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', borderLeft: '4px solid #fbbf24' }}>
        <p style={{ color: '#e5e7eb', margin: '0 0 0.5rem 0' }}>{discovery.description}</p>
        <div style={{ background: '#0a0a0a', padding: '0.75rem', borderRadius: '0.25rem', fontFamily: 'monospace', color: '#00ff00', fontSize: '0.85rem' }}>
          {discovery.evidence}
        </div>
      </div>

      <div style={{ background: '#00b4d810', border: '1px solid #00b4d8', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem' }}>
        <p style={{ color: '#00b4d8', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>🔍 WHAT'S NEXT?</p>
        <p style={{ color: '#e5e7eb', margin: 0 }}>{discovery.nextStep}</p>
        {discovery.nextStepCommand && (
          <div style={{ marginTop: '0.75rem', background: '#0a0a0a', padding: '0.5rem', borderRadius: '0.25rem', fontFamily: 'monospace', color: '#00b4d8' }}>
            💻 Try: <strong>{discovery.nextStepCommand}</strong>
          </div>
        )}
      </div>

      <button
        onClick={() => { onAction(discovery.nextStepApp); onClose(); }}
        style={{
          width: '100%',
          background: discovery.nextStepApp === 'terminal' ? '#00ff00' : '#00b4d8',
          border: 'none',
          color: discovery.nextStepApp === 'terminal' ? '#000' : '#fff',
          padding: '0.85rem',
          borderRadius: '0.5rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}
      >
        {discovery.nextStepApp === 'terminal' ? <Terminal size={20} /> : <BookOpen size={20} />}
        Go to {discovery.nextStepApp === 'terminal' ? 'Terminal' : 'Case Notes'}
      </button>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default GuidancePopup;