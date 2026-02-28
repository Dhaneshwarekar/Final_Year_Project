import React, { useState } from 'react';
import { Play, Trash2, Save } from 'lucide-react';

/**
 * SQL query input area with buttons
 * Handles query execution and clearing
 */
const QueryEditor = ({ onExecute, onSave, isExecuting }) => {
  const [query, setQuery] = useState('');

  // Sample queries for beginners
  const sampleQueries = [
    "SELECT * FROM users;",
    "SELECT * FROM users WHERE department = 'Marketing';",
    "SELECT username, email FROM users;",
    "SELECT COUNT(*) FROM products;"
  ];

  const handleExecute = () => {
    if (query.trim()) {
      onExecute(query);
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  const loadSample = (sample) => {
    setQuery(sample);
  };

  return (
    <div className="query-editor-container">
      {/* Quick sample query buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
        {sampleQueries.map((sql, i) => (
          <button
            key={i}
            onClick={() => loadSample(sql)}
            className="query-btn secondary"
            style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
          >
            {sql.substring(0, 20)}...
          </button>
        ))}
      </div>

      {/* Query textarea */}
      <textarea
        className="query-editor"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="-- Type your SQL query here --&#10;SELECT * FROM users WHERE department = 'Marketing';"
        disabled={isExecuting}
      />

      {/* Toolbar */}
      <div className="query-toolbar">
        <button 
          className="query-btn" 
          onClick={handleExecute}
          disabled={isExecuting || !query.trim()}
        >
          <Play size={14} />
          RUN QUERY
        </button>
        
        <button 
          className="query-btn secondary" 
          onClick={handleClear}
        >
          <Trash2 size={14} />
          CLEAR
        </button>
        
        <button 
          className="query-btn secondary" 
          onClick={() => onSave(query)}
          disabled={!query.trim()}
        >
          <Save size={14} />
          SAVE TO NOTES
        </button>
      </div>
    </div>
  );
};

export default QueryEditor;