import React from 'react';
import { X, Shield, User, Clock, AlertTriangle, Lock } from 'lucide-react';

const CaseBriefModal = ({ isOpen, onClose, onConfirm, caseData }) => {
  if (!isOpen || !caseData) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="case-brief-modal" onClick={e => e.stopPropagation()}>
        <div className="brief-header">
          <div className="brief-title">
            <Shield size={24} className="text-cyan-400" />
            <h2>CASE {caseData.levelNumber} - BRIEF</h2>
          </div>
          <button className="brief-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="brief-content">
          {/* From/To Section */}
          <div className="brief-memo">
            <div className="memo-line">
              <span className="memo-label">FROM:</span>
              <span className="memo-value">{caseData.brief.from}</span>
            </div>
            <div className="memo-line">
              <span className="memo-label">TO:</span>
              <span className="memo-value">{caseData.brief.to}</span>
            </div>
            <div className="memo-line">
              <span className="memo-label">DATE:</span>
              <span className="memo-value">{caseData.brief.date}</span>
            </div>
          </div>

          {/* Message Box */}
          <div className="brief-message-box">
            <div className="message-quote">"</div>
            <p className="brief-message">{caseData.brief.message}</p>
          </div>

          {/* Case Details */}
          <div className="brief-details">
            <div className="detail-item">
              <User size={16} className="detail-icon" />
              <div className="detail-content">
                <span className="detail-label">VICTIM:</span>
                <span className="detail-value">{caseData.brief.victim}</span>
              </div>
            </div>

            <div className="detail-item">
              <Clock size={16} className="detail-icon" />
              <div className="detail-content">
                <span className="detail-label">INCIDENT:</span>
                <span className="detail-value">{caseData.brief.incident}</span>
              </div>
            </div>

            <div className="detail-item">
              <AlertTriangle size={16} className="detail-icon" />
              <div className="detail-content">
                <span className="detail-label">STAKES:</span>
                <span className="detail-value">{caseData.brief.stakes}</span>
              </div>
            </div>
          </div>

          {/* Mission Objectives */}
          <div className="brief-mission">
            <h3 className="mission-title">📋 YOUR MISSION:</h3>
            <ul className="mission-list">
              {caseData.features.map((objective, index) => (
                <li key={index}>
                  <span className="mission-check">☐</span>
                  {objective}
                </li>
              ))}
            </ul>
          </div>

          {/* Tools Unlocked */}
          <div className="brief-tools">
            <h3 className="tools-title">🔧 TOOLS UNLOCKED:</h3>
            <div className="tools-grid">
              <div className="tool-item">
                <span className="tool-check">✅</span>
                <span>File Explorer</span>
              </div>
              <div className="tool-item">
                <span className="tool-check">✅</span>
                <span>Log Viewer</span>
              </div>
              <div className="tool-item">
                <span className="tool-check">✅</span>
                <span>Terminal</span>
              </div>
              <div className="tool-item">
                <span className="tool-check">✅</span>
                <span>Case Notes</span>
              </div>
            </div>
          </div>
        </div>

        <div className="brief-footer">
          <button className="brief-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="brief-start" onClick={onConfirm}>
            <Lock size={16} />
            <span>START INVESTIGATION</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaseBriefModal;