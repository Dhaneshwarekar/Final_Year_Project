import React, { useState } from 'react';
import { Database, Table, ChevronRight, ChevronDown, BookOpen } from 'lucide-react';

/**
 * Left sidebar showing database structure and quick actions
 * - Displays database and tables in tree view
 * - Click table to view schema
 * - Quick actions for Details and Injection Lab
 */
const DatabaseSidebar = ({ onSelectTable, activeTable, onShowDetails, onShowInjection, activeView }) => {
  const [expanded, setExpanded] = useState(true);

  // Database structure - matches our demo data
  const tables = [
    { name: 'users', icon: '📊' },
    { name: 'products', icon: '📊' },
    { name: 'orders', icon: '📊' },
    { name: 'logs', icon: '📊' }
  ];

  return (
    <div className="db-left-column">
      {/* Quick Actions Section - NEW */}
      <div className="quick-actions-section">
        <h3 className="sidebar-section-title">QUICK ACTIONS</h3>
        <button 
          className={`quick-action-btn ${activeView === 'details' ? 'active' : ''}`}
          onClick={() => onShowDetails()}
        >
          <span className="quick-action-icon">📚</span>
          <span>Learning Details</span>
        </button>
        <button 
          className={`quick-action-btn ${activeView === 'injection' ? 'active' : ''}`}
          onClick={() => onShowInjection()}
        >
          <span className="quick-action-icon">💉</span>
          <span>SQL Injection Lab</span>
        </button>
      </div>

      {/* Database Browser */}
      <div className="db-browser">
        <div className="sidebar-section">
          <h3 className="sidebar-section-title">DATABASES</h3>
          
          {/* Database root */}
          <div className="db-tree-item" onClick={() => setExpanded(!expanded)}>
            <span className="icon">🗄️</span>
            <span>case_db</span>
            <span className="caret">
              {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </span>
          </div>

          {/* Tables (expandable) */}
          {expanded && (
            <div className="db-tree-children">
              <div className="db-tree-item" style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                <span className="icon">📁</span>
                <span>tables</span>
              </div>
              
              {/* Individual tables */}
              {tables.map(table => (
                <div
                  key={table.name}
                  className={`db-tree-item ${activeTable === table.name && activeView === 'table' ? 'active' : ''}`}
                  style={{ marginLeft: '1.5rem' }}
                  onClick={() => {
                    onSelectTable(table.name);
                  }}
                >
                  <span className="icon">{table.icon}</span>
                  <span>{table.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatabaseSidebar;