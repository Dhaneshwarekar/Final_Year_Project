import React from 'react';
import { FolderOpen, FileText } from 'lucide-react';

/**
 * Step 1: File Selection
 * Allows user to browse and select a file from case evidence
 */
const FileSelector = ({ selectedFile, onFileSelect, caseFiles, caseId = '101' }) => {
  
  const handleBrowse = () => {
    // In a real app, this would open a file browser
    // For demo, we'll simulate selecting a file by showing a list
    const fileList = caseFiles.map((file, index) => 
      `${index + 1}. ${file.name} (${file.size})`
    ).join('\n');
    
    const selectedIndex = prompt(
      `Select a file to verify (Case #${caseId}):\n\n${fileList}\n\nEnter file number (1-${caseFiles.length}):`,
      '1'
    );
    
    if (selectedIndex) {
      const index = parseInt(selectedIndex) - 1;
      if (index >= 0 && index < caseFiles.length) {
        onFileSelect(caseFiles[index]);
      } else {
        alert('Invalid selection');
      }
    }
  };

  return (
    <div className="step-card">
      <div className="step-title">
        <span>📁</span>
        STEP 1: SELECT FILE TO VERIFY
        {caseId === '102' && (
          <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#06b6d4' }}>
            Case #102
          </span>
        )}
      </div>

      <div className="file-selector">
        {/* Browse Button */}
        <button className="browse-btn" onClick={handleBrowse}>
          <FolderOpen size={16} />
          BROWSE FILES
        </button>

        {/* File Info (shown when file selected) */}
        {selectedFile ? (
          <div className="file-info">
            <div className="file-path">
              <FileText size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
              {selectedFile.path}
            </div>
            <div className="file-meta">
              <span>Size: {selectedFile.size}</span>
              <span>Modified: {selectedFile.modified}</span>
            </div>
            {caseId === '102' && selectedFile.name === 'credentials.txt' && (
              <div style={{ 
                marginTop: '0.5rem', 
                color: '#fbbf24', 
                fontSize: '0.75rem',
                background: 'rgba(251,191,36,0.1)',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem'
              }}>
                ⭐ This file contains stolen credentials! Verify its integrity.
              </div>
            )}
          </div>
        ) : (
          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            No file selected. Click BROWSE to choose a file.
          </div>
        )}
      </div>
    </div>
  );
};

export default FileSelector;