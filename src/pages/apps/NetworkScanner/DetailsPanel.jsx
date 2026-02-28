import React from 'react';
import { Book, Network, Shield, Server, Globe, Zap, AlertCircle, Info } from 'lucide-react';

const DetailsPanel = () => {
  return (
    <div className="details-panel">
      <div className="details-title">
        <Book size={20} />
        <span>NETWORKING BASICS - REAL WORLD GUIDE</span>
      </div>

      {/* IP Addresses Section */}
      <div className="details-section">
        <h4>
          <Globe size={16} style={{ color: '#3b82f6' }} />
          IP Addresses - The Foundation
        </h4>
        <div className="details-grid">
          <div className="details-card">
            <h5>📌 What is an IP Address?</h5>
            <p>Like a home address for your computer on the internet. Every device needs one to communicate.</p>
            <p style={{ marginTop: '0.5rem', color: '#f59e0b' }}>Example: 192.168.1.100</p>
          </div>
          <div className="details-card">
            <h5>🌍 Public vs Private IPs</h5>
            <p><strong>Public:</strong> Visible on internet (203.45.67.89)</p>
            <p><strong>Private:</strong> Inside your network (192.168.x.x, 10.x.x.x)</p>
          </div>
          <div className="details-card">
            <h5>📍 Geolocation</h5>
            <p>IPs are registered in specific countries. An IP from Russia connecting to a US company? Suspicious!</p>
          </div>
        </div>
      </div>

      {/* Ports Section */}
      <div className="details-section">
        <h4>
          <Server size={16} style={{ color: '#22c55e' }} />
          Ports - Doors into a Computer
        </h4>
        <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '1rem' }}>
          Think of an IP as a building address, ports are the apartment numbers. Different services use different doors.
        </p>
        
        <table className="port-table">
          <thead>
            <tr>
              <th>Port</th>
              <th>Service</th>
              <th>What It Does</th>
              <th>Investigation Note</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span className="state-badge badge-info">21</span></td>
              <td>FTP</td>
              <td>File Transfer</td>
              <td>Unencrypted - can steal files</td>
            </tr>
            <tr>
              <td><span className="state-badge badge-info">22</span></td>
              <td>SSH</td>
              <td>Secure Shell (remote control)</td>
              <td>If open externally, attackers can try to break in</td>
            </tr>
            <tr>
              <td><span className="state-badge badge-info">80</span></td>
              <td>HTTP</td>
              <td>Website (unencrypted)</td>
              <td>Can see all data in clear text</td>
            </tr>
            <tr>
              <td><span className="state-badge badge-info">443</span></td>
              <td>HTTPS</td>
              <td>Secure Website</td>
              <td>Encrypted - harder to spy on</td>
            </tr>
            <tr>
              <td><span className="state-badge badge-info">445</span></td>
              <td>SMB</td>
              <td>File Sharing (Windows)</td>
              <td>Common ransomware attack vector</td>
            </tr>
            <tr>
              <td><span className="state-badge badge-info">3306</span></td>
              <td>MySQL</td>
              <td>Database</td>
              <td>If exposed, data can be stolen</td>
            </tr>
            <tr>
              <td><span className="state-badge badge-info">4444</span></td>
              <td>Metasploit</td>
              <td>Malware C2</td>
              <td>⚠️ Often used by hackers for control</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Connection States Section */}
      <div className="details-section">
        <h4>
          <Network size={16} style={{ color: '#f59e0b' }} />
          Connection States - What They Mean
        </h4>
        <div className="details-grid">
          <div className="details-card">
            <h5>🔵 ESTABLISHED</h5>
            <p>Active connection - data is flowing right now. If to suspicious IP, data might be leaking NOW.</p>
          </div>
          <div className="details-card">
            <h5>🟡 TIME_WAIT</h5>
            <p>Connection just closed. Recent communication happened. Like a phone call that just ended.</p>
          </div>
          <div className="details-card">
            <h5>🔴 SYN_SENT</h5>
            <p>Trying to connect. Your computer is attempting to reach somewhere. Could be malware "calling home".</p>
          </div>
          <div className="details-card">
            <h5>⚫ LISTENING</h5>
            <p>Waiting for connections. Your computer is running a server. Is it supposed to be?</p>
          </div>
        </div>
      </div>

      {/* Attack Patterns Section */}
      <div className="details-section">
        <h4>
          <Shield size={16} style={{ color: '#ef4444' }} />
          Real-World Investigation Patterns
        </h4>
        <div className="details-grid">
          <div className="details-card">
            <h5>🎯 Command & Control (C2)</h5>
            <p>Malware connects to attacker's server. Look for: Unusual ports (4444), foreign IPs, persistent connections.</p>
          </div>
          <div className="details-card">
            <h5>💾 Data Exfiltration</h5>
            <p>Stolen data being sent out. Look for: Large data transfers, connections to cloud storage, odd hours.</p>
          </div>
          <div className="details-card">
            <h5>🔓 Brute Force Attack</h5>
            <p>Someone trying to guess passwords. Look for: Many failed connections to port 22 (SSH) or 3389 (RDP).</p>
          </div>
          <div className="details-card">
            <h5>🕸️ Port Scanning</h5>
            <p>Attackers mapping your network. Look for: Many connections to different ports from same IP.</p>
          </div>
        </div>
      </div>

      {/* Key Terms Glossary */}
      <div className="details-section">
        <h4>
          <Info size={16} style={{ color: '#8b5cf6' }} />
          Key Terms Glossary
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          <div className="term-item">
            <div className="term-term">Banner Grabbing</div>
            <div className="term-def">Getting software version info - helps identify vulnerable systems</div>
          </div>
          <div className="term-item">
            <div className="term-term">Filtered Port</div>
            <div className="term-def">Firewall blocking - service might be there but hidden</div>
          </div>
          <div className="term-item">
            <div className="term-term">WHOIS</div>
            <div className="term-def">Database showing who owns an IP/domain</div>
          </div>
          <div className="term-item">
            <div className="term-term">C2 Server</div>
            <div className="term-def">Command & Control - attacker's control center for malware</div>
          </div>
          <div className="term-item">
            <div className="term-term">Localhost</div>
            <div className="term-def">127.0.0.1 - your own computer</div>
          </div>
          <div className="term-item">
            <div className="term-term">RFC 1918</div>
            <div className="term-def">Private IP ranges (10.x.x.x, 172.16.x.x, 192.168.x.x)</div>
          </div>
        </div>
      </div>

      {/* Investigation Tips */}
      <div className="details-section">
        <h4>
          <AlertCircle size={16} style={{ color: '#f59e0b' }} />
          🔍 Investigation Tips
        </h4>
        <ul style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: '1.6', paddingLeft: '1.5rem' }}>
          <li>Always check geolocation - attacks often come from unexpected countries</li>
          <li>Unusual ports (like 4444) are red flags - investigate immediately</li>
          <li>Multiple connections from same IP? Could be port scanning</li>
          <li>SSH (port 22) should NEVER be open to the internet in secure environments</li>
          <li>Export findings to Case Notes - document everything!</li>
          <li>Correlate with logs - network activity should match log entries</li>
        </ul>
      </div>
    </div>
  );
};

export default DetailsPanel;