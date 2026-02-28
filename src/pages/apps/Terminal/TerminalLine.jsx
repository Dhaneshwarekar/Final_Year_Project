import React from 'react';

const TerminalLine = ({ line }) => {
  const { type, content } = line;

  // Handle array of content (for multi-line output)
  if (Array.isArray(content)) {
    return (
      <>
        {content.map((line, index) => (
          <div key={index} className={`terminal-line terminal-line-${type || 'output'}`}>
            {line}
          </div>
        ))}
      </>
    );
  }

  // Determine CSS class based on line type
  const getLineClass = () => {
    switch(type) {
      case 'system':
        return 'terminal-line-system';
      case 'input':
        return 'terminal-line-input';
      case 'output':
        return 'terminal-line-output';
      case 'error':
        return 'terminal-line-error';
      case 'warning':
        return 'terminal-line-warning';
      default:
        return 'terminal-line-output';
    }
  };

  // Handle empty lines
  if (content === '') {
    return <div className="terminal-line" dangerouslySetInnerHTML={{ __html: '&nbsp;' }} />;
  }

  return (
    <div className={`terminal-line ${getLineClass()}`}>
      {content}
    </div>
  );
};

export default TerminalLine;