import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  X, Minus, Square, Search, Download, 
  Filter, ChevronLeft, ChevronRight, 
  AlertCircle, CheckCircle, Clock, Award,
  Copy, FileText, Eye, Zap
} from 'lucide-react';
import { getDiscoveriesByCase } from '../CaseNotes/caseData';
import GuidancePopup from './DiscoveryPopup'; // Your original popup
import './LogViewer.css';

const LogViewer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get data from location state
  const { userId, caseId: initialCaseId, file, filePath } = location.state || {};
  
  // Extract case number
  const caseNumber = initialCaseId ? initialCaseId.replace('#', '') : '101';
  const caseId = `#${caseNumber}`;
  
  // State
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(20);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [copyMessage, setCopyMessage] = useState('');
  const [discoveryNotification, setDiscoveryNotification] = useState(null);
  const [pendingNote, setPendingNote] = useState(null); // Store note temporarily
  
  // Get discoveries for this case
  const discoveries = getDiscoveriesByCase ? getDiscoveriesByCase(caseNumber) : [];
  
  // Log data based on case and file
  const getLogData = () => {
    if (caseNumber === '101') {
      // Case #101 - auth.log
      return [
        // Normal daytime logins
        { id: 1, timestamp: '2024-03-16 08:20:15', event: 'LOGIN_SUCCESS', user: 'jdoe', source: '10.0.0.45', details: 'Normal login', indicator: 'INFO' },
        { id: 2, timestamp: '2024-03-16 08:22:30', event: 'LOGIN_SUCCESS', user: 'jsmith', source: '10.0.0.67', details: 'Normal login', indicator: 'INFO' },
        { id: 3, timestamp: '2024-03-16 08:25:45', event: 'LOGIN_SUCCESS', user: 'lpark', source: '10.0.0.89', details: 'Normal login', indicator: 'INFO' },
        { id: 4, timestamp: '2024-03-16 09:15:22', event: 'QUERY_EXEC', user: 'jdoe', source: 'hr_database', details: 'Accessed employee records', indicator: 'INFO' },
        
        // SUSPICIOUS ACTIVITY - 3 AM
        { id: 5, timestamp: '2024-03-16 02:58:12', event: 'LOGIN_FAILED', user: 'jdoe', source: '10.12.45.89', details: 'Failed attempt #1', indicator: 'WARNING' },
        { id: 6, timestamp: '2024-03-16 02:59:03', event: 'LOGIN_FAILED', user: 'jdoe', source: '10.12.45.89', details: 'Failed attempt #2', indicator: 'WARNING' },
        { id: 7, timestamp: '2024-03-16 03:00:47', event: 'LOGIN_SUCCESS', user: 'jdoe', source: '10.12.45.89', details: 'SUCCESS at 3 AM!', indicator: 'ERROR' },
        { id: 8, timestamp: '2024-03-16 03:15:22', event: 'QUERY_EXEC', user: 'jdoe', source: 'hr_database', details: 'Accessed HR data', indicator: 'ERROR' },
        { id: 9, timestamp: '2024-03-16 03:16:45', event: 'LOGOUT', user: 'jdoe', source: '10.12.45.89', details: 'Session ended', indicator: 'WARNING' },
        
        // More daytime activity
        { id: 10, timestamp: '2024-03-16 10:30:12', event: 'LOGIN_SUCCESS', user: 'mjohnson', source: '10.0.0.101', details: 'Normal login', indicator: 'INFO' },
        { id: 11, timestamp: '2024-03-16 11:45:33', event: 'LOGIN_SUCCESS', user: 'jdoe', source: '10.0.0.45', details: 'Normal login', indicator: 'INFO' },
      ];
    } else {
      // Case #102 - multiple log files
      if (file === 'smtp.log') {
        return [
          { id: 1, timestamp: '08:15', event: 'DELIVERED', from: 'external@evil.com', to: 'ALL', details: 'Newsletter', indicator: 'INFO' },
          { id: 2, timestamp: '08:16', event: 'DELIVERED', from: 'newsletter@company.com', to: 'sarah', details: 'Company news', indicator: 'INFO' },
          { id: 3, timestamp: '08:22', event: 'DELIVERED', from: 'client@biz.com', to: 'mike', details: 'Client email', indicator: 'INFO' },
          // Phishing email
          { id: 4, timestamp: '14:32', event: 'DELIVERED', from: 'IT-Support@company-reset.com', to: 'sarah', details: '⚠️ Password reset', indicator: 'WARNING' },
          { id: 5, timestamp: '14:32', event: 'DELIVERED', from: 'IT-Support@company-reset.com', to: 'mike', details: '⚠️ Password reset', indicator: 'WARNING' },
          { id: 6, timestamp: '14:32', event: 'DELIVERED', from: 'IT-Support@company-reset.com', to: 'lisa', details: '⚠️ Password reset', indicator: 'WARNING' },
          { id: 7, timestamp: '14:33', event: 'SPAM_FLAG', from: 'IT-Support@company-reset.com', to: '-', details: '🚫 Flagged as spam', indicator: 'ERROR' },
        ];
      } else if (file === 'proxy.log') {
        return [
          { id: 1, timestamp: '08:30', user: 'sarah', url: 'company.com/hr', details: 'HR portal', indicator: 'INFO' },
          { id: 2, timestamp: '08:45', user: 'mike', url: 'company.com/sales', details: 'Sales dashboard', indicator: 'INFO' },
          { id: 3, timestamp: '09:12', user: 'lisa', url: 'company.com/finance', details: 'Finance system', indicator: 'INFO' },
          // Victims visiting phishing site
          { id: 4, timestamp: '14:35', user: 'sarah', url: 'company-reset.com/login', details: '⚠️ Phishing page', indicator: 'WARNING' },
          { id: 5, timestamp: '14:36', user: 'mike', url: 'company-reset.com/login', details: '⚠️ Phishing page', indicator: 'WARNING' },
          { id: 6, timestamp: '14:38', user: 'lisa', url: 'company-reset.com/login', details: '⚠️ Phishing page', indicator: 'WARNING' },
          { id: 7, timestamp: '14:40', user: 'sarah', url: 'company-reset.com/submit', details: '🔴 Submitted credentials', indicator: 'ERROR' },
          { id: 8, timestamp: '14:42', user: 'mike', url: 'company-reset.com/submit', details: '🔴 Submitted credentials', indicator: 'ERROR' },
          { id: 9, timestamp: '14:45', user: 'lisa', url: 'company-reset.com/submit', details: '🔴 Submitted credentials', indicator: 'ERROR' },
        ];
      } else if (file === 'firewall.log') {
        return [
          { id: 1, timestamp: '08:00', event: 'VPN_CONNECT', user: 'sarah', source: '10.0.0.45', details: 'Connected', indicator: 'INFO' },
          { id: 2, timestamp: '08:15', event: 'VPN_CONNECT', user: 'mike', source: '10.0.0.67', details: 'Connected', indicator: 'INFO' },
          { id: 3, timestamp: '08:30', event: 'VPN_CONNECT', user: 'lisa', source: '10.0.0.89', details: 'Connected', indicator: 'INFO' },
          // Attacker attempts at night
          { id: 4, timestamp: '23:15', event: 'VPN_ATTEMPT', user: 'sarah', source: '185.142.53.89', details: '🔴 Failed - 2FA blocked', indicator: 'ERROR' },
          { id: 5, timestamp: '23:16', event: 'VPN_FAILED', user: 'sarah', source: '185.142.53.89', details: '🔴 Authentication failed', indicator: 'ERROR' },
          { id: 6, timestamp: '23:18', event: 'VPN_ATTEMPT', user: 'lisa', source: '185.142.53.89', details: '🔴 Failed - 2FA blocked', indicator: 'ERROR' },
          { id: 7, timestamp: '23:19', event: 'VPN_FAILED', user: 'lisa', source: '185.142.53.89', details: '🔴 Authentication failed', indicator: 'ERROR' },
          { id: 8, timestamp: '23:22', event: 'VPN_ATTEMPT', user: 'mike', source: '185.142.53.89', details: '🔴 Failed - 2FA blocked', indicator: 'ERROR' },
          { id: 9, timestamp: '23:23', event: 'VPN_FAILED', user: 'mike', source: '185.142.53.89', details: '🔴 Authentication failed', indicator: 'ERROR' },
        ];
      }
    }
    return [];
  };

  const logData = getLogData();

  // Filter logs based on search
  const filteredLogs = logData.filter(log => 
    Object.values(log).some(value => 
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / rowsPerPage);
  const currentLogs = filteredLogs.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Handle row selection
  const handleRowSelect = (log) => {
    setSelectedRows(prev => {
      const isSelected = prev.some(row => row.id === log.id);
      if (isSelected) {
        return prev.filter(row => row.id !== log.id);
      } else {
        return [...prev, log];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedRows.length === currentLogs.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentLogs);
    }
  };

  // ===== VERIFY DISCOVERY - YOUR ORIGINAL FUNCTION =====
  const verifyDiscovery = (selectedText, selectedRows) => {
    if (caseNumber === '101') {
      // ===== DISCOVERY 1: 3:00 AM Suspicious Login =====
      if (selectedText.includes('03:00:47 LOGIN_SUCCESS jdoe 10.12.45.89') && 
          selectedRows.length === 1) {
        const log = selectedRows[0];
        if (log.timestamp === '2024-03-16 03:00:47' && 
            log.event === 'LOGIN_SUCCESS' && 
            log.user === 'jdoe' && 
            log.source === '10.12.45.89') {
          console.log('✅ Discovery #1 triggered');
          return discoveries.find(d => d.id === 1);
        }
      }
      
      // ===== DISCOVERY 2: Attack Pattern Detected =====
      else if (selectedRows.length >= 3) {
        const hasFailed1 = selectedRows.some(row => 
          row.timestamp === '2024-03-16 02:58:12' && 
          row.event === 'LOGIN_FAILED' &&
          row.user === 'jdoe' &&
          row.source === '10.12.45.89'
        );
        
        const hasFailed2 = selectedRows.some(row => 
          row.timestamp === '2024-03-16 02:59:03' && 
          row.event === 'LOGIN_FAILED' &&
          row.user === 'jdoe' &&
          row.source === '10.12.45.89'
        );
        
        const hasSuccess = selectedRows.some(row => 
          row.timestamp === '2024-03-16 03:00:47' && 
          row.event === 'LOGIN_SUCCESS' &&
          row.user === 'jdoe' &&
          row.source === '10.12.45.89'
        );
        
        const relevantRows = selectedRows.filter(row => 
          row.source === '10.12.45.89' && 
          (row.timestamp === '2024-03-16 02:58:12' || 
           row.timestamp === '2024-03-16 02:59:03' || 
           row.timestamp === '2024-03-16 03:00:47')
        );
        
        if (hasFailed1 && hasFailed2 && hasSuccess && relevantRows.length === 3 && selectedRows.length === 3) {
          console.log('✅ Discovery #2 triggered');
          return discoveries.find(d => d.id === 2);
        }
      }
      
      // ===== DISCOVERY 5: Suspicious IP Identified =====
      else if (selectedRows.length >= 5) {
        const suspiciousIPRows = selectedRows.filter(row => row.source === '10.12.45.89');
        if (suspiciousIPRows.length >= 5) {
          const hasAllIPRows = 
            suspiciousIPRows.some(r => r.timestamp === '2024-03-16 02:58:12') &&
            suspiciousIPRows.some(r => r.timestamp === '2024-03-16 02:59:03') &&
            suspiciousIPRows.some(r => r.timestamp === '2024-03-16 03:00:47') &&
            suspiciousIPRows.some(r => r.timestamp === '2024-03-16 03:15:22') &&
            suspiciousIPRows.some(r => r.timestamp === '2024-03-16 03:16:45');
          
          if (hasAllIPRows) {
            console.log('✅ Discovery #5 triggered');
            return discoveries.find(d => d.id === 5);
          }
        }
      }
    } else {
      // Case #102 verifications
      if (file === 'smtp.log') {
        if (selectedText.includes('IT-Support@company-reset.com') && 
            selectedRows.length >= 3) {
          return discoveries.find(d => d.id === 1);
        }
      } else if (file === 'proxy.log') {
        if (selectedText.includes('company-reset.com') && 
            selectedRows.some(r => r.user === 'sarah') &&
            selectedRows.some(r => r.user === 'mike') &&
            selectedRows.some(r => r.user === 'lisa')) {
          return discoveries.find(d => d.id === 2);
        }
      } else if (file === 'firewall.log') {
        if (selectedText.includes('185.142.53.89') && 
            selectedText.includes('VPN_FAILED')) {
          return discoveries.find(d => d.id === 6);
        }
      }
    }
    
    return null;
  };

  // ===== FIXED: Handle copy to notes with popup and navigation =====
  const handleCopyToNotes = () => {
    if (selectedRows.length === 0) {
      alert('Please select at least one log entry to copy.');
      return;
    }

    // Format the selected logs
    const formattedText = selectedRows.map(log => {
      if (caseNumber === '101') {
        return `${log.timestamp} ${log.event} ${log.user} ${log.source}`;
      } else {
        if (file === 'smtp.log') {
          return `${log.timestamp} ${log.event} FROM: ${log.from} TO: ${log.to}`;
        } else if (file === 'proxy.log') {
          return `${log.timestamp} ${log.user} ${log.url}`;
        } else {
          return `${log.timestamp} ${log.event} ${log.user} ${log.source}`;
        }
      }
    }).join('\n');

    // Verify if this is a discovery
    const discovery = verifyDiscovery(formattedText, selectedRows);
    
    let noteTitle = 'Manual Note';
    let noteContent = formattedText;
    let xpEarned = 0;
    let discoveryId = null;
    
    if (discovery) {
      noteTitle = `DISCOVERY: ${discovery.name}`;
      noteContent = `${discovery.name}\n\n${discovery.description}\n\nEvidence:\n${formattedText}`;
      xpEarned = discovery.xp;
      discoveryId = discovery.id;
      
      console.log(`🎯 DISCOVERY FOUND! ID: ${discoveryId}, Name: ${discovery.name}, XP: ${xpEarned}`);
    }

    // Get userId from localStorage if not in props
    let finalUserId = userId;
    if (!finalUserId) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          finalUserId = user._id;
        } catch (e) {
          console.error('Error parsing user:', e);
        }
      }
    }

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

    const newNote = {
      id: Date.now(),
      noteId: Date.now(),
      timestamp: timestamp,
      title: noteTitle,
      content: noteContent,
      source: file || 'Log Viewer',
      xp: xpEarned,
      isDiscovery: !!discovery,
      caseId: caseNumber,
      discoveryId: discoveryId,
      createdAt: new Date().toISOString(),
      type: 'note'
    };

    // Show success message
    setCopyMessage(discovery ? `🎉 Discovery #${discovery.id}: +${discovery.xp} XP!` : '📝 Note saved');
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 3000);

    // Clear selection
    setSelectedRows([]);

    // If this is a discovery, show the popup and store the note
    if (discovery) {
      // FIXED: Use the FULL discovery object from the discoveries array
      // This ensures all fields (nextStepApp, nextStepCommand, etc.) are included
      const fullDiscovery = discoveries.find(d => d.id === discovery.id);
      
      // Add the evidence text to the discovery object
      const popupDiscovery = {
        ...fullDiscovery,
        evidence: formattedText // Override evidence with formatted text
      };
      
      // Show popup with complete discovery data
      setDiscoveryNotification(popupDiscovery);
      
      // Store the note for navigation after popup
      setPendingNote({
        userId: finalUserId,
        caseId: caseId,
        newNote: newNote,
        discoveryId: discoveryId,
        xpEarned: xpEarned,
        isNewDiscovery: true
      });
    } else {
      // No discovery, navigate immediately
      navigate('/case-notes', {
        state: {
          userId: finalUserId,
          caseId: caseId,
          newNote: newNote,
          discoveryId: null,
          xpEarned: 0,
          isNewDiscovery: false
        }
      });
    }
  };

  // Handle popup action (when user clicks "Go to Terminal" etc.)
  const handlePopupAction = (app) => {
    // Close popup
    setDiscoveryNotification(null);
    
    // If we have a pending note, navigate to case notes
    if (pendingNote) {
      navigate('/case-notes', {
        state: pendingNote
      });
      setPendingNote(null);
    } else if (app === 'terminal') {
      navigate('/terminal', { state: { userId, caseId } });
    } else if (app === 'file-explorer') {
      navigate('/file-explorer', { state: { userId, caseId } });
    } else if (app === 'log-viewer') {
      // Already in log viewer, do nothing
    } else if (app === 'case-notes') {
      navigate('/case-notes', { state: { userId, caseId } });
    }
  };

  // Handle popup close (X button or auto-close)
  const handlePopupClose = () => {
    setDiscoveryNotification(null);
    // If there's a pending note, navigate to case notes anyway
    if (pendingNote) {
      navigate('/case-notes', {
        state: pendingNote
      });
      setPendingNote(null);
    }
  };

  return (
    <div className="log-viewer-container">
      {/* Discovery Notification - USING YOUR ORIGINAL POPUP */}
      {discoveryNotification && (
        <GuidancePopup 
          discovery={discoveryNotification}
          onClose={handlePopupClose}
          onAction={handlePopupAction}
        />
      )}

      {/* Window Header */}
      <div className="log-viewer-header">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-cyan-400" />
          <span className="text-white font-semibold">
            LOG VIEWER - {file || 'auth.log'} {caseId && `(Case ${caseId})`}
          </span>
          <span className="text-gray-400 text-sm ml-4">[_][□][✕]</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/os-desktop', { state: { userId, caseId } })} className="window-control">
            <Minus className="w-4 h-4" />
          </button>
          <button onClick={() => navigate('/os-desktop', { state: { userId, caseId } })} className="window-control">
            <Square className="w-4 h-4" />
          </button>
          <button onClick={() => navigate('/os-desktop', { state: { userId, caseId } })} className="window-control hover:bg-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="log-viewer-toolbar">
        <div className="toolbar-left">
          <button 
            className="toolbar-btn copy-btn"
            onClick={handleCopyToNotes}
            disabled={selectedRows.length === 0}
          >
            <Copy size={16} />
            <span>Copy to Notes ({selectedRows.length})</span>
          </button>
          
          <button className="toolbar-btn">
            <Filter size={16} />
            <span>Filter</span>
          </button>
          
          <button className="toolbar-btn">
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>

        <div className="toolbar-center">
          <div className="file-selector">
            <Eye size={16} />
            <span className="current-file">{file || 'auth.log'}</span>
          </div>
        </div>

        <div className="toolbar-right">
          <div className="search-box">
            <Search size={14} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {/* Copy Success Message */}
      {showCopySuccess && (
        <div className="copy-success-message">
          <CheckCircle size={16} />
          <span>{copyMessage}</span>
        </div>
      )}

      {/* Log Table */}
      <div className="log-table-container">
        <table className="log-table">
          <thead>
            <tr>
              <th style={{ width: '30px' }}>
                <input
                  type="checkbox"
                  checked={selectedRows.length === currentLogs.length && currentLogs.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              {caseNumber === '101' ? (
                <>
                  <th>Timestamp</th>
                  <th>Event</th>
                  <th>User</th>
                  <th>Source IP</th>
                  <th>Details</th>
                  <th>Indicator</th>
                </>
              ) : (
                <>
                  {file === 'smtp.log' && (
                    <>
                      <th>Timestamp</th>
                      <th>Event</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Details</th>
                      <th>Indicator</th>
                    </>
                  )}
                  {file === 'proxy.log' && (
                    <>
                      <th>Timestamp</th>
                      <th>User</th>
                      <th>URL</th>
                      <th>Details</th>
                      <th>Indicator</th>
                    </>
                  )}
                  {file === 'firewall.log' && (
                    <>
                      <th>Timestamp</th>
                      <th>Event</th>
                      <th>User</th>
                      <th>Source IP</th>
                      <th>Details</th>
                      <th>Indicator</th>
                    </>
                  )}
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {currentLogs.map((log) => (
              <tr 
                key={log.id} 
                className={selectedRows.some(row => row.id === log.id) ? 'selected' : ''}
                onClick={() => handleRowSelect(log)}
              >
                <td onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedRows.some(row => row.id === log.id)}
                    onChange={() => handleRowSelect(log)}
                  />
                </td>
                
                {caseNumber === '101' ? (
                  <>
                    <td className="timestamp">{log.timestamp}</td>
                    <td>
                      <span className={`event-badge event-${log.event.toLowerCase()}`}>
                        {log.event}
                      </span>
                    </td>
                    <td className="user">{log.user}</td>
                    <td className="source">{log.source}</td>
                    <td className="details">{log.details}</td>
                    <td>
                      <span className={`indicator-badge indicator-${log.indicator.toLowerCase()}`}>
                        {log.indicator}
                      </span>
                    </td>
                  </>
                ) : (
                  <>
                    {file === 'smtp.log' && (
                      <>
                        <td className="timestamp">{log.timestamp}</td>
                        <td>{log.event}</td>
                        <td className="source">{log.from}</td>
                        <td>{log.to}</td>
                        <td className="details">{log.details}</td>
                        <td>
                          <span className={`indicator-badge indicator-${log.indicator.toLowerCase()}`}>
                            {log.indicator}
                          </span>
                        </td>
                      </>
                    )}
                    {file === 'proxy.log' && (
                      <>
                        <td className="timestamp">{log.timestamp}</td>
                        <td>{log.user}</td>
                        <td className="source">{log.url}</td>
                        <td className="details">{log.details}</td>
                        <td>
                          <span className={`indicator-badge indicator-${log.indicator.toLowerCase()}`}>
                            {log.indicator}
                          </span>
                        </td>
                      </>
                    )}
                    {file === 'firewall.log' && (
                      <>
                        <td className="timestamp">{log.timestamp}</td>
                        <td>{log.event}</td>
                        <td>{log.user}</td>
                        <td className="source">{log.source}</td>
                        <td className="details">{log.details}</td>
                        <td>
                          <span className={`indicator-badge indicator-${log.indicator.toLowerCase()}`}>
                            {log.indicator}
                          </span>
                        </td>
                      </>
                    )}
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {currentLogs.length === 0 && (
          <div className="empty-logs">
            <FileText size={48} className="empty-icon" />
            <h3>No logs found</h3>
            <p>Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="log-viewer-footer">
        <div className="footer-left">
          <span className="log-count">
            Showing {currentLogs.length} of {filteredLogs.length} entries
          </span>
          {selectedRows.length > 0 && (
            <span className="selected-count">
              {selectedRows.length} selected
            </span>
          )}
        </div>
        
        <div className="footer-right">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogViewer;