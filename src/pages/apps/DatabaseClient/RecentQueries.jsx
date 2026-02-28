import React from 'react';

/**
 * Shows query history
 * Click to load previous query
 */
const RecentQueries = ({ queries, onSelect }) => {
  if (queries.length === 0) return null;

  return (
    <div className="recent-queries">
      <div className="recent-title">RECENT QUERIES</div>
      <div className="recent-list">
        {queries.map((query, index) => (
          <div
            key={index}
            className="recent-item"
            onClick={() => onSelect(query)}
            title={query}
          >
            {query.length > 30 ? query.substring(0, 30) + '...' : query}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentQueries;