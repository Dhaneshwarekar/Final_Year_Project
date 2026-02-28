import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DesktopIcon from '../components/os/DesktopIcon';
import Taskbar from '../components/os/Taskbar';
import NotificationPanel from '../components/os/NotificationPanel';
import CaseBriefModal from '../components/os/CaseBriefModal';
import { useCase } from '../contexts/CaseContext';
import '../styles/os-desktop.css';

function OSDesktopPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeCase, caseData } = useCase();
  
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isBriefOpen, setIsBriefOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      from: 'Admin@crimesolver.local',
      subject: 'Urgent: Missing Confidential File',
      preview: 'Level 1 Case Briefing - A confidential project file has gone missing...',
      time: 'Today 08:30 AM',
      unread: true
    }
  ]);

  // IMPORTANT: Get userId and caseId from location state
  const { userId, userEmail, caseId: locationCaseId, levelProgress } = location.state || {};
  
  // Use caseId from location state, fallback to context, then default to '101'
  const caseId = locationCaseId || activeCase || '101';

  // Log to verify
  useEffect(() => {
    console.log(`💻 OSDesktopPage: Active case is ${caseId}`);
    console.log(`💻 OSDesktopPage: User ID is ${userId}`);
  }, [caseId, userId]);

  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsBriefOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Applications with Lucide React icon names
  const applications = [
    // Row 1: Core Investigation Tools
    { 
      id: 1, 
      name: 'File Explorer', 
      icon: 'Folder', 
      color: 'blue', 
      route: '/file-explorer'
    },
    { 
      id: 2, 
      name: 'Log Viewer', 
      icon: 'FileText', 
      color: 'cyan', 
      route: '/log-viewer'
    },
    { 
      id: 3, 
      name: 'Terminal', 
      icon: 'Terminal', 
      color: 'green', 
      route: '/terminal'
    },
    { 
      id: 4, 
      name: 'Network Scanner', 
      icon: 'Radio', 
      color: 'purple', 
      route: '/network-scanner'
    },
    
    // Row 2: Analysis & Documentation Tools
    { 
      id: 5, 
      name: 'Database Client', 
      icon: 'Database', 
      color: 'orange', 
      route: '/database-client'
    },
    { 
      id: 6, 
      name: 'Case Notes', 
      icon: 'Book', 
      color: 'amber', 
      route: '/case-notes'
    },
    { 
      id: 7, 
      name: 'Hash Verifier', 
      icon: 'Fingerprint', 
      color: 'red', 
      route: '/hash-verifier'
    },
    { 
      id: 8, 
      name: 'User Profile', 
      icon: 'User', 
      color: 'gray', 
      route: '/profile'
    }
  ];

  // Handle app click - Passes caseId to all apps
  const handleAppClick = (app) => {
    console.log(`📱 Opening app: ${app.name} for Case #${caseId}`);
    
    // Navigate to the app with ALL necessary state
    navigate(app.route, {
      state: {
        userId: userId,
        userEmail: userEmail,
        caseId: caseId,  // CRITICAL: Pass the caseId!
        levelProgress: levelProgress
      }
    });
  };

  // Get case-specific data
  const getActiveCaseData = () => {
    if (caseId === '101') {
      return {
        id: '#101',
        title: 'The Unauthorized Login',
        brief: {
          from: 'IT Security Department',
          to: 'Detective',
          date: 'March 16, 2024',
          message: 'This morning, HR noticed something strange. At 3:00 AM, someone accessed employee salary records using John Doe\'s account.\n\nJohn is a marketing manager. He swears he was asleep at 3 AM. His wife confirms he was home. But the system shows his account was used.'
        },
        victim: 'John Doe, Marketing Manager',
        incident: '3:00 AM, March 16, 2024',
        stakes: '$5M in fines, 500+ employees affected',
        mission: [
          'Find the unauthorized login',
          'Identify the attacker\'s IP',
          'Determine how they got in',
          'Verify John\'s alibi',
          'Find why John was targeted'
        ]
      };
    } else {
      return {
        id: '#102',
        title: 'The Phishing Trap',
        brief: {
          from: 'IT Security Department',
          to: 'Detective',
          date: 'March 20, 2024',
          message: 'Yesterday, 15 employees received this email:\n\nFROM: IT-Support@company-reset.com\nSUBJECT: URGENT: Password Expiry Notification\n\nYour password will expire in 24 hours. Click here to keep your current password.\n\nThree employees clicked the link and entered their passwords. Within hours, their accounts showed suspicious activity.'
        },
        victim: 'Sarah (HR), Mike (Sales), Lisa (Finance)',
        incident: 'Yesterday, 2:30 PM - 3:45 PM',
        stakes: 'Employee credentials stolen, company data at risk',
        mission: [
          'Find the phishing email in logs',
          'Extract the malicious link',
          'Identify which employees fell for it',
          'Trace where credentials were sent',
          'Verify if stolen credentials were used',
          'Check if 2FA stopped the attack'
        ]
      };
    }
  };

  const activeCaseData = getActiveCaseData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1d3a] via-[#252850] to-[#1f2347] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Desktop Content */}
      <div className="relative z-10 p-8 pb-24 min-h-screen">
        {/* Case Indicator */}
        <div style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          background: caseId === '101' ? 'rgba(234,179,8,0.2)' : 'rgba(6,182,212,0.2)',
          border: `1px solid ${caseId === '101' ? '#eab308' : '#06b6d4'}`,
          borderRadius: '2rem',
          padding: '0.5rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: 50
        }}>
          <span style={{ fontSize: '1.2rem' }}>{caseId === '101' ? '🔓' : '🎣'}</span>
          <span style={{ 
            color: caseId === '101' ? '#eab308' : '#06b6d4',
            fontWeight: 'bold'
          }}>
            Case {caseId === '101' ? '#101' : '#102'}: {caseId === '101' ? 'Unauthorized Login' : 'Phishing Trap'}
          </span>
        </div>

        {/* Application Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-6 max-w-[1800px] mx-auto">
          {applications?.map((app) => (
            <DesktopIcon
              key={app?.id}
              app={app}
              onClick={() => handleAppClick(app)}
            />
          ))}
        </div>
      </div>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        activeCase={activeCaseData}
      />

      {/* Case Brief Modal */}
      <CaseBriefModal 
        isOpen={isBriefOpen}
        onClose={() => setIsBriefOpen(false)}
        caseData={activeCaseData}
      />

      {/* Taskbar */}
      <Taskbar
        onNotificationClick={() => setIsNotificationOpen(!isNotificationOpen)}
        notificationCount={notifications?.filter(n => n?.unread)?.length}
      />
    </div>
  );
}

export default OSDesktopPage;