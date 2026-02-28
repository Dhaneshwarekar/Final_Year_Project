import React from 'react';
import { Book, Database, Key, Link, Shield, AlertTriangle, Info, Server, Hash } from 'lucide-react';

/**
 * Educational panel teaching database concepts
 * Shows real-world IT knowledge about databases
 */
const DetailsPanel = () => {
  return (
    <div className="details-panel">
      <div className="details-title">
        <Book size={20} />
        <span>DATABASE BASICS - REAL WORLD GUIDE</span>
      </div>

      {/* What is a Database Section */}
      <div className="details-section">
        <h4>
          <Database size={16} style={{ color: '#3b82f6' }} />
          What is a Database?
        </h4>
        <div className="details-grid">
          <div className="details-card">
            <h5>📊 Tables</h5>
            <p>Like spreadsheets - data organized in rows and columns. Each table stores one type of thing (users, products, orders).</p>
            <p style={{ marginTop: '0.5rem', color: '#f59e0b' }}>Example: users table stores all employee information</p>
          </div>
          <div className="details-card">
            <h5>📋 Columns</h5>
            <p>Specific pieces of information (username, email, price). Each column has a data type (TEXT, NUMBER, DATE).</p>
          </div>
          <div className="details-card">
            <h5>📄 Rows</h5>
            <p>Individual records - one row = one user, one product, one order.</p>
          </div>
        </div>
      </div>

      {/* Primary Keys & Foreign Keys Section */}
      <div className="details-section">
        <h4>
          <Key size={16} style={{ color: '#22c55e' }} />
          Keys - How Tables Connect
        </h4>
        <div className="details-grid">
          <div className="details-card">
            <h5>🔑 Primary Key (PK)</h5>
            <p>Unique ID for each row. Like a passport number - no two people have the same.</p>
            <p style={{ color: '#3b82f6' }}>Example: user_id = 1 always refers to the same user</p>
          </div>
          <div className="details-card">
            <h5>🔗 Foreign Key (FK)</h5>
            <p>References a primary key in another table. Creates relationships between tables.</p>
            <p style={{ color: '#f59e0b' }}>Example: orders.user_id connects to users.id</p>
          </div>
        </div>
      </div>

      {/* SQL Syntax Section */}
      <div className="details-section">
        <h4>
          <Server size={16} style={{ color: '#8b5cf6' }} />
          SQL Syntax - Talking to Databases
        </h4>
        
        <table className="sql-table">
          <thead>
            <tr>
              <th>Command</th>
              <th>What It Does</th>
              <th>Example</th>
              <th>Real-World Use</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span className="sql-keyword">SELECT</span></td>
              <td>Retrieve data</td>
              <td>SELECT * FROM users</td>
              <td>View all employees</td>
            </tr>
            <tr>
              <td><span className="sql-keyword">WHERE</span></td>
              <td>Filter results</td>
              <td>WHERE department = 'IT'</td>
              <td>Find IT staff</td>
            </tr>
            <tr>
              <td><span className="sql-keyword">JOIN</span></td>
              <td>Combine tables</td>
              <td>users JOIN orders</td>
              <td>See what each user bought</td>
            </tr>
            <tr>
              <td><span className="sql-keyword">COUNT</span></td>
              <td>Count rows</td>
              <td>COUNT(*) FROM logs</td>
              <td>How many login attempts?</td>
            </tr>
            <tr>
              <td><span className="sql-keyword">ORDER BY</span></td>
              <td>Sort results</td>
              <td>ORDER BY created_at DESC</td>
              <td>Newest first</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Data Types Section */}
      <div className="details-section">
        <h4>
          <Hash size={16} style={{ color: '#f59e0b' }} />
          Data Types - What Kind of Data?
        </h4>
        <div className="details-grid">
          <div className="details-card">
            <h5>🔢 INTEGER</h5>
            <p>Whole numbers: 1, 42, 1000</p>
            <p>Used for: IDs, counts, quantities</p>
          </div>
          <div className="details-card">
            <h5>📝 TEXT / VARCHAR</h5>
            <p>Words and letters: "John", "admin@email.com"</p>
            <p>Used for: names, emails, descriptions</p>
          </div>
          <div className="details-card">
            <h5>💰 DECIMAL</h5>
            <p>Numbers with decimals: 19.99, 100.50</p>
            <p>Used for: prices, salaries, measurements</p>
          </div>
          <div className="details-card">
            <h5>📅 DATE / DATETIME</h5>
            <p>Dates and times: 2024-03-15 14:30:00</p>
            <p>Used for: created_at, login_time, order_date</p>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="details-section">
        <h4>
          <Shield size={16} style={{ color: '#ef4444' }} />
          Database Security - Real World
        </h4>
        <div className="details-grid">
          <div className="details-card">
            <h5>🔐 Password Hashing</h5>
            <p>Passwords are NEVER stored as plaintext. They're "hashed" - one-way mathematical transformation.</p>
            <p style={{ color: '#9ca3af', fontSize: '0.7rem' }}>Example: "password123" → "5f4dcc3b5aa765d61d8327deb882cf99"</p>
          </div>
          <div className="details-card">
            <h5>🛡️ SQL Injection</h5>
            <p>Attackers insert malicious SQL through input fields. Can bypass logins, steal data, delete tables.</p>
            <p style={{ color: '#ef4444' }}>Click "SQL INJECTION LAB" to see how!</p>
          </div>
          <div className="details-card">
            <h5>👁️ Audit Logs</h5>
            <p>Databases track who did what and when. Critical for investigations.</p>
            <p style={{ color: '#f59e0b' }}>Check the logs table - see suspicious 3AM activity?</p>
          </div>
        </div>
      </div>

      {/* Investigation Tips */}
      <div className="details-section">
        <h4>
          <AlertTriangle size={16} style={{ color: '#f59e0b' }} />
          🔍 Database Investigation Tips
        </h4>
        <ul style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: '1.6', paddingLeft: '1.5rem' }}>
          <li><strong>Look for anomalies:</strong> Users accessing data at 3AM (like user_id 5 in logs)</li>
          <li><strong>Follow foreign keys:</strong> Who placed this order? Follow user_id to users table</li>
          <li><strong>Check password hashes:</strong> Same hash = same password (bad security!)</li>
          <li><strong>COUNT(*) tells scale:</strong> "Attacker accessed 1000 records" vs "accessed 5 records"</li>
          <li><strong>JOIN reveals relationships:</strong> Which products did the suspicious user buy?</li>
          <li><strong>Always use WHERE:</strong> "SELECT * FROM users" is dangerous in production - limit results!</li>
        </ul>
      </div>

      {/* Real-World Scenario */}
      <div className="details-section">
        <h4>
          <Info size={16} style={{ color: '#3b82f6' }} />
          🎯 Case #101: The 3AM Login
        </h4>
        <div style={{
          background: '#252850',
          borderRadius: '0.375rem',
          padding: '1rem',
          border: '1px solid #3b82f6'
        }}>
          <p style={{ color: '#e5e7eb', marginBottom: '0.5rem' }}>
            <strong>The Evidence:</strong> Logs show user_id 5 logged in at 3:00 AM and exported data.
          </p>
          <p style={{ color: '#9ca3af', marginBottom: '0.5rem' }}>
            <strong>Your Investigation:</strong>
          </p>
          <ol style={{ color: '#9ca3af', fontSize: '0.8rem', paddingLeft: '1.2rem' }}>
            <li>Check users table: Who is user_id 5? (tdavis, Marketing)</li>
            <li>Does Marketing work at 3AM? Suspicious!</li>
            <li>Check orders: Did this user make unusual purchases?</li>
            <li>Export findings to Case Notes</li>
          </ol>
          <p style={{ color: '#22c55e', marginTop: '0.5rem', fontSize: '0.8rem' }}>
            ✅ This is how real forensic investigators work!
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetailsPanel;