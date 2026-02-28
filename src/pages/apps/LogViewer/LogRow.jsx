import React from 'react';

const LogRow = ({ log, isSelected, onSelect, caseId }) => {
  const getSeverityBadge = (log) => {
    if (log.suspicious) {
      if (log.pattern === 'phishing' || log.pattern?.includes('failed')) {
        return <span className="severity-badge badge-error">🔴 ATTACK</span>;
      }
      if (log.pattern === 'success') {
        return <span className="severity-badge badge-warning">🟡 3AM LOGIN</span>;
      }
      if (log.pattern === 'attacker-ip') {
        return <span className="severity-badge badge-error">🔴 ATTACKER</span>;
      }
      if (log.pattern === 'credentials-submitted') {
        return <span className="severity-badge badge-error">🔴 CREDENTIALS STOLEN</span>;
      }
      if (log.pattern === 'phishing-site') {
        return <span className="severity-badge badge-warning">🎣 PHISHING SITE</span>;
      }
      return <span className="severity-badge badge-warning">🟡 SUSPICIOUS</span>;
    }
    
    switch(log.severity) {
      case 'error':
        return <span className="severity-badge badge-error">ERROR</span>;
      case 'warning':
        return <span className="severity-badge badge-warning">WARNING</span>;
      default:
        return <span className="severity-badge badge-info">INFO</span>;
    }
  };

  const getRowClass = () => {
    let className = 'log-row';
    if (isSelected) className += ' selected';
    if (log.suspicious) {
      if (log.pattern === 'attacker-ip' || log.pattern === 'credentials-submitted' || log.pattern?.includes('failed')) {
        className += ' row-error';
      } else {
        className += ' row-warning';
      }
    } else if (log.severity === 'error') {
      className += ' row-error';
    } else if (log.severity === 'warning') {
      className += ' row-warning';
    }
    return className;
  };

  // Highlight suspicious patterns
  const isSuspiciousFrom = log.from && log.from.includes('company-reset.com');
  const isSuspiciousUrl = log.url && log.url.includes('company-reset.com');
  const isAttackerIP = log.source && log.source === '185.142.53.89';
  const isSuspiciousIP = log.source && log.source.includes('10.12.');
  const isNormalIP = log.source && log.source.startsWith('10.0.0.');

  return (
    <tr className={getRowClass()} onClick={onSelect}>
      <td onClick={(e) => e.stopPropagation()}>
        <input 
          type="checkbox"
          className="select-checkbox"
          checked={isSelected}
          onChange={onSelect}
        />
      </td>
      <td>
        <span className={
          log.suspicious ? 'severity-warning' :
          log.severity === 'error' ? 'severity-error' : 
          log.severity === 'warning' ? 'severity-warning' : ''
        }>
          {log.timestamp}
        </span>
      </td>
      <td>
        <span className={
          log.suspicious ? 'severity-warning' :
          log.severity === 'error' ? 'severity-error' : 
          log.severity === 'warning' ? 'severity-warning' : ''
        }>
          {log.suspicious && (
            log.pattern === 'attacker-ip' || log.pattern?.includes('failed') ? '🔴 ' : 
            log.pattern === 'phishing-site' ? '🎣 ' : '🟡 '
          )}
          {log.event}
        </span>
      </td>
      
      {/* Dynamic columns based on log type */}
      {log.from !== undefined && (
        <td>
          <span className={isSuspiciousFrom ? 'severity-warning' : ''}>
            {log.from}
            {isSuspiciousFrom && ' ⚠️'}
          </span>
        </td>
      )}
      
      {log.to !== undefined && (
        <td>{log.to}</td>
      )}
      
      {log.user !== undefined && (
        <td>
          <span style={{ 
            color: (log.user === 'sarah' || log.user === 'mike' || log.user === 'lisa' || log.user === 'jdoe') && log.suspicious ? '#fbbf24' : 'inherit',
            fontWeight: (log.user === 'sarah' || log.user === 'mike' || log.user === 'lisa' || log.user === 'jdoe') && log.suspicious ? 'bold' : 'normal'
          }}>
            {log.user}
          </span>
        </td>
      )}
      
      {log.url !== undefined && (
        <td>
          <span className={isSuspiciousUrl ? 'severity-warning' : ''}>
            {log.url}
            {isSuspiciousUrl && ' ⚠️'}
          </span>
        </td>
      )}
      
      {log.source !== undefined && (
        <td>
          <span className={
            isAttackerIP ? 'severity-error' :
            isSuspiciousIP ? 'severity-warning' :
            isNormalIP ? 'severity-info' : ''
          }>
            {log.source}
            {isAttackerIP && ' 🚫'}
            {isSuspiciousIP && ' ⚠'}
          </span>
        </td>
      )}
      
      <td className="log-details">
        {log.pattern === 'phishing' && '📧 Phishing email detected - fake domain'}
        {log.pattern === 'spam' && '🚫 Flagged as spam (after delivery)'}
        {log.pattern === 'phishing-site' && '🌐 Visited phishing site'}
        {log.pattern === 'credentials-submitted' && '🔑 Entered credentials - STOLEN!'}
        {log.pattern === 'attacker-ip' && '🚨 Attacker IP - trying stolen credentials'}
        {log.pattern === 'failed' && '❌ Failed login attempt'}
        {log.pattern === 'success' && '✓ SUCCESS at 3 AM! Different IP!'}
        {log.pattern === 'query' && '📊 Accessed HR database - unauthorized'}
        {log.pattern === 'logout' && '🚪 Session ended'}
        {!log.pattern && log.event}
      </td>
      <td>{getSeverityBadge(log)}</td>
    </tr>
  );
};

export default LogRow;