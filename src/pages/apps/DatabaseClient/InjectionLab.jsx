import React from 'react';
import { X, AlertTriangle, Shield } from 'lucide-react';

/**
 * Educational popup about SQL injection
 * Shows vulnerable vs secure code examples
 */
const InjectionLab = ({ onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: '#1a1d3a',
      border: '1px solid #374151',
      borderRadius: '0.5rem',
      width: '600px',
      maxHeight: '80vh',
      overflow: 'auto',
      zIndex: 1000,
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem',
        borderBottom: '1px solid #374151',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#252850'
      }}>
        <h3 style={{ color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={18} style={{ color: '#ef4444' }} />
          SQL INJECTION DEMONSTRATION
        </h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '1.5rem' }}>
        {/* Vulnerable code */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ color: '#ef4444', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={16} />
            VULNERABLE CODE (DANGEROUS!)
          </h4>
          <div style={{
            background: '#2d2d4a',
            borderRadius: '0.375rem',
            padding: '1rem',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            border: '1px solid #ef4444'
          }}>
            <div style={{ color: '#f59e0b' }}>$username = $_GET[&apos;user&apos;];</div>
            <div style={{ color: '#3b82f6' }}>$query = &quot;SELECT * FROM users &quot; .</div>
            <div style={{ color: '#3b82f6' }}>          &quot;WHERE username = &apos;&quot; . $username . &quot;&apos;&quot;;</div>
          </div>
        </div>

        {/* Attack example */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ color: '#f59e0b', marginBottom: '0.5rem' }}>ATTACKER INPUT:</h4>
          <div style={{
            background: '#2d2d4a',
            borderRadius: '0.375rem',
            padding: '1rem',
            fontFamily: 'monospace',
            fontSize: '0.85rem'
          }}>
            <div style={{ color: '#22c55e' }}>admin&apos; -- </div>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginTop: '0.5rem' }}>
            The &apos; -- turns the rest of the query into a comment!
          </p>
        </div>

        {/* Resulting query */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ color: '#f59e0b', marginBottom: '0.5rem' }}>RESULTING QUERY:</h4>
          <div style={{
            background: '#2d2d4a',
            borderRadius: '0.375rem',
            padding: '1rem',
            fontFamily: 'monospace',
            fontSize: '0.85rem'
          }}>
            <div style={{ color: '#3b82f6' }}>SELECT * FROM users WHERE username = &apos;admin&apos; -- &apos; AND password = &apos;...&apos;;</div>
          </div>
          <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem' }}>
            Password check is commented out! Attacker logs in as admin without password!
          </p>
        </div>

        {/* Secure code */}
        <div style={{ marginBottom: '1rem' }}>
          <h4 style={{ color: '#22c55e', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={16} />
            SECURE CODE (Parameterized Query)
          </h4>
          <div style={{
            background: '#2d2d4a',
            borderRadius: '0.375rem',
            padding: '1rem',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            border: '1px solid #22c55e'
          }}>
            <div style={{ color: '#f59e0b' }}>$stmt = $conn-&gt;prepare(&quot;SELECT * FROM users WHERE username = ?&quot;);</div>
            <div style={{ color: '#f59e0b' }}>$stmt-&gt;bind_param(&quot;s&quot;, $_GET[&apos;user&apos;]);</div>
            <div style={{ color: '#f59e0b' }}>$stmt-&gt;execute();</div>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginTop: '0.5rem' }}>
            ✅ Parameterized queries treat input as DATA, not executable CODE!
          </p>
        </div>

        {/* Learning summary */}
        <div style={{
          background: '#252850',
          borderRadius: '0.375rem',
          padding: '1rem',
          marginTop: '1rem'
        }}>
          <h4 style={{ color: '#3b82f6', marginBottom: '0.5rem' }}>What You Learned:</h4>
          <ul style={{ color: '#9ca3af', fontSize: '0.8rem', lineHeight: '1.6', paddingLeft: '1.5rem' }}>
            <li>SQL injection happens when user input is treated as code</li>
            <li>The &apos; -- payload comments out the rest of the query</li>
            <li>Attackers can bypass logins, steal data, or delete tables</li>
            <li>Always use parameterized queries (prepared statements)</li>
            <li>Never trust user input!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InjectionLab;