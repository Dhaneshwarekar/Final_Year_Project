import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';

const ActiveConnections = ({ connections, onRefresh }) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    onRefresh();
    setTimeout(() => setRefreshing(false), 500);
  };

  const getStateClass = (state) => {
    switch(state) {
      case 'ESTABLISHED': return 'state-established';
      case 'TIME_WAIT': return 'state-time-wait';
      case 'SYN_SENT': return 'state-syn-sent';
      default: return '';
    }
  };

  return (
    <div className="active-connections">
      <div className="connections-header">
        <div className="connections-title">
          <span>🔌 ACTIVE CONNECTIONS (SIMULATED)</span>
        </div>
        <button className="refresh-btn" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'REFRESHING...' : 'REFRESH'}
        </button>
      </div>

      <table className="connections-table">
        <thead>
          <tr>
            <th>LOCAL IP</th>
            <th>LOCAL PORT</th>
            <th>REMOTE IP</th>
            <th>REMOTE PORT</th>
            <th>STATE</th>
            <th>PROCESS</th>
          </tr>
        </thead>
        <tbody>
          {connections.map((conn, index) => (
            <tr key={index}>
              <td>{conn.localIp}</td>
              <td>{conn.localPort}</td>
              <td style={{ color: conn.suspicious ? '#ef4444' : 'inherit' }}>
                {conn.remoteIp}
                {conn.suspicious && <span style={{ marginLeft: '0.25rem' }}>⚠️</span>}
              </td>
              <td>{conn.remotePort}</td>
              <td>
                <span className={`connection-state ${getStateClass(conn.state)}`}>
                  {conn.state}
                </span>
              </td>
              <td style={{ color: '#9ca3af' }}>{conn.process}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActiveConnections;