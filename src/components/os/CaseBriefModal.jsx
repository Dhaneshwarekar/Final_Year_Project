import React from 'react';
import { X } from 'lucide-react';

const CaseBriefModal = ({ isOpen, onClose, caseData }) => {
  if (!isOpen || !caseData) return null;

  return (
    <div className="brief-modal-overlay" onClick={onClose}>
      <div className="brief-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="brief-modal-header">
          <h2>CASE {caseData.id} - BRIEF</h2>
          <button className="brief-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="brief-modal-content">
          {/* FROM section */}
          <div className="brief-section">
            <span className="brief-label">FROM:</span>
            <span className="brief-value">{caseData.brief?.from || "Unknown"}</span>
          </div>

          {/* TO section */}
          <div className="brief-section">
            <span className="brief-label">TO:</span>
            <span className="brief-value">{caseData.brief?.to || "Detective"}</span>
          </div>

          {/* DATE section */}
          <div className="brief-section">
            <span className="brief-label">DATE:</span>
            <span className="brief-value">{caseData.brief?.date || "Unknown"}</span>
          </div>

          {/* Divider */}
          <div className="brief-divider"></div>

          {/* Message */}
          <div className="brief-message">
            {caseData.brief?.message?.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="brief-modal-footer">
          <span className="footer-hint">Press ESC again to close</span>
        </div>
      </div>
    </div>
  );
};

export default CaseBriefModal;