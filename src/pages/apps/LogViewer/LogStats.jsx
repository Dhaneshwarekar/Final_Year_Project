import React from 'react';
import { AlertCircle, AlertTriangle, Info, FileText } from 'lucide-react';

const LogStats = ({ totalEntries, filteredEntries, suspiciousCount, errorCount, warningCount, fileLoaded }) => {
  if (!fileLoaded) {
    return (
      <div className="log-viewer-statusbar">
        <div className="status-left">
          <FileText size={12} className="text-gray-500" />
          <span>No file loaded</span>
        </div>
        <div className="status-right">
          <span className="text-gray-600">Select a log file to begin</span>
        </div>
      </div>
    );
  }

  return (
    <div className="log-viewer-statusbar">
      <div className="status-left">
        <span>Filter: {filteredEntries === totalEntries ? 'All entries' : 'Filtered'}</span>
        <span>({filteredEntries} of {totalEntries})</span>
      </div>
      <div className="status-right">
        {errorCount > 0 && (
          <div className="suspicious-badge">
            <AlertCircle size={12} />
            <span>ERRORS: {errorCount}</span>
          </div>
        )}
        {warningCount > 0 && (
          <div className="warning-badge">
            <AlertTriangle size={12} />
            <span>WARNINGS: {warningCount}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Info size={12} className="text-gray-500" />
          <span>SUSPICIOUS: {suspiciousCount}</span>
        </div>
      </div>
    </div>
  );
};

export default LogStats;