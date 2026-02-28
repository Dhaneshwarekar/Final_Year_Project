import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Minus, Square } from 'lucide-react';
import DatabaseSidebar from './DatabaseSidebar';
import SchemaPanel from './SchemaPanel';
import QueryEditor from './QueryEditor';
import QueryResults from './QueryResults';
import RecentQueries from './RecentQueries';
import InjectionLab from './InjectionLab';
import DetailsPanel from './DetailsPanel';
import './DatabaseClient.css';

/**
 * Main Database Client component
 * Simulates a database for case investigation
 */
const DatabaseClient = () => {
  const navigate = useNavigate();

  // ===========================================
  // STATE MANAGEMENT
  // ===========================================
  const [activeTable, setActiveTable] = useState(null);
  const [activeView, setActiveView] = useState('table'); // 'table', 'details', 'injection'
  const [queryResults, setQueryResults] = useState(null);
  const [error, setError] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [recentQueries, setRecentQueries] = useState([]);
  const [showInjectionLab, setShowInjectionLab] = useState(false);

  // ===========================================
  // DEMO DATABASE - Simple data structure
  // ===========================================
  const database = {
    users: {
      columns: ['id', 'username', 'password_hash', 'email', 'department', 'created_at'],
      data: [
        [1, 'jsmith', '5f4dcc3b5aa765d61d8327deb882cf99', 'jsmith@company.com', 'Marketing', '2024-01-15'],
        [2, 'mjohnson', '7c6a61b68d25f5c2a2f8b9f7d3b4a5e6', 'mjohnson@company.com', 'Sales', '2024-01-20'],
        [3, 'awilson', '8a9b7c6d5e4f3g2h1i0j9k8l7m6n5o4p', 'awilson@company.com', 'Marketing', '2024-02-01'],
        [4, 'kbrown', '9b8a7c6d5e4f3g2h1i0j9k8l7m6n5o4p', 'kbrown@company.com', 'IT', '2024-02-15'],
        [5, 'tdavis', '0a9b8c7d6e5f4g3h2i1j0j9k8l7m6n5o4p', 'tdavis@company.com', 'Marketing', '2024-03-01']
      ]
    },
    products: {
      columns: ['id', 'name', 'price'],
      data: [
        [101, 'Laptop', 999.99],
        [102, 'Mouse', 24.99],
        [103, 'Keyboard', 49.99],
        [104, 'Monitor', 299.99],
        [105, 'USB Cable', 9.99]
      ]
    },
    orders: {
      columns: ['id', 'user_id', 'product_id', 'quantity', 'order_date'],
      data: [
        [1, 1, 101, 1, '2024-03-10'],
        [2, 2, 103, 2, '2024-03-11'],
        [3, 1, 102, 3, '2024-03-12'],
        [4, 3, 104, 1, '2024-03-13'],
        [5, 4, 101, 1, '2024-03-14']
      ]
    },
    logs: {
      columns: ['id', 'user_id', 'action', 'timestamp'],
      data: [
        [1, 1, 'login', '2024-03-10 08:30:00'],
        [2, 1, 'view_page', '2024-03-10 08:35:00'],
        [3, 2, 'login', '2024-03-10 09:00:00'],
        [4, 5, 'login', '2024-03-10 03:00:00'], // Suspicious 3AM login
        [5, 5, 'export_data', '2024-03-10 03:15:00'] // Data exfiltration
      ]
    }
  };

  // ===========================================
  // SIMPLE SQL PARSER - Handles basic SELECT queries
  // ===========================================
  const executeQuery = (sql) => {
    // Convert to uppercase for parsing
    const upperSql = sql.toUpperCase().trim();
    
    // Only allow SELECT queries
    if (!upperSql.startsWith('SELECT')) {
      setError('Only SELECT queries are allowed (read-only mode)');
      return;
    }

    // Extract table name (very simple parsing - for demo only)
    let tableName = '';
    if (upperSql.includes('FROM USERS')) tableName = 'users';
    else if (upperSql.includes('FROM PRODUCTS')) tableName = 'products';
    else if (upperSql.includes('FROM ORDERS')) tableName = 'orders';
    else if (upperSql.includes('FROM LOGS')) tableName = 'logs';
    else {
      setError('Table not found. Available tables: users, products, orders, logs');
      return;
    }

    // Get table data
    const table = database[tableName];
    let results = [...table.data];

    // Handle WHERE clause (simplified)
    if (upperSql.includes('WHERE')) {
      const wherePart = sql.split('WHERE')[1].split(';')[0].trim();
      
      // Simple department filter
      if (wherePart.includes("department = 'Marketing'")) {
        const deptIndex = table.columns.indexOf('department');
        results = results.filter(row => row[deptIndex] === 'Marketing');
      }
      // Simple user filter
      else if (wherePart.includes("id =")) {
        const idMatch = wherePart.match(/id = (\d+)/);
        if (idMatch) {
          const idIndex = table.columns.indexOf('id');
          results = results.filter(row => row[idIndex] === parseInt(idMatch[1]));
        }
      }
    }

    // Handle COUNT(*)
    if (upperSql.includes('COUNT(*)')) {
      setQueryResults({
        columns: ['count'],
        data: [[results.length]]
      });
    } else {
      setQueryResults({
        columns: table.columns,
        data: results
      });
    }

    setError(null);
    setActiveView('table'); // Switch back to table view when query runs

    // Add to recent queries
    setRecentQueries(prev => {
      const newQueries = [sql, ...prev.filter(q => q !== sql)].slice(0, 5);
      return newQueries;
    });
  };

  // ===========================================
  // QUERY HANDLERS
  // ===========================================
  const handleExecute = (query) => {
    setIsExecuting(true);
    setError(null);

    // Simulate query execution delay
    setTimeout(() => {
      executeQuery(query);
      setIsExecuting(false);
    }, 500);
  };

  const handleSaveToNotes = (query) => {
    if (queryResults) {
      alert('📋 Query and results saved to Case Notes');
    }
  };

  const handleSelectTable = (tableName) => {
    setActiveTable(tableName);
    setActiveView('table');
    // Auto-generate SELECT query for the table
    handleExecute(`SELECT * FROM ${tableName};`);
  };

  const handleShowDetails = () => {
    setActiveView('details');
    setShowInjectionLab(false);
  };

  const handleShowInjection = () => {
    setShowInjectionLab(true);
    setActiveView('injection');
  };

  // ===========================================
  // RENDER
  // ===========================================
  return (
    <div className="database-client-container">
      {/* Window Header */}
      <div className="db-header">
        <div className="flex items-center gap-3">
          <span style={{ fontSize: '1.2rem' }}>🗄️</span>
          <span className="text-white font-semibold">DATABASE CLIENT v1.0</span>
          <span className="text-gray-400 text-sm ml-4">Case #101 Investigation</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/os-desktop')} className="window-control">
            <Minus className="w-4 h-4" />
          </button>
          <button onClick={() => navigate('/os-desktop')} className="window-control">
            <Square className="w-4 h-4" />
          </button>
          <button onClick={() => navigate('/os-desktop')} className="window-control hover:bg-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content - 2 Column Layout */}
      <div className="db-main">
        {/* Left Column - Database Browser + Schema */}
        <div className="db-left-column">
          <DatabaseSidebar 
            activeTable={activeTable}
            activeView={activeView}
            onSelectTable={handleSelectTable}
            onShowDetails={handleShowDetails}
            onShowInjection={handleShowInjection}
          />
          {activeView === 'table' && <SchemaPanel table={activeTable} />}
        </div>

        {/* Right Column - Query Editor + Scrollable Content */}
        <div className="db-right-column">
          <QueryEditor 
            onExecute={handleExecute}
            onSave={handleSaveToNotes}
            isExecuting={isExecuting}
          />

          {/* Scrollable Content Area - FIXED for proper scrolling */}
          <div className="scrollable-content">
            {activeView === 'details' && <DetailsPanel />}
            
            {activeView === 'table' && (
              <QueryResults 
                results={queryResults}
                error={error}
                onOpenInjectionLab={handleShowInjection}
              />
            )}
          </div>

          <RecentQueries 
            queries={recentQueries}
            onSelect={handleExecute}
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="db-statusbar">
        <div className="status-left">
          <span>Connected to: case_db (read-only)</span>
          {activeView === 'details' && (
            <span style={{ marginLeft: '1rem', color: '#f59e0b' }}>
              📚 Learning Mode - Database Basics
            </span>
          )}
          {activeView === 'table' && activeTable && (
            <span style={{ marginLeft: '1rem', color: '#3b82f6' }}>
              Active table: {activeTable}
            </span>
          )}
        </div>
        <div className="status-right">
          <span>Learn: Tables • Keys • SQL • Security</span>
        </div>
      </div>

      {/* Injection Lab Modal */}
      {showInjectionLab && (
        <InjectionLab onClose={() => {
          setShowInjectionLab(false);
          setActiveView('table');
        }} />
      )}
    </div>
  );
};

export default DatabaseClient;