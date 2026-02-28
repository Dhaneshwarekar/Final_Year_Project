import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Minus, Square, Award, HelpCircle } from 'lucide-react';
import FileSelector from './FileSelector';
import HashCalculator from './HashCalculator';
import HashComparer from './HashComparer';
import ThreatDatabase from './ThreatDatabase';
import DetailsPanel from './DetailsPanel';
import LearnPopup from './LearnPopup';
import GuidancePopup from '../../../components/os/GuidancePopup';
import { useCase } from '../../../contexts/CaseContext';
import './HashVerifier.css';

// ===========================================
// DISCOVERY 5 DEFINITION
// ===========================================
const discovery5 = {
  id: 5,
  name: 'Stolen Credentials Found',
  file: 'credentials.txt',
  xp: 15,
  description: 'All three victims\' passwords were captured by the attacker',
  evidence: 'sarah:Summer2024!\nmike:sales123\nlisa:finance2024',
  nextStep: 'Verify the file integrity with Hash Verifier',
  nextStepApp: 'hash-verifier',
  nextStepCommand: 'Open Hash Verifier and check credentials.txt'
};

/**
 * Main Hash Verifier component
 * Supports both Case #101 and Case #102
 */
const HashVerifier = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeCase } = useCase();
  
  // Get caseId from location state first, then context, then default to '101'
  const caseId = location.state?.caseId || activeCase || '101';
  
  // Get userId from navigation state
  const { userId } = location.state || {};

  // ===========================================
  // STATE MANAGEMENT
  // ===========================================
  const [selectedFile, setSelectedFile] = useState(null);
  const [calculatedHash, setCalculatedHash] = useState(null);
  const [activeView, setActiveView] = useState('main'); // 'main', 'details'
  const [showLearn, setShowLearn] = useState(false);
  const [showGuidance, setShowGuidance] = useState(false);
  const [currentDiscovery, setCurrentDiscovery] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [copyMessage, setCopyMessage] = useState('');

  // ===========================================
  // CASE #101 FILES
  // ===========================================
  const case101Files = [
    {
      name: 'auth.log',
      path: '/evidence/case101/logs/auth.log',
      size: '245 KB',
      modified: '2024-03-15 03:02:47',
      hashes: {
        md5: 'd41d8cd98f00b204e9800998ecf8427e',
        sha1: 'da39a3ee5e6b4b0d3255bfef95601890afd80709',
        sha256: 'a7f8c9d3b5e6f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6'
      }
    },
    {
      name: 'web_access.log',
      path: '/evidence/case101/logs/web_access.log',
      size: '1.2 MB',
      modified: '2024-03-15 03:15:22',
      hashes: {
        md5: '7b8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f',
        sha1: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
        sha256: 'b6e7d8c9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7'
      }
    },
    {
      name: 'employees.csv',
      path: '/evidence/case101/employees.csv',
      size: '45 KB',
      modified: '2024-03-10 14:30:00',
      hashes: {
        md5: 'c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
        sha1: 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1',
        sha256: 'c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6'
      }
    }
  ];

  // ===========================================
  // CASE #102 FILES
  // ===========================================
  const case102Files = [
    {
      name: 'smtp.log',
      path: '/evidence/case102/email_logs/smtp.log',
      size: '24 KB',
      modified: '2024-03-15 14:33:22',
      hashes: {
        md5: 'e8f2a1b3c4d5e6f7a8b9c0d1e2f3a4b5',
        sha1: 'f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0',
        sha256: 'd1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2'
      }
    },
    {
      name: 'proxy.log',
      path: '/evidence/case102/network_logs/proxy.log',
      size: '32 KB',
      modified: '2024-03-15 15:30:44',
      hashes: {
        md5: 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8',
        sha1: 'b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
        sha256: 'e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6'
      }
    },
    {
      name: 'firewall.log',
      path: '/evidence/case102/network_logs/firewall.log',
      size: '28 KB',
      modified: '2024-03-15 23:23:07',
      hashes: {
        md5: 'f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0',
        sha1: 'a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5',
        sha256: 'f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6'
      }
    },
    {
      name: 'phishing_page.html',
      path: '/evidence/case102/suspicious_files/phishing_page.html',
      size: '4 KB',
      modified: '2024-03-15 14:45:00',
      hashes: {
        md5: 'b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6',
        sha1: 'c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1',
        sha256: 'a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4'
      }
    },
    {
      name: 'credentials.txt',
      path: '/evidence/case102/suspicious_files/credentials.txt',
      size: '2 KB',
      modified: '2024-03-15 14:45:17',
      hashes: {
        md5: 'a47f8c3d9e2b1a5f6c8d7e9f0a1b2c3d',
        sha1: 'b58f9d4e3c2a1b6f7e8d9c0a1b2c3d4e5f6a7b8c9',
        sha256: 'a47f8c3d9e2b1a5f6c8d7e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1'
      }
    },
    {
      name: 'hashes.txt',
      path: '/evidence/case102/suspicious_files/hashes.txt',
      size: '1 KB',
      modified: '2024-03-15 14:46:00',
      hashes: {
        md5: 'c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1',
        sha1: 'd7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6',
        sha256: 'b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4'
      }
    }
  ];

  // Get files based on current case
  const getCaseFiles = () => {
    return caseId === '102' ? case102Files : case101Files;
  };

  // Get expected hashes based on case and file
  const getExpectedHashes = (file) => {
    if (!file) return null;
    
    // For Case #102 credentials.txt, use the hash from hashes.txt
    if (caseId === '102' && file.name === 'credentials.txt') {
      return {
        md5: 'a47f8c3d9e2b1a5f6c8d7e9f0a1b2c3d',
        sha1: 'b58f9d4e3c2a1b6f7e8d9c0a1b2c3d4e5f6a7b8c9',
        sha256: 'a47f8c3d9e2b1a5f6c8d7e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1'
      };
    }
    
    // Default to file's own hashes
    return file.hashes;
  };

  // Check if current file is credentials.txt in Case #102
  const isCredentialsFile = () => {
    return caseId === '102' && selectedFile?.name === 'credentials.txt';
  };

  // ===========================================
  // HANDLERS
  // ===========================================
  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setCalculatedHash(null); // Reset hash when new file selected
    
    // Show guidance for credentials.txt
    if (caseId === '102' && file.name === 'credentials.txt') {
      // Check if discovery already found
      const discoveries = JSON.parse(localStorage.getItem('case102_discoveries') || '[]');
      if (!discoveries.includes(5)) {
        // Show guidance popup
        setCurrentDiscovery(discovery5);
        setShowGuidance(true);
      }
    }
  };

  const handleHashCalculated = (hash) => {
    setCalculatedHash(hash);
  };

  const handleAddToNotes = (threatData) => {
    // Create note for Case Notes
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

    const threatInfo = threatData?.clean 
      ? 'File is clean - no malware detected'
      : `⚠️ Malware detected: ${threatData?.name} (${threatData?.family}) - ${threatData?.risk} risk`;
    
    const note = {
      id: Date.now(),
      timestamp,
      title: 'Hash Verification Result',
      content: `File: ${selectedFile?.name}\nHash: ${calculatedHash}\n${threatInfo}`,
      source: 'Hash Verifier',
      xp: 0,
      evidence: calculatedHash,
      isDiscovery: false
    };

    // Save to localStorage
    const existingNotes = JSON.parse(localStorage.getItem(`case${caseId}_notes`) || '[]');
    const updatedNotes = [note, ...existingNotes];
    localStorage.setItem(`case${caseId}_notes`, JSON.stringify(updatedNotes));

    // Show success message
    setCopyMessage('📋 Added to Case Notes');
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);

    // Dispatch event for Case Notes
    window.dispatchEvent(new CustomEvent('case-notes-updated', { 
      detail: { note, discoveries: [], xp: 0 }
    }));
  };

  // Get total discoveries based on case
  const getTotalDiscoveries = () => {
    return caseId === '102' ? 6 : 5;
  };

  // Get discoveries count from localStorage
  const getDiscoveriesCount = () => {
    const saved = localStorage.getItem(`case${caseId}_discoveries`);
    return saved ? JSON.parse(saved).length : 0;
  };

  // Get case color
  const getCaseColor = () => {
    return caseId === '102' ? '#06b6d4' : '#eab308';
  };

  return (
    <div className="hash-verifier-container">
      {/* Guidance Popup */}
      {showGuidance && currentDiscovery && (
        <GuidancePopup
          discovery={currentDiscovery}
          onClose={() => setShowGuidance(false)}
          onAction={(app) => {
            if (app === 'hash-verifier') {
              // Stay here
              setShowGuidance(false);
            }
          }}
        />
      )}

      {/* Success Toast */}
      {copySuccess && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: copyMessage.includes('DISCOVERY') ? '#fbbf24' : '#00b4d8',
          color: copyMessage.includes('DISCOVERY') ? '#000' : '#fff',
          padding: '1rem',
          borderRadius: '0.5rem',
          zIndex: 1000,
          animation: 'slideIn 0.3s ease',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
          {copyMessage}
        </div>
      )}

      {/* Window Header */}
      <div className="hash-header">
        <div className="flex items-center gap-3">
          <span style={{ fontSize: '1.2rem' }}>🔐</span>
          <span className="text-white font-semibold">HASH VERIFIER v1.0</span>
          
          {/* XP and Discoveries */}
          <div className="flex items-center gap-2 ml-4">
            <Award className="w-4 h-4 text-yellow-400" />
            <span className="text-white text-sm">
              {localStorage.getItem(`case${caseId}_xp`) || '0'} XP
            </span>
            <span className="text-gray-400 ml-2">
              Discoveries: {getDiscoveriesCount()}/{getTotalDiscoveries()}
            </span>
          </div>

          {/* Case Badge */}
          <div style={{
            background: caseId === '102' ? 'rgba(6,182,212,0.15)' : 'rgba(234,179,8,0.15)',
            border: `1px solid ${getCaseColor()}`,
            borderRadius: '1rem',
            padding: '0.2rem 0.8rem',
            fontSize: '0.75rem',
            color: getCaseColor(),
          }}>
            Case #{caseId}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/os-desktop')} className="window-control">
            <Minus className="w-4 h-4" />
          </button>
          <button onClick={() => navigate('/os-desktop')} className="window-control">
            <Square className="w-4 h-4" />
          </button>
          <button onClick={() => navigate('/os-desktop')} className="window-control hover:bg-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="hash-main">
        {/* Sidebar */}
        <div className="hash-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-section-title">QUICK ACTIONS</h3>
            <button 
              className={`sidebar-action-btn ${activeView === 'main' ? 'active' : ''}`}
              onClick={() => setActiveView('main')}
            >
              <span className="sidebar-action-icon">🔐</span>
              <span>Hash Verifier</span>
            </button>
            <button 
              className={`sidebar-action-btn ${activeView === 'details' ? 'active' : ''}`}
              onClick={() => setActiveView('details')}
            >
              <span className="sidebar-action-icon">📚</span>
              <span>Learning Details</span>
            </button>
            <button 
              className="sidebar-action-btn"
              onClick={() => setShowLearn(true)}
            >
              <span className="sidebar-action-icon">❓</span>
              <span>Quick Help</span>
            </button>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-section-title">HASH STATS</h3>
            <div style={{ padding: '0 1rem', color: '#9ca3af', fontSize: '0.75rem' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <div>SHA-256:</div>
                <div style={{ color: '#22c55e', fontSize: '0.7rem', wordBreak: 'break-all' }}>
                  {calculatedHash?.substring(0, 20)}...
                </div>
              </div>
              <div>
                <div>Algorithm:</div>
                <div style={{ color: selectedFile ? '#3b82f6' : '#6b7280' }}>
                  {selectedFile ? 'Ready' : 'No file'}
                </div>
              </div>
            </div>
          </div>

          {/* Case Info for Case #102 */}
          {caseId === '102' && (
            <div className="sidebar-section">
              <h3 className="sidebar-section-title">CASE #102 FILES</h3>
              <div style={{ padding: '0 1rem', color: '#9ca3af', fontSize: '0.7rem' }}>
                <p>📧 smtp.log - Email logs</p>
                <p>🌐 proxy.log - Web traffic</p>
                <p>🛡️ firewall.log - Network</p>
                <p>⚠️ credentials.txt - Stolen credentials</p>
                <p>📋 hashes.txt - Expected hashes</p>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="hash-content">
          <div className="scrollable-content">
            {activeView === 'details' ? (
              <DetailsPanel />
            ) : (
              <>
                {/* Step 1: File Selection */}
                <FileSelector 
                  selectedFile={selectedFile}
                  onFileSelect={handleFileSelect}
                  caseFiles={getCaseFiles()}
                  caseId={caseId}
                />

                {/* Step 2: Hash Calculation */}
                <HashCalculator 
                  selectedFile={selectedFile}
                  onHashCalculated={handleHashCalculated}
                  caseId={caseId}
                />

                {/* Step 3: Compare & Verify */}
                {calculatedHash && selectedFile && (
                  <HashComparer 
                    calculatedHash={calculatedHash}
                    expectedHashes={getExpectedHashes(selectedFile)}
                    fileName={selectedFile.name}
                    caseId={caseId}
                    onVerified={() => {
                      // If this is credentials.txt in Case #102, mark discovery as found
                      if (isCredentialsFile()) {
                        const discoveries = JSON.parse(localStorage.getItem('case102_discoveries') || '[]');
                        if (!discoveries.includes(5)) {
                          const updatedDiscoveries = [...discoveries, 5];
                          localStorage.setItem('case102_discoveries', JSON.stringify(updatedDiscoveries));
                          
                          const currentXP = parseInt(localStorage.getItem('case102_xp') || '0');
                          localStorage.setItem('case102_xp', (currentXP + 15).toString());
                          
                          // Show success message
                          setCopyMessage('🎉 DISCOVERY 5 COMPLETE! +15 XP');
                          setCopySuccess(true);
                          setTimeout(() => setCopySuccess(false), 3000);
                          
                          // Refresh the page or update UI
                          window.dispatchEvent(new CustomEvent('case-notes-updated'));
                        }
                      }
                    }}
                  />
                )}

                {/* Threat Database */}
                {calculatedHash && (
                  <ThreatDatabase 
                    hash={calculatedHash}
                    onAddToNotes={handleAddToNotes}
                    caseId={caseId}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="hash-statusbar">
        <div className="status-left">
          <span>Ready</span>
          {selectedFile && (
            <span style={{ marginLeft: '1rem', color: '#3b82f6' }}>
              File: {selectedFile.name}
            </span>
          )}
          {isCredentialsFile() && (
            <span style={{ marginLeft: '1rem', color: '#fbbf24' }}>
              ⭐ Discovery 5: Verify with hashes.txt
            </span>
          )}
          {activeView === 'details' && (
            <span style={{ marginLeft: '1rem', color: '#f59e0b' }}>
              📚 Learning Mode - Hash Basics
            </span>
          )}
        </div>
        <div className="status-right">
          <span>Case #{caseId}: {caseId === '102' ? 'The Phishing Trap' : 'The Unauthorized Login'}</span>
        </div>
      </div>

      {/* Learn Popup */}
      {showLearn && (
        <LearnPopup onClose={() => setShowLearn(false)} />
      )}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default HashVerifier;