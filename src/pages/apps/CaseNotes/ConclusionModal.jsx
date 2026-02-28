import React from 'react';
import { AlertCircle, Check } from 'lucide-react';

const ConclusionModal = ({ onConfirm, onClose, noteCount, evidenceCount, discoveries, requiredDiscoveries, caseId }) => {
  const allDiscoveriesFound = discoveries >= requiredDiscoveries;

  return (
    <div className="conclusion-overlay" onClick={onClose}>
      <div className="conclusion-modal" onClick={e => e.stopPropagation()}>
        <div className="conclusion-header">
          <h3>Submit {caseId} Conclusion</h3>
        </div>

        <div className="conclusion-content">
          <div className="conclusion-stats">
            <div className="stat-item">
              <span className="stat-value">{discoveries}</span>
              <span className="stat-label">Discoveries</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{noteCount}</span>
              <span className="stat-label">Notes</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{evidenceCount}</span>
              <span className="stat-label">Evidence</span>
            </div>
          </div>

          {!allDiscoveriesFound && (
            <div className="conclusion-warning">
              <AlertCircle size={16} />
              <span>Warning: Not all discoveries found ({discoveries}/{requiredDiscoveries})</span>
            </div>
          )}

          <div className="conclusion-warning">
            <AlertCircle size={16} />
            <span>You cannot edit your case after submission. Ready to proceed?</span>
          </div>

          <div className="conclusion-actions">
            <button className="editor-btn cancel" onClick={onClose}>
              Cancel
            </button>
            <button 
              className="editor-btn save" 
              onClick={onConfirm}
            >
              <Check size={16} />
              <span>Submit Case</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConclusionModal;