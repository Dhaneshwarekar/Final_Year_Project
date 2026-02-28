import React, { useState, forwardRef } from 'react';

const TerminalPrompt = forwardRef(({ onSubmit, history, historyIndex, setHistoryIndex, currentPath }, ref) => {
  const [input, setInput] = useState('');
  const [showHistoryHint, setShowHistoryHint] = useState(false);

  const handleKeyDown = (e) => {
    // Enter key - submit command
    if (e.key === 'Enter') {
      onSubmit(input);
      setInput('');
      setShowHistoryHint(false);
    }
    
    // Up arrow - previous command in history
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex + 1;
        if (newIndex < history.length) {
          setHistoryIndex(newIndex);
          setInput(history[history.length - 1 - newIndex]);
          setShowHistoryHint(true);
        }
      }
    }
    
    // Down arrow - next command in history
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        if (newIndex >= 0) {
          setInput(history[history.length - 1 - newIndex]);
        } else {
          setInput('');
          setShowHistoryHint(false);
        }
      }
    }
    
    // Tab key - auto-complete (preview)
    else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple tab completion for directories
      if (input === 'cd ') {
        setInput('cd logs');
      } else if (input === 'cat ') {
        setInput('cat auth.log');
      }
    }
  };

  return (
    <div className="terminal-prompt-container">
      {/* History Navigation Hint */}
      {showHistoryHint && (
        <div className="history-hint">
          <span>↑↓</span> to navigate history
        </div>
      )}

      {/* Prompt */}
      <div className="terminal-prompt">
        <span className="path">investigator@crimesolver</span>
        <span className="path">:</span>
        <span className="path">{currentPath}</span>
        <span className="symbol">$</span>
      </div>

      {/* Input Wrapper */}
      <div className="terminal-input-wrapper">
        <input
          ref={ref}
          type="text"
          className="terminal-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck="false"
          autoCapitalize="none"
          autoComplete="off"
        />
        <span className="terminal-cursor"></span>
      </div>
    </div>
  );
});

TerminalPrompt.displayName = 'TerminalPrompt';

export default TerminalPrompt;