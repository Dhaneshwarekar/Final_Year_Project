import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Copy, Award, FileText, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import GuidancePopup from '../../../components/os/GuidancePopup';
import './TextViewer.css';

// Discovery definitions
const discovery5 = {
  id: 5,
  name: 'Stolen Credentials Found',
  description: 'All three victims\' passwords were captured by the attacker',
  xp: 15,
  nextStep: 'Check if the attacker tried to use these credentials',
  nextStepApp: 'log-viewer',
  nextStepCommand: 'Open firewall.log and look for 185.142.53.89',
  evidence: 'Found captured credentials for sarah, mike, and lisa'
};

// Default content for credentials.txt if not provided
const defaultCredentialsContent = `[SIMULATED DATA - CAPTURED BY ATTACKER]

TIMESTAMP: 2024-03-15 14:40:22
──────────────────────────────────
Username: sarah@company.com
Password: Summer2024!
──────────────────────────────────

TIMESTAMP: 2024-03-15 14:42:35
──────────────────────────────────
Username: mike@company.com
Password: sales123
──────────────────────────────────

TIMESTAMP: 2024-03-15 14:45:17
──────────────────────────────────
Username: lisa@company.com
Password: finance2024
──────────────────────────────────

[ATTACKER NOTE]
"HR account has access to employee records.
 Sales account is low value.
 Finance account has payment systems.
 Will try these on company VPN tonight."`;

const TextViewer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get data from navigation state with fallbacks
  const { 
    file = 'Unknown file', 
    filePath = '', 
    caseId = '101', 
    userId = null, 
    content: passedContent,
    isDiscovery = false,
    discoveryId = null,
    discoveryName = null,
    discoveryXp = 0
  } = location.state || {};
  
  // Use passed content or default for credentials.txt
  const [content, setContent] = useState('');
  
  // State
  const [showGuidance, setShowGuidance] = useState(false);
  const [currentDiscovery, setCurrentDiscovery] = useState(null);
  const [discoveryFound, setDiscoveryFound] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [copyMessage, setCopyMessage] = useState('');
  const [pendingNavigation, setPendingNavigation] = useState(null);

  // Initialize content
  useEffect(() => {
    // If content was passed, use it
    if (passedContent) {
      setContent(passedContent);
    } 
    // If this is credentials.txt and no content passed, use default
    else if (file === 'credentials.txt') {
      setContent(defaultCredentialsContent);
    }
    // Otherwise show placeholder
    else {
      setContent(`Content of ${file}\n\nNo content available.`);
    }
    
    console.log('📄 TextViewer loaded:', { file, caseId, contentLength: content.length });
  }, [file, passedContent]);

  // Check if discovery already found
  useEffect(() => {
    if (caseId === '102' && file === 'credentials.txt') {
      const discoveries = JSON.parse(localStorage.getItem('case102_discoveries') || '[]');
      if (discoveries.includes(5)) {
        setDiscoveryFound(true);
      }
    }
  }, [caseId, file]);

  // Handle discovery save
  const handleDiscoverySave = () => {
    if (caseId !== '102' || file !== 'credentials.txt' || discoveryFound) return;
    
    // Create note
    const now = new Date();
    const timestamp = now.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(',', '');

    const evidenceText = `STOLEN CREDENTIALS FOUND:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The attacker captured the following credentials:

👤 SARAH (HR)
   Email: sarah@company.com
   Password: Summer2024!

👤 MIKE (Sales)
   Email: mike@company.com
   Password: sales123

👤 LISA (Finance)
   Email: lisa@company.com
   Password: finance2024

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ All three victims fell for the phishing email!
✅ Discovery #5: +15 XP`;

    const note = {
      id: Date.now(),
      noteId: Date.now(),
      timestamp,
      title: 'DISCOVERY: Stolen Credentials Found',
      content: evidenceText,
      source: 'credentials.txt',
      xp: 15,
      isDiscovery: true,
      caseId: '102',
      discoveryId: 5,
      createdAt: new Date().toISOString(),
      type: 'note'
    };

    // Save to localStorage
    const existingNotes = JSON.parse(localStorage.getItem('case102_notes') || '[]');
    const updatedNotes = [note, ...existingNotes];
    localStorage.setItem('case102_notes', JSON.stringify(updatedNotes));

    // Update discoveries
    const discoveries = JSON.parse(localStorage.getItem('case102_discoveries') || '[]');
    const updatedDiscoveries = [...discoveries, 5];
    localStorage.setItem('case102_discoveries', JSON.stringify(updatedDiscoveries));

    // Update XP
    const currentXP = parseInt(localStorage.getItem('case102_xp') || '0');
    localStorage.setItem('case102_xp', (currentXP + 15).toString());

    // Save to MongoDB
    if (userId) {
      const cleanNote = {
        id: note.id,
        noteId: note.noteId,
        timestamp: note.timestamp,
        title: note.title,
        content: note.content,
        source: note.source,
        isConclusion: false,
        caseId: '102',
        createdAt: note.createdAt,
        type: 'note'
      };
      
      fetch('http://localhost:5000/api/level2progresses/add-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          note: cleanNote,
          xpEarned: 15,
          discoveryId: 5
        })
      }).catch(err => console.error('Error saving to MongoDB:', err));
    }

    // Show success and guidance
    setDiscoveryFound(true);
    setCopyMessage('🎉 NEW DISCOVERY! +15 XP');
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
    
    // Show guidance popup
    const popupDiscovery = {
      id: discovery5.id,
      name: discovery5.name,
      description: discovery5.description,
      xp: discovery5.xp,
      nextStep: discovery5.nextStep,
      nextStepApp: discovery5.nextStepApp,
      nextStepCommand: discovery5.nextStepCommand,
      evidence: evidenceText
    };
    
    setCurrentDiscovery(popupDiscovery);
    setShowGuidance(true);
    
    // Store navigation data
    setPendingNavigation({
      userId: userId,
      caseId: '#102',
      newNote: note,
      discoveryId: 5,
      xpEarned: 15,
      isNewDiscovery: true
    });

    // Dispatch event
    window.dispatchEvent(new CustomEvent('case-notes-updated', { 
      detail: { 
        caseId: '102',
        notes: updatedNotes, 
        discoveries: [5], 
        xp: 15 
      }
    }));
  };

  // Handle popup actions
  const handlePopupAction = (app) => {
    console.log('Popup action clicked:', app);
    setShowGuidance(false);
    setCurrentDiscovery(null);
    
    if (app === 'log-viewer') {
      if (pendingNavigation) {
        navigate('/log-viewer', { state: { userId, caseId: '#102', file: 'firewall.log' } });
        setPendingNavigation(null);
      } else {
        navigate('/log-viewer', { state: { userId, caseId: '#102', file: 'firewall.log' } });
      }
    } else if (app === 'case-notes') {
      if (pendingNavigation) {
        navigate('/case-notes', { state: pendingNavigation });
        setPendingNavigation(null);
      } else {
        navigate('/case-notes', { state: { userId, caseId: '#102' } });
      }
    } else if (app === 'file-explorer') {
      navigate('/file-explorer', { state: { userId, caseId: '#102' } });
    }
  };

  // Handle popup close
  const handlePopupClose = () => {
    console.log('Popup closed');
    setShowGuidance(false);
    setCurrentDiscovery(null);
    
    if (pendingNavigation) {
      navigate('/case-notes', { state: pendingNavigation });
      setPendingNavigation(null);
    }
  };

  // Handle copy content
  const handleCopyContent = () => {
    navigator.clipboard.writeText(content);
    setCopyMessage('📋 Content copied to clipboard');
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  // Check if this file has a discovery
  const hasDiscovery = (caseId === '102' && file === 'credentials.txt' && !discoveryFound);

  return (
    <div className="text-viewer-container">
      {/* Guidance Popup */}
      {showGuidance && currentDiscovery && (
        <GuidancePopup
          discovery={currentDiscovery}
          onClose={handlePopupClose}
          onAction={handlePopupAction}
        />
      )}

      {/* Success Toast */}
      {copySuccess && (
        <div className={`copy-toast ${copyMessage.includes('DISCOVERY') ? 'discovery' : 'normal'}`}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: copyMessage.includes('DISCOVERY') ? '#fbbf24' : '#00b4d8',
            color: copyMessage.includes('DISCOVERY') ? '#000' : '#fff',
            padding: '1rem',
            borderRadius: '0.5rem',
            zIndex: 1000,
            animation: 'slideIn 0.3s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
          {copyMessage}
        </div>
      )}

      {/* Header */}
      <div className="text-viewer-header" style={{
        background: '#1e2139',
        borderBottom: '1px solid #374151',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <FileText size={18} style={{ color: '#9ca3af' }} />
          <span style={{ color: 'white', fontWeight: '600' }}>TEXT VIEWER - {file}</span>
          <div style={{
            background: caseId === '102' ? 'rgba(6,182,212,0.15)' : 'rgba(234,179,8,0.15)',
            border: `1px solid ${caseId === '102' ? '#06b6d4' : '#eab308'}`,
            borderRadius: '1rem',
            padding: '0.2rem 0.8rem',
            fontSize: '0.75rem',
            color: caseId === '102' ? '#06b6d4' : '#eab308'
          }}>
            Case #{caseId}
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={handleCopyContent} style={{
            background: 'transparent',
            border: '1px solid #06b6d4',
            color: '#06b6d4',
            padding: '0.375rem 1rem',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem'
          }}>
            <Copy size={14} /> Copy Text
          </button>
          {hasDiscovery && (
            <button onClick={handleDiscoverySave} style={{
              background: '#fbbf24',
              border: 'none',
              color: '#000',
              padding: '0.375rem 1rem',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 'bold'
            }}>
              <Award size={14} /> SAVE DISCOVERY #5
            </button>
          )}
          <button onClick={() => navigate('/os-desktop')} style={{
            padding: '0.375rem',
            borderRadius: '0.25rem',
            border: 'none',
            background: 'transparent',
            color: '#9ca3af',
            cursor: 'pointer',
            fontSize: '1rem',
            width: '32px',
            height: '32px'
          }}>✕</button>
        </div>
      </div>

      {/* File Info Bar */}
      <div style={{
        background: '#1e2139',
        borderBottom: '1px solid #374151',
        padding: '0.5rem 1rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#9ca3af',
          fontSize: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#6b7280', fontWeight: '600' }}>Path:</span>
            <span style={{ color: '#00b4d8', fontFamily: 'monospace' }}>
              {filePath || `/evidence/case${caseId}/suspicious_files/${file}`}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#6b7280', fontWeight: '600' }}>Size:</span>
            <span style={{ color: '#00b4d8', fontFamily: 'monospace' }}>{content.length} bytes</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '1rem',
        background: '#1e2139'
      }}>
        <pre style={{
          background: '#1a1d3a',
          color: '#e5e7eb',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.875rem',
          lineHeight: '1.6',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          border: '1px solid #374151',
          margin: 0
        }}>
          {content}
        </pre>
        
        {/* Discovery Hint */}
        {hasDiscovery && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            background: 'rgba(251,191,36,0.1)',
            border: '1px solid #fbbf24',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#fbbf24'
          }}>
            <AlertCircle size={16} />
            <span>This file contains a discovery! Click "SAVE DISCOVERY #5" to earn 15 XP.</span>
          </div>
        )}
        
        {/* Already Found */}
        {discoveryFound && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            background: 'rgba(16,185,129,0.1)',
            border: '1px solid #10b981',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#10b981'
          }}>
            <CheckCircle size={16} />
            <span>Discovery #5 already found! +15 XP earned.</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        background: '#1a1d3a',
        borderTop: '1px solid #374151',
        padding: '0.5rem 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#9ca3af',
        fontSize: '0.75rem'
      }}>
        <div>
          <span>{file} • Text File</span>
        </div>
        <div>
          <span style={{ color: '#06b6d4' }}>Line 1 • {content.split('\n').length} lines</span>
        </div>
      </div>
    </div>
  );
};

export default TextViewer;