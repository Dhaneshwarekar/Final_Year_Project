import React from 'react';
import { User, FolderOpen, Clock } from 'lucide-react';

const CaseInfoBar = ({ investigator, caseName, status, currentTime }) => {
  return (
    <div className="case-info-bar">
      <div className="case-info-content">
        <div className="case-info-left">
          <div className="info-item">
            <User size={14} className="text-gray-500" />
            <span className="info-label">INVESTIGATOR:</span>
            <span className="info-value">{investigator}</span>
          </div>
          <div className="info-item">
            <FolderOpen size={14} className="text-gray-500" />
            <span className="info-label">CASE:</span>
            <span className="info-value">{caseName}</span>
          </div>
          <div className="case-status">{status}</div>
        </div>
        <div className="case-time">
          <Clock size={14} />
          <span>{currentTime}</span>
        </div>
      </div>
    </div>
  );
};

export default CaseInfoBar;