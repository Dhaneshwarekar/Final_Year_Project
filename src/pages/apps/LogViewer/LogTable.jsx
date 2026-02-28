import React from 'react';
import LogRow from './LogRow';

const LogTable = ({ logs, selectedRows, onSelectRow, onSelectAll, allSelected, loading, isEmpty, caseId }) => {
  if (loading) {
    return (
      <div className="log-table-container">
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Loading log data...</p>
        </div>
      </div>
    );
  }

  if (isEmpty || logs.length === 0) {
    return (
      <div className="log-table-container">
        <div className="empty-state">
          <span className="empty-state-icon">📄</span>
          <p>No log entries found</p>
          <p className="text-xs text-gray-600">
            {caseId === '102' 
              ? 'Try selecting a different log file' 
              : 'Open auth.log from File Explorer'}
          </p>
        </div>
      </div>
    );
  }

  // Determine columns based on log type
  const firstLog = logs[0];
  const hasFrom = firstLog?.from !== undefined;
  const hasTo = firstLog?.to !== undefined;
  const hasUser = firstLog?.user !== undefined;
  const hasUrl = firstLog?.url !== undefined;
  const hasSource = firstLog?.source !== undefined;

  return (
    <div className="log-table-container">
      <table className="log-table">
        <thead>
          <tr>
            <th style={{ width: '30px' }}>
              <input 
                type="checkbox"
                className="select-checkbox"
                checked={allSelected}
                onChange={onSelectAll}
              />
            </th>
            <th>Timestamp</th>
            <th>Event</th>
            {hasFrom && <th>From</th>}
            {hasTo && <th>To</th>}
            {hasUser && <th>User</th>}
            {hasUrl && <th>URL</th>}
            {hasSource && <th>Source IP</th>}
            <th>Details</th>
            <th style={{ width: '100px' }}>Indicator</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <LogRow 
              key={log.id}
              log={log}
              isSelected={selectedRows.includes(log.id)}
              onSelect={() => onSelectRow(log)}
              caseId={caseId}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogTable;