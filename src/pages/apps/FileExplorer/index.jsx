import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Folder, Search, X, Minus, Square, 
  ChevronLeft, ChevronRight, ArrowUp, 
  Grid, List, Award, CheckCircle, Zap,
  Eye, FileText, Shield, AlertTriangle
} from 'lucide-react';
import Sidebar from './Sidebar';
import FileList from './FileList';
import Breadcrumb from './Breadcrumb';
import { useCase } from '../../../contexts/CaseContext';
import { getFileSystemForCase } from '../../../data/fileSystems';
import { getDiscoveriesForCase } from '../../../data/discoveryDefinitions';
import './FileExplorer.css';

const FileExplorer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeCase, caseData } = useCase();
  
  // Get caseId from location state or from context
  const caseId = location.state?.caseId || activeCase;
  
  // Log to verify
  useEffect(() => {
    console.log(`📁 FileExplorer: Loading Case #${caseId}`);
  }, [caseId]);
  
  // State management
  const [currentPath, setCurrentPath] = useState([`Evidence (D:)`, `Case #${caseId}`]);
  const [viewMode, setViewMode] = useState('details');
  const [searchQuery, setSearchQuery] = useState('');
  const [history, setHistory] = useState([[`Evidence (D:)`, `Case #${caseId}`]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  
  // File system - dynamically loaded based on case
  const [fileSystem, setFileSystem] = useState(() => getFileSystemForCase(caseId));
  
  // Discovery definitions for this case
  const discoveryDefs = getDiscoveriesForCase(caseId);
  const totalDiscoveries = discoveryDefs.length;
  
  // Track discoveries (stored per case)
  const [discoveries, setDiscoveries] = useState(() => {
    const saved = localStorage.getItem(`case${caseId}_discoveries`);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [totalXP, setTotalXP] = useState(() => {
    const saved = localStorage.getItem(`case${caseId}_xp`);
    return saved ? parseInt(saved) : 0;
  });

  // Reset when case changes
  useEffect(() => {
    console.log(`📁 File Explorer loading Case #${caseId}`);
    
    // Load correct file system
    setFileSystem(getFileSystemForCase(caseId));
    
    // Reset path to case root
    const newPath = [`Evidence (D:)`, `Case #${caseId}`];
    setCurrentPath(newPath);
    setHistory([newPath]);
    setHistoryIndex(0);
    
    // Load discoveries for this case
    const savedDiscoveries = localStorage.getItem(`case${caseId}_discoveries`);
    setDiscoveries(savedDiscoveries ? JSON.parse(savedDiscoveries) : []);
    
    const savedXP = localStorage.getItem(`case${caseId}_xp`);
    setTotalXP(savedXP ? parseInt(savedXP) : 0);
    
  }, [caseId]);

  // Save discoveries to localStorage (per case)
  useEffect(() => {
    localStorage.setItem(`case${caseId}_discoveries`, JSON.stringify(discoveries));
    localStorage.setItem(`case${caseId}_xp`, totalXP.toString());
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('case-discoveries-updated', { 
      detail: { caseId, discoveries, totalXP } 
    }));
  }, [discoveries, totalXP, caseId]);

  // ===========================================
  // GET CURRENT FOLDER CONTENTS
  // ===========================================
  const getCurrentContents = () => {
    let current = fileSystem;
    for (const segment of currentPath) {
      if (current[segment]?.children) {
        current = current[segment].children;
      } else if (current[segment]) {
        return { [segment]: current[segment] };
      } else {
        return {};
      }
    }
    return current;
  };

  const currentContents = getCurrentContents();

  // ===========================================
  // NAVIGATION FUNCTIONS
  // ===========================================
  const navigateTo = (path) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(path);
    setHistory(newHistory);
    setHistoryIndex(historyIndex + 1);
    setCurrentPath(path);
    setSelectedFile(null);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentPath(history[historyIndex - 1]);
      setSelectedFile(null);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentPath(history[historyIndex + 1]);
      setSelectedFile(null);
    }
  };

  const goUp = () => {
    if (currentPath.length > 1) {
      const newPath = currentPath.slice(0, -1);
      navigateTo(newPath);
    }
  };

  // ===========================================
  // HANDLE FILE/FOLDER CLICK
  // ===========================================
  const handleItemClick = (itemName, item) => {
    setSelectedFile(itemName);
    
    if (item.type === 'folder') {
      const newPath = [...currentPath, itemName];
      navigateTo(newPath);
    }
  };

  // ===========================================
  // FIXED: HANDLE FILE DOUBLE-CLICK - WITH DISCOVERY DETECTION
  // ===========================================
  const handleItemDoubleClick = (itemName, item) => {
    if (item.type === 'folder') {
      const newPath = [...currentPath, itemName];
      navigateTo(newPath);
    } else if (item.type === 'file') {
      // Get userId from localStorage
      const storedUser = localStorage.getItem('user');
      let userId = null;
      
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          userId = user._id;
        } catch (e) {
          console.error('Error parsing user from localStorage:', e);
        }
      }
      
      // Get the full file path for the viewer
      const filePath = [...currentPath, itemName].join('/');
      
      console.log(`📂 Opening file: ${itemName} (${item.type})`);
      console.log(`📂 File path: ${filePath}`);
      console.log(`📂 Case ID: ${caseId}`);
      
      // ===== FIXED: Check if this file contains a discovery =====
      const discovery = checkFileForDiscovery(itemName, item.content);
      if (discovery) {
        console.log(`🎯 File contains discovery: ${discovery.name} (ID: ${discovery.id})`);
      }
      
      // Determine which viewer to open based on file type
      if (itemName.endsWith('.log')) {
        navigate('/log-viewer', { 
          state: { 
            file: itemName,
            filePath: filePath,
            caseId: caseId,
            userId: userId,
            content: item.content
          } 
        });
      } 
      else if (itemName.endsWith('.csv')) {
        navigate('/csv-viewer', {
          state: {
            file: itemName,
            filePath: filePath,
            caseId: caseId,
            userId: userId,
            content: item.content
          }
        });
      } 
      else if (itemName.endsWith('.txt') || itemName.endsWith('.txt')) {
        // For credentials.txt and other text files
        navigate('/text-viewer', {
          state: {
            file: itemName,
            filePath: filePath,
            caseId: caseId,
            userId: userId,
            content: item.content,
            isDiscovery: discovery ? true : false,
            discoveryId: discovery?.id || null,
            discoveryName: discovery?.name || null,
            discoveryXp: discovery?.xp || 0
          }
        });
      }
      else if (itemName.endsWith('.html')) {
        navigate('/html-viewer', {
          state: {
            file: itemName,
            filePath: filePath,
            caseId: caseId,
            userId: userId,
            content: item.content
          }
        });
      }
    }
  };

  // ===========================================
  // CHECK FILE FOR DISCOVERY
  // ===========================================
  const checkFileForDiscovery = (fileName, content) => {
    if (!content) return null;
    
    if (caseId === '102') {
      // Discovery 3: phishing_page.html
      if (fileName === 'phishing_page.html' && content.includes('evil-server.com')) {
        return discoveryDefs.find(d => d.id === 3);
      }
      // Discovery 5: credentials.txt
      if (fileName === 'credentials.txt' && 
          (content.includes('Summer2024') || content.includes('sarah'))) {
        console.log('✅ Discovery #5 detected in credentials.txt');
        return discoveryDefs.find(d => d.id === 5);
      }
    } else if (caseId === '101') {
      // Discovery 3: shifts.csv
      if (fileName === 'shifts.csv' && content.includes('OFF')) {
        return discoveryDefs.find(d => d.id === 3);
      }
      // Discovery 4: permissions.txt
      if (fileName === 'permissions.txt' && content.includes('HR_READ')) {
        return discoveryDefs.find(d => d.id === 4);
      }
    }
    return null;
  };

  // ===========================================
  // RENDER PROGRESS BAR
  // ===========================================
  const renderProgressBar = () => {
    const percentage = (discoveries.length / totalDiscoveries) * 100;
    return (
      <div style={{
        background: '#1a1d3a',
        borderRadius: '4px',
        height: '6px',
        width: '150px',
        overflow: 'hidden'
      }}>
        <div style={{
          background: '#3b82f6',
          width: `${percentage}%`,
          height: '100%',
          transition: 'width 0.3s ease'
        }} />
      </div>
    );
  };

  // Get case color for header
  const getCaseColor = () => {
    return caseId === '101' ? 'yellow' : 'cyan';
  };

  // ===========================================
  // RENDER
  // ===========================================
  return (
    <div className="file-explorer-container">
      {/* Window Header with Case Info */}
      <div className="file-explorer-header">
        <div className="flex items-center gap-3">
          <Folder className={`w-5 h-5 text-${getCaseColor()}-400`} />
          <span className="text-white font-semibold">
            FILE EXPLORER - Case {caseData?.caseNumber || caseId}: {caseData?.caseTitle || `Case #${caseId}`}
          </span>
          <span className="text-gray-400 text-sm ml-4">[_][□][✕]</span>
          
          {/* Discovery Progress */}
          <div style={{
            marginLeft: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award className="w-4 h-4 text-yellow-400" />
              <span className="text-white text-sm">{totalXP} XP</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle className={`w-4 h-4 ${discoveries.length === totalDiscoveries ? 'text-green-500' : 'text-gray-500'}`} />
              <span className="text-gray-300 text-sm">{discoveries.length}/{totalDiscoveries} Discoveries</span>
              {renderProgressBar()}
            </div>

            {/* Case Badge */}
            <div style={{
              background: caseId === '101' ? 'rgba(234,179,8,0.2)' : 'rgba(6,182,212,0.2)',
              border: `1px solid ${caseId === '101' ? '#eab308' : '#06b6d4'}`,
              borderRadius: '1rem',
              padding: '0.2rem 0.8rem',
              fontSize: '0.75rem',
              color: caseId === '101' ? '#eab308' : '#06b6d4',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}>
              <Shield size={12} />
              <span>Case {caseData?.caseNumber || caseId}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/os-desktop')} className="window-control hover:bg-gray-700 text-gray-300">
            <Minus className="w-4 h-4" />
          </button>
          <button onClick={() => navigate('/os-desktop')} className="window-control hover:bg-gray-700 text-gray-300">
            <Square className="w-4 h-4" />
          </button>
          <button onClick={() => navigate('/os-desktop')} className="window-control hover:bg-red-600 text-gray-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Toolbar */}
      <div className="file-explorer-toolbar">
        <div className="toolbar-left">
          <button 
            className={`toolbar-btn ${historyIndex <= 0 ? 'disabled' : ''}`}
            onClick={goBack}
            disabled={historyIndex <= 0}
            title="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            className={`toolbar-btn ${historyIndex >= history.length - 1 ? 'disabled' : ''}`}
            onClick={goForward}
            disabled={historyIndex >= history.length - 1}
            title="Forward"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button 
            className={`toolbar-btn ${currentPath.length <= 1 ? 'disabled' : ''}`}
            onClick={goUp}
            disabled={currentPath.length <= 1}
            title="Up"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>

        <div className="toolbar-center">
          <div className="address-bar">
            <Breadcrumb path={currentPath} onNavigate={setCurrentPath} />
          </div>
        </div>

        <div className="toolbar-right">
          <div className="search-box">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'details' ? 'active' : ''}`}
              onClick={() => setViewMode('details')}
              title="Details view"
            >
              <List className="w-4 h-4" />
            </button>
            <button 
              className={`view-btn ${viewMode === 'icons' ? 'active' : ''}`}
              onClick={() => setViewMode('icons')}
              title="Icons view"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="file-explorer-main">
        {/* Sidebar */}
        <Sidebar 
          currentPath={currentPath}
          onNavigate={setCurrentPath}
          discoveryCount={discoveries.length}
          caseId={caseId}
        />

        {/* File List Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          {/* Current Folder Indicator */}
          <div style={{
            padding: '0.5rem 1rem',
            background: '#252850',
            borderBottom: '1px solid #374151',
            color: '#9ca3af',
            fontSize: '0.85rem',
            fontFamily: 'monospace',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>{currentPath.join(' › ')}</span>
            
            {/* Case Hint for Case 102 */}
            {caseId === '102' && currentPath.includes('Case #102') && (
              <span style={{
                color: '#06b6d4',
                fontSize: '0.75rem',
                background: 'rgba(6,182,212,0.1)',
                padding: '0.2rem 0.5rem',
                borderRadius: '0.25rem'
              }}>
                💡 Hint: Check email_logs first
              </span>
            )}
            
            {/* Hint for suspicious_files */}
            {caseId === '102' && currentPath.includes('suspicious_files') && (
              <span style={{
                color: '#f97316',
                fontSize: '0.75rem',
                background: 'rgba(249,115,22,0.1)',
                padding: '0.2rem 0.5rem',
                borderRadius: '0.25rem'
              }}>
                🔍 Double-click files to analyze
              </span>
            )}
          </div>

          {/* File List */}
          <FileList 
            contents={currentContents}
            currentPath={currentPath}
            onItemClick={handleItemClick}
            onItemDoubleClick={handleItemDoubleClick}
            viewMode={viewMode}
            searchQuery={searchQuery}
            selectedFile={selectedFile}
            discoveries={discoveries}
            caseId={caseId}
            discoveryDefs={discoveryDefs}
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="file-explorer-statusbar">
        <div className="status-left">
          <span>{Object.keys(currentContents).length} items</span>
          {selectedFile && (
            <span style={{ marginLeft: '1rem', color: '#3b82f6' }}>
              Selected: {selectedFile}
            </span>
          )}
        </div>
        <div className="status-right">
          <span>Evidence (D:) 2.3 GB free</span>
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;