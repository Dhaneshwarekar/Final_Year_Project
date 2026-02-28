import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BootScreen from '../components/os/BootScreen';
import LoginScreen from '../components/os/LoginScreen';
import { useCase } from '../contexts/CaseContext';

function OSBootPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { switchCase } = useCase();
  
  const [bootStage, setBootStage] = useState('booting');
  const [bootProgress, setBootProgress] = useState(0);
  
  // Get user data from navigation state
  const { userId, userEmail, caseId = '101', levelProgress } = location.state || {};

  console.log('🔵 OSBootPage received:', { userId, caseId }); // DEBUG

  // Set the active case when component mounts
  useEffect(() => {
    if (caseId) {
      console.log(`🔵 OSBootPage: Setting active case to ${caseId}`);
      switchCase(caseId);
    }
  }, [caseId, switchCase]);

  useEffect(() => {
    if (bootStage === 'booting') {
      const interval = setInterval(() => {
        setBootProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setBootStage('login');
            }, 800);
            return 100;
          }
          return prev + 2;
        });
      }, 30);

      return () => clearInterval(interval);
    }
  }, [bootStage]);

  const handleLoginSuccess = () => {
    setBootStage('desktop');
    setTimeout(() => {
      // Pass user data and caseId to desktop - CRITICAL!
      navigate('/os-desktop', {
        state: {
          userId,
          userEmail,
          caseId,  // MUST pass caseId!
          levelProgress
        }
      });
    }, 500);
  };

  if (bootStage === 'booting') {
    return <BootScreen progress={bootProgress} />;
  }

  if (bootStage === 'login') {
    return <LoginScreen 
      onLoginSuccess={handleLoginSuccess} 
      userEmail={userEmail}
      userId={userId}
    />;
  }

  return null;
}

export default OSBootPage;