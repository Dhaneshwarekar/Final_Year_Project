import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Minus, Square, Award, CheckCircle } from 'lucide-react';
import QuickActions from './QuickActions';
import TargetInput from './TargetInput';
import ScanResults from './ScanResults';
import ActiveConnections from './ActiveConnections';
import ScanHistory from './ScanHistory';
import DetailsPanel from './DetailsPanel';
import './NetworkScanner.css';

const NetworkScanner = () => {
  const navigate = useNavigate();

  // ===========================================
  // STATE MANAGEMENT
  // ===========================================
  const [target, setTarget] = useState('');
  const [scanResults, setScanResults] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  
  // Demo data for recent scans
  const [recentScans, setRecentScans] = useState([
    { ip: '203.45.67.89', openPorts: 5, time: '2 min ago', scanType: 'quick' },
    { ip: '10.12.45.89', openPorts: 22, time: '15 min ago', scanType: 'full' },
    { ip: '185.142.53.222', openPorts: 3, time: '1 hour ago', scanType: 'quick' },
    { ip: '192.168.1.100', openPorts: 8, time: '2 hours ago', scanType: 'full' }
  ]);

  // ===========================================
  // DEMO SCAN DATABASE - Predefined results for learning
  // ===========================================
  const scanDatabase = {
    '203.45.67.89': {
      target: '203.45.67.89',
      scanType: 'quick',
      geolocation: {
        country: 'Russia',
        city: 'Moscow',
        isp: 'Russian Telecom',
        organization: 'Attacker-Hosting Ltd'
      },
      whois: {
        registrar: 'RU-CENTER',
        created: '2024-01-15',
        nameservers: ['ns1.attacker-domain.ru', 'ns2.attacker-domain.ru']
      },
      ports: [
        { port: 22, state: 'open', service: 'SSH', banner: 'OpenSSH 7.4' },
        { port: 80, state: 'open', service: 'HTTP', banner: 'Apache 2.4.6' },
        { port: 443, state: 'open', service: 'HTTPS', banner: 'nginx 1.18.0' },
        { port: 3306, state: 'filtered', service: 'MySQL', banner: null },
        { port: 4444, state: 'open', service: 'unknown', banner: 'Possible C2 Server' },
        { port: 8080, state: 'closed', service: 'HTTP-Alt', banner: null }
      ]
    },
    '192.168.1.100': {
      target: '192.168.1.100',
      scanType: 'full',
      geolocation: {
        country: 'Local Network',
        city: 'Private IP',
        isp: 'Internal'
      },
      ports: [
        { port: 22, state: 'open', service: 'SSH', banner: 'OpenSSH 8.9' },
        { port: 80, state: 'open', service: 'HTTP', banner: 'Apache 2.4.41' },
        { port: 139, state: 'open', service: 'NetBIOS', banner: 'Samba' },
        { port: 445, state: 'open', service: 'SMB', banner: 'Windows Share' },
        { port: 3306, state: 'open', service: 'MySQL', banner: 'MySQL 8.0.32' }
      ]
    },
    '10.12.45.89': {
      target: '10.12.45.89',
      scanType: 'full',
      geolocation: {
        country: 'United States',
        city: 'Data Center',
        isp: 'Amazon AWS'
      },
      ports: [
        { port: 22, state: 'open', service: 'SSH', banner: 'OpenSSH 8.2' },
        { port: 80, state: 'open', service: 'HTTP', banner: 'nginx 1.22.1' },
        { port: 443, state: 'open', service: 'HTTPS', banner: 'nginx 1.22.1' },
        { port: 25, state: 'filtered', service: 'SMTP', banner: null }
      ]
    },
    '127.0.0.1': {
      target: '127.0.0.1',
      scanType: 'quick',
      geolocation: {
        country: 'Localhost',
        city: 'Your Computer',
        isp: 'Loopback'
      },
      ports: [
        { port: 'Local', state: 'open', service: 'Your System', banner: 'This is YOUR computer - used for testing' }
      ]
    }
  };

  // ===========================================
  // ACTIVE CONNECTIONS DEMO DATA
  // ===========================================
  const [connections, setConnections] = useState([
    {
      localIp: '10.0.0.5',
      localPort: 54321,
      remoteIp: '8.8.8.8',
      remotePort: 443,
      state: 'ESTABLISHED',
      process: 'firefox',
      suspicious: false
    },
    {
      localIp: '10.0.0.5',
      localPort: 54322,
      remoteIp: '1.1.1.1',
      remotePort: 80,
      state: 'TIME_WAIT',
      process: 'chrome',
      suspicious: false
    },
    {
      localIp: '10.0.0.5',
      localPort: 54323,
      remoteIp: '203.45.67.89',
      remotePort: 4444,
      state: 'SYN_SENT',
      process: 'unknown',
      suspicious: true
    },
    {
      localIp: '10.0.0.5',
      localPort: 54324,
      remoteIp: '192.168.1.100',
      remotePort: 445,
      state: 'ESTABLISHED',
      process: 'explorer.exe',
      suspicious: false
    }
  ]);

  // ===========================================
  // SCAN FUNCTION - Simulates network scanning
  // ===========================================
  const handleScan = (targetIp, scanType) => {
    setTarget(targetIp);
    setIsScanning(true);
    setScanProgress(0);
    setShowDetails(false); // Hide details when scanning

    // Simulate scan progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + (scanType === 'quick' ? 20 : 5);
      });
    }, 200);

    // Simulate scan completion after delay
    setTimeout(() => {
      clearInterval(interval);
      
      // Check if IP exists in database
      const results = scanDatabase[targetIp];
      
      if (results) {
        // Add scan type to results
        const scanResultsWithType = {
          ...results,
          scanType: scanType,
          ports: scanType === 'quick' 
            ? results.ports.slice(0, 5) // Quick scan shows fewer ports
            : results.ports // Full scan shows all
        };
        
        setScanResults(scanResultsWithType);
        
        // Add to recent scans
        const openPorts = scanResultsWithType.ports.filter(p => p.state === 'open').length;
        setRecentScans(prev => [
          { ip: targetIp, openPorts, time: 'Just now', scanType },
          ...prev.slice(0, 3)
        ]);
      } else {
        // Generic response for unknown IPs
        setScanResults({
          target: targetIp,
          scanType: scanType,
          geolocation: {
            country: 'Unknown',
            isp: 'No response'
          },
          ports: [
            { port: 'All', state: 'filtered', service: 'No open ports found', banner: 'Host may be offline or firewalled' }
          ]
        });
      }
      
      setIsScanning(false);
    }, scanType === 'quick' ? 2000 : 5000);
  };

  // ===========================================
  // QUICK ACTION HANDLERS
  // ===========================================
  const handleQuickAction = (action) => {
    setActiveAction(action);
    
    if (action === '127.0.0.1') {
      handleScan('127.0.0.1', 'quick');
    } else if (action === '203.45.67.89') {
      handleScan('203.45.67.89', 'full');
    } else if (action === 'custom') {
      // Just focus the input
      document.querySelector('.target-input')?.focus();
    }
  };

  const handleNavigate = (page) => {
    if (page === 'history') {
      setShowHistory(true);
      setShowDetails(false);
    } else if (page === 'details') {
      setShowDetails(true);
      setShowHistory(false);
      setActiveAction('details');
    } else if (page === 'export' && scanResults) {
      alert(`📤 Exported scan results for ${scanResults.target} to Case Notes`);
    }
  };

  // ===========================================
  // REFRESH CONNECTIONS
  // ===========================================
  const refreshConnections = () => {
    // Rotate connection states for realism
    setConnections(prev => prev.map(conn => ({
      ...conn,
      state: conn.state === 'ESTABLISHED' ? 'TIME_WAIT' : 
             conn.state === 'TIME_WAIT' ? 'ESTABLISHED' : 
             conn.state === 'SYN_SENT' ? 'ESTABLISHED' : conn.state
    })));
  };

  // ===========================================
  // EXPORT HANDLER
  // ===========================================
  const handleExport = () => {
    if (scanResults) {
      alert(`📋 Scan results for ${scanResults.target} ready to export to Case Notes`);
    }
  };

  // ===========================================
  // RENDER PROGRESS BAR
  // ===========================================
  const renderProgressBar = () => {
    if (!isScanning) return null;
    
    return (
      <div className="scan-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${scanProgress}%` }} />
        </div>
        <div className="progress-text">
          Scanning {target}... {scanProgress}% complete
        </div>
      </div>
    );
  };

  // ===========================================
  // RENDER
  // ===========================================
  return (
    <div className="network-scanner-container">
      {/* Window Header - Matching File Explorer style */}
      <div className="scanner-header">
        <div className="flex items-center gap-3">
          <span style={{ fontSize: '1.2rem' }}>🌐</span>
          <span className="text-white font-semibold">NETWORK SCANNER v1.0</span>
          <span className="text-gray-400 text-sm ml-4">Case #101 Investigation</span>
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
      <div className="scanner-main">
        {/* Quick Actions Sidebar */}
        <QuickActions 
          activeAction={activeAction}
          onAction={handleQuickAction}
          onNavigate={handleNavigate}
        />

        {/* Right Content Area - FIXED LAYOUT */}
        <div className="scanner-content">
          {/* Target Input and Scan Controls - Fixed at top */}
          <TargetInput 
            onScan={handleScan}
            isScanning={isScanning}
            recentScans={recentScans}
            onSelectRecent={(scan) => handleScan(scan.ip, scan.scanType)}
          />

          {/* Progress Bar (shown during scan) */}
          {renderProgressBar()}

          {/* Scrollable Content Area - FIXED */}
          <div className="scrollable-content">
            {/* Details Panel (when selected) */}
            {showDetails && <DetailsPanel />}

            {/* Scan Results (always shown unless details is active) */}
            {!showDetails && (
              <ScanResults 
                results={scanResults}
                target={target}
                onExport={handleExport}
              />
            )}

            {/* Active Connections - Always shown at bottom */}
            <ActiveConnections 
              connections={connections}
              onRefresh={refreshConnections}
            />
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="scanner-statusbar">
        <div className="status-left">
          <span>Ready</span>
          {scanResults && !showDetails && (
            <span style={{ marginLeft: '1rem', color: '#3b82f6' }}>
              Last scan: {scanResults.target} ({scanResults.ports.filter(p => p.state === 'open').length} open ports)
            </span>
          )}
          {showDetails && (
            <span style={{ marginLeft: '1rem', color: '#f59e0b' }}>
              📚 Learning Mode - Networking Basics
            </span>
          )}
        </div>
        <div className="status-right">
          <span>Demo Mode • Learning Objectives: IPs • Ports • Services • Security</span>
        </div>
      </div>

      {/* History Modal */}
      {showHistory && (
        <ScanHistory 
          history={recentScans}
          onSelectScan={(scan) => {
            handleScan(scan.ip, scan.scanType);
            setShowHistory(false);
          }}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
};

export default NetworkScanner;