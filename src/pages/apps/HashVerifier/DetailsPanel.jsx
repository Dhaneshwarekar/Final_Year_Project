import React from 'react';
import { Book, Hash, Shield, AlertTriangle, Info, Fingerprint, FileText } from 'lucide-react';

/**
 * Educational panel teaching hash concepts
 * Shows real-world IT knowledge about cryptographic hashes
 */
const DetailsPanel = () => {
  return (
    <div className="details-panel">
      <div className="details-title">
        <Book size={20} />
        <span>HASH BASICS - REAL WORLD GUIDE</span>
      </div>

      {/* What is a Hash Section */}
      <div className="details-section">
        <h4>
          <Fingerprint size={16} style={{ color: '#3b82f6' }} />
          What is a Cryptographic Hash?
        </h4>
        <div className="details-grid">
          <div className="details-card">
            <h5>🔐 Digital Fingerprint</h5>
            <p>A hash is like a fingerprint for a file. Just like your fingerprint uniquely identifies YOU, a hash uniquely identifies a FILE.</p>
          </div>
          <div className="details-card">
            <h5>🔄 One-Way Function</h5>
            <p>You can generate a hash from a file, but you CANNOT reverse a hash to get the original file. This is by design!</p>
          </div>
          <div className="details-card">
            <h5>⚡ Small Change = Big Difference</h5>
            <p>Change even ONE letter in a file, and the hash becomes COMPLETELY different.</p>
          </div>
        </div>

        {/* Example */}
        <div style={{ marginTop: '1rem', background: '#1a1d3a', padding: '1rem', borderRadius: '0.375rem' }}>
          <p style={{ color: '#e5e7eb', marginBottom: '0.5rem' }}><strong>Example:</strong></p>
          <div style={{ fontSize: '0.8rem' }}>
            <div style={{ color: '#9ca3af' }}>File: "Hello World"</div>
            <div className="hash-example">MD5: b10a8db164e0754105b7a99be72e3fe5</div>
            <div style={{ color: '#9ca3af', marginTop: '0.5rem' }}>File: "Hello World!" (added !)</div>
            <div className="hash-example">MD5: ed076287532e86365e841e92bfc50d8c</div>
            <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.25rem' }}>
              ↑ Completely different hash!
            </p>
          </div>
        </div>
      </div>

      {/* Hash Algorithms Section */}
      <div className="details-section">
        <h4>
          <Hash size={16} style={{ color: '#22c55e' }} />
          Hash Algorithms - Which One to Use?
        </h4>

        <table className="algorithm-table">
          <thead>
            <tr>
              <th>Algorithm</th>
              <th>Length</th>
              <th>Security</th>
              <th>Use Case</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span className="badge badge-warning">MD5</span></td>
              <td>32 chars</td>
              <td><span className="badge badge-error">BROKEN</span></td>
              <td>Legacy systems only - NOT secure</td>
            </tr>
            <tr>
              <td><span className="badge badge-warning">SHA-1</span></td>
              <td>40 chars</td>
              <td><span className="badge badge-warning">WEAK</span></td>
              <td>Being phased out - avoid</td>
            </tr>
            <tr>
              <td><span className="badge badge-success">SHA-256</span></td>
              <td>64 chars</td>
              <td><span className="badge badge-success">SECURE</span></td>
              <td>Current industry standard ✓</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Real-World Uses Section */}
      <div className="details-section">
        <h4>
          <Shield size={16} style={{ color: '#8b5cf6' }} />
          Real-World Uses of Hashes
        </h4>
        <div className="details-grid">
          <div className="details-card">
            <h5>📋 Evidence Verification</h5>
            <p>Investigators record file hashes to prove evidence wasn't tampered with later. If the hash matches, the file is authentic.</p>
          </div>
          <div className="details-card">
            <h5>🦠 Malware Identification</h5>
            <p>Security tools like VirusTotal use hash databases to identify known malware. Same hash = same file!</p>
          </div>
          <div className="details-card">
            <h5>🔑 Password Storage</h5>
            <p>Websites store password HASHES, not actual passwords. When you login, they hash what you typed and compare.</p>
          </div>
          <div className="details-card">
            <h5>📦 File Downloads</h5>
            <p>Software downloads often provide hashes so you can verify the file wasn't corrupted or tampered with.</p>
          </div>
        </div>
      </div>

      {/* Chain of Custody Section */}
      <div className="details-section">
        <h4>
          <FileText size={16} style={{ color: '#f59e0b' }} />
          Chain of Custody & Evidence
        </h4>
        <div style={{ background: '#252850', padding: '1rem', borderRadius: '0.375rem' }}>
          <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            <strong>In forensic investigations:</strong>
          </p>
          <ol style={{ color: '#9ca3af', fontSize: '0.8rem', paddingLeft: '1.2rem', lineHeight: '1.6' }}>
            <li>Original evidence is hashed immediately</li>
            <li>Hash value is documented in case notes</li>
            <li>Any analysis is done on COPIES, not original</li>
            <li>Before court, evidence is re-hashed to prove it's unchanged</li>
            <li>If hash matches → evidence is admissible</li>
          </ol>
          <p style={{ color: '#22c55e', fontSize: '0.8rem', marginTop: '0.5rem' }}>
            ✅ This is why hash verification is CRITICAL!
          </p>
        </div>
      </div>

      {/* Threat Intelligence Section */}
      <div className="details-section">
        <h4>
          <AlertTriangle size={16} style={{ color: '#ef4444' }} />
          How Threat Intelligence Works
        </h4>
        <div className="details-grid">
          <div className="details-card">
            <h5>📊 Hash Databases</h5>
            <p>Security companies collect malware samples and store their hashes. When you find a suspicious file, you check if its hash is in the database.</p>
          </div>
          <div className="details-card">
            <h5>🌐 VirusTotal</h5>
            <p>Real-world tool that checks files against 70+ antivirus engines. All based on hash matching!</p>
          </div>
        </div>
      </div>

      {/* Common Questions */}
      <div className="details-section">
        <h4>
          <Info size={16} style={{ color: '#3b82f6' }} />
          Common Questions
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: '#252850', padding: '0.75rem', borderRadius: '0.375rem' }}>
            <p style={{ color: '#f59e0b', fontWeight: '600', marginBottom: '0.25rem' }}>Can two files have the same hash?</p>
            <p style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Theoretically yes (called a "collision"), but with SHA-256 it's so rare it's practically impossible. You're more likely to win the lottery 10 times in a row!</p>
          </div>
          <div style={{ background: '#252850', padding: '0.75rem', borderRadius: '0.375rem' }}>
            <p style={{ color: '#f59e0b', fontWeight: '600', marginBottom: '0.25rem' }}>Can I decrypt a hash?</p>
            <p style={{ color: '#9ca3af', fontSize: '0.8rem' }}>No! Hashes are one-way by design. You can't "decrypt" them any more than you can turn a hamburger back into a cow.</p>
          </div>
          <div style={{ background: '#252850', padding: '0.75rem', borderRadius: '0.375rem' }}>
            <p style={{ color: '#f59e0b', fontWeight: '600', marginBottom: '0.25rem' }}>Why so many algorithms?</p>
            <p style={{ color: '#9ca3af', fontSize: '0.8rem' }}>As computers get faster, old algorithms become breakable. MD5 was secure in 1991, but now it's broken. SHA-256 is current standard.</p>
          </div>
        </div>
      </div>

      {/* How to Use This App */}
      <div className="details-section">
        <h4>
          <Info size={16} style={{ color: '#22c55e' }} />
          How to Use This App
        </h4>
        <div style={{ background: '#252850', padding: '1rem', borderRadius: '0.375rem' }}>
          <ol style={{ color: '#9ca3af', fontSize: '0.8rem', lineHeight: '1.8', paddingLeft: '1.2rem' }}>
            <li><strong>STEP 1:</strong> Click "BROWSE FILES" and select a file from case evidence</li>
            <li><strong>STEP 2:</strong> Choose algorithm (SHA-256 recommended) and click "CALCULATE HASH"</li>
            <li><strong>STEP 3:</strong> Compare with expected hash from case or check threat database</li>
            <li><strong>GREEN ✅</strong> = File unchanged / clean</li>
            <li><strong>RED ❌</strong> = File tampered / malware detected</li>
            <li>Click "ADD TO CASE NOTES" to document findings</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default DetailsPanel;