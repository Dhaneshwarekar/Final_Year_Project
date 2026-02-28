import React from 'react';
import { Edit2, Trash2, Paperclip, ChevronRight, Award, Zap, Clock } from 'lucide-react';

const NoteCard = ({ note, onEdit, onDelete, onEvidenceClick }) => {
  const handleEvidenceClick = (evidence) => {
    if (onEvidenceClick) {
      onEvidenceClick(evidence);
    }
  };

  return (
    <div className={`note-card ${note.isConclusion ? 'conclusion' : ''} ${note.isDiscovery ? 'discovery' : ''}`}>
      <div className="note-header">
        <div className="note-timestamp">
          <Clock size={14} />
          <span>{note.timestamp}</span>
        </div>
        <div className="note-actions">
          {note.xp > 0 && (
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              background: '#fbbf24',
              color: '#1a1d3a',
              padding: '0.1rem 0.4rem',
              borderRadius: '1rem',
              fontSize: '0.7rem',
              fontWeight: 'bold',
              marginRight: '0.5rem'
            }}>
              <Zap size={10} />
              +{note.xp} XP
            </span>
          )}
          <button className="note-action-btn" onClick={onEdit} title="Edit note">
            <Edit2 size={14} />
          </button>
          <button className="note-action-btn" onClick={onDelete} title="Delete note">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {note.title && (
        <h4 style={{ 
          color: note.isConclusion ? '#ffaa00' : '#00b4d8',
          margin: '0 0 0.5rem 0',
          fontSize: '0.9rem'
        }}>
          {note.title}
        </h4>
      )}

      <div className={`note-content ${note.isConclusion ? 'conclusion' : ''}`}>
        {note.content.split('\n').map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>

      {note.evidence && (
        <div className="evidence-section">
          <div className="evidence-title">
            <Paperclip size={12} />
            <span>Evidence</span>
          </div>
          <div 
            className="evidence-item"
            onClick={() => handleEvidenceClick(note.evidence)}
          >
            <span className="evidence-icon">📎</span>
            <div className="evidence-details">
              <div className="evidence-file">{note.source || 'Unknown source'}</div>
              <div className="evidence-preview">
                {note.evidence.substring(0, 60)}
                {note.evidence.length > 60 ? '...' : ''}
              </div>
            </div>
            <ChevronRight size={14} className="text-gray-600" />
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteCard;