import React, { useEffect } from 'react';
import { Award, Zap, CheckCircle } from 'lucide-react';

const DiscoveryNotification = ({ message, xp, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      color: 'white',
      padding: '1.5rem 2.5rem',
      borderRadius: '1rem',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 0 4px rgba(59,130,246,0.3)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      animation: 'popIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      border: '1px solid rgba(255,255,255,0.2)'
    }}>
      <div style={{ fontSize: '3rem' }}>🎉</div>
      <h2 style={{ margin: 0, fontSize: '1.5rem' }}>DISCOVERY!</h2>
      <p style={{ margin: 0, textAlign: 'center', fontSize: '1.1rem' }}>{message}</p>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: 'rgba(255,255,255,0.2)',
        padding: '0.5rem 1.5rem',
        borderRadius: '2rem',
        marginTop: '0.5rem'
      }}>
        <Zap className="w-5 h-5" />
        <span style={{ fontWeight: 'bold' }}>+{xp} XP</span>
      </div>
      <div style={{
        width: '100%',
        height: '4px',
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '2px',
        marginTop: '0.5rem',
        overflow: 'hidden'
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          background: 'white',
          animation: 'shrink 4s linear forwards'
        }} />
      </div>
      <style>{`
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default DiscoveryNotification;