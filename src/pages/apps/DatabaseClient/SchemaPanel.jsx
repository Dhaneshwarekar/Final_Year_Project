import React from 'react';
import { Info } from 'lucide-react';

/**
 * Shows table schema (columns, types, keys)
 * Appears when table is selected
 */
const SchemaPanel = ({ table }) => {
  if (!table) {
    return (
      <div className="schema-panel">
        <div className="schema-title">
          <Info size={14} />
          <span>TABLE SCHEMA</span>
        </div>
        <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>
          Select a table to view schema
        </div>
      </div>
    );
  }

  // Schema definitions for our demo tables
  const schemas = {
    users: [
      { name: 'id', type: 'INTEGER', key: 'PK' },
      { name: 'username', type: 'TEXT', key: '' },
      { name: 'password_hash', type: 'TEXT', key: '' },
      { name: 'email', type: 'TEXT', key: '' },
      { name: 'department', type: 'TEXT', key: '' },
      { name: 'created_at', type: 'DATE', key: '' }
    ],
    products: [
      { name: 'id', type: 'INTEGER', key: 'PK' },
      { name: 'name', type: 'TEXT', key: '' },
      { name: 'price', type: 'DECIMAL', key: '' }
    ],
    orders: [
      { name: 'id', type: 'INTEGER', key: 'PK' },
      { name: 'user_id', type: 'INTEGER', key: 'FK' },
      { name: 'product_id', type: 'INTEGER', key: 'FK' },
      { name: 'quantity', type: 'INTEGER', key: '' },
      { name: 'order_date', type: 'DATE', key: '' }
    ],
    logs: [
      { name: 'id', type: 'INTEGER', key: 'PK' },
      { name: 'user_id', type: 'INTEGER', key: 'FK' },
      { name: 'action', type: 'TEXT', key: '' },
      { name: 'timestamp', type: 'DATETIME', key: '' }
    ]
  };

  const columns = schemas[table] || [];

  return (
    <div className="schema-panel">
      <div className="schema-title">
        <Info size={14} />
        <span>TABLE SCHEMA: {table}</span>
      </div>
      <table className="schema-table">
        <thead>
          <tr>
            <th>Column</th>
            <th>Type</th>
            <th>Key</th>
          </tr>
        </thead>
        <tbody>
          {columns.map(col => (
            <tr key={col.name}>
              <td>{col.name}</td>
              <td>{col.type}</td>
              <td>
                {col.key && <span className="key-badge">{col.key}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SchemaPanel;