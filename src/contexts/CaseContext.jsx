import React, { createContext, useState, useContext, useEffect } from 'react';

const CaseContext = createContext();

export const useCase = () => {
  const context = useContext(CaseContext);
  if (!context) {
    throw new Error('useCase must be used within a CaseProvider');
  }
  return context;
};

export const CaseProvider = ({ children }) => {
  const [activeCase, setActiveCase] = useState(() => {
    // Try to get from localStorage first
    const saved = localStorage.getItem('activeCase');
    return saved || '101';
  });

  const [caseData, setCaseData] = useState({
    caseId: activeCase,
    caseNumber: activeCase === '101' ? '#101' : '#102',
    caseTitle: activeCase === '101' ? 'The Unauthorized Login' : 'The Phishing Trap'
  });

  useEffect(() => {
    setCaseData({
      caseId: activeCase,
      caseNumber: activeCase === '101' ? '#101' : '#102',
      caseTitle: activeCase === '101' ? 'The Unauthorized Login' : 'The Phishing Trap'
    });
    localStorage.setItem('activeCase', activeCase);
    console.log(`🔄 Active case changed to: ${activeCase}`);
  }, [activeCase]);

  const switchCase = (caseId) => {
    setActiveCase(caseId);
  };

  return (
    <CaseContext.Provider value={{ activeCase, caseData, switchCase }}>
      {children}
    </CaseContext.Provider>
  );
};