// NoteEditor.jsx - Ensure this is correct
import React, { useState } from 'react';
import { X, Info } from 'lucide-react';

const NoteEditor = ({ note, onSave, onClose, caseId }) => {
  const [content, setContent] = useState(note?.content || '');
  const isConclusion = note?.isConclusion || false;

  const handleSave = () => {
    if (!content.trim()) {
      alert('Please enter some content for your note.');
      return;
    }
    
    onSave({ 
      content: content.trim(),
      isConclusion: isConclusion,
      title: isConclusion ? `FINAL CONCLUSION - ${caseId}` : (note?.title || 'Manual Note')
    });
  };

  return (
    <div className="editor-overlay" onClick={onClose}>
      <div className="editor-modal" onClick={e => e.stopPropagation()}>
        <div className="editor-header">
          <h3>
            {isConclusion ? `Write Final Conclusion - ${caseId}` : (note ? 'Edit Note' : 'New Note')}
          </h3>
          <button className="editor-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="editor-content">
          <textarea
            className="editor-textarea"
            placeholder={isConclusion 
              ? `Write your final case conclusion for ${caseId} here...` 
              : "Enter your investigation findings..."}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            autoFocus
          />

          <div className="editor-hint">
            <Info size={14} />
            <span>
              {isConclusion 
                ? "Your conclusion will be evaluated when you submit the case"
                : "Timestamps are automatic - they help maintain chain of custody"}
            </span>
          </div>

          <div className="editor-actions">
            <button className="editor-btn cancel" onClick={onClose}>
              Cancel
            </button>
            <button className="editor-btn save" onClick={handleSave}>
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;