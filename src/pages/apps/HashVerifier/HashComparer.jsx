import React, { useState } from 'react';
import { CheckCircle, XCircle, Award } from 'lucide-react';

/**
 * Step 3: Compare & Verify
 * Compares calculated hash against expected value
 */
const HashComparer = ({ calculatedHash, expectedHashes, fileName, caseId = '101', onVerified }) => {
  const [compareMode, setCompareMode] = useState('case'); // 'case', 'manual'
  const [manualHash, setManualHash] = useState('');
  const [comparisonResult, setComparisonResult] = useState(null);

  const handleCompare = () => {
    if (!calculatedHash) {
      alert('Please calculate a hash first');
      return;
    }

    let expected = '';
    
    if (compareMode === 'case' && expectedHashes) {
      // Use hash from case files
      expected = expectedHashes.sha256 || expectedHashes.md5 || expectedHashes.sha1;
    } else if (compareMode === 'manual') {
      expected = manualHash.trim();
      if (expected.length === 0) {
        alert('Please enter an expected hash');
        return;
      }
    }

    // Compare
    const match = calculatedHash === expected;
    
    setComparisonResult({
      match,
      calculated: calculatedHash,
      expected: expected,
      message: match 
        ? 'HASHES MATCH! File integrity VERIFIED'
        : 'HASHES DO NOT MATCH! File MAY HAVE BEEN TAMPERED'
    });

    onVerified?.();

    // If this is credentials.txt in Case #102 and hashes match, trigger discovery
    if (caseId === '102' && fileName === 'credentials.txt' && match) {
      // Discovery will be triggered by parent component
    }
  };

  return (
    <div className="step-card">
      <div className="step-title">
        <span>🔍</span>
        STEP 3: COMPARE & VERIFY
      </div>

      {/* Comparison Options */}
      <div className="comparison-options">
        <label className="comparison-radio">
          <input
            type="radio"
            value="case"
            checked={compareMode === 'case'}
            onChange={() => setCompareMode('case')}
          />
          <span>Expected hash from case</span>
        </label>
        <label className="comparison-radio">
          <input
            type="radio"
            value="manual"
            checked={compareMode === 'manual'}
            onChange={() => setCompareMode('manual')}
          />
          <span>Manual entry</span>
        </label>
      </div>

      {/* Manual Entry Field */}
      {compareMode === 'manual' && (
        <input
          type="text"
          className="expected-hash-input"
          placeholder="Paste expected hash (64 hex chars for SHA-256)"
          value={manualHash}
          onChange={(e) => setManualHash(e.target.value)}
        />
      )}

      {/* Compare Button */}
      <button className="compare-btn" onClick={handleCompare}>
        <CheckCircle size={16} />
        COMPARE
      </button>

      {/* Comparison Result */}
      {comparisonResult && (
        <div className={`result-card ${comparisonResult.match ? 'success' : 'error'}`}>
          <div className="result-icon">
            {comparisonResult.match ? '✅' : '❌'}
          </div>
          <div className="result-title">
            {comparisonResult.match ? 'VERIFIED' : 'TAMPERED'}
          </div>
          <div className="result-message">
            {comparisonResult.message}
          </div>
          
          {/* Show hash comparison */}
          <div className="hash-compare">
            <div style={{ color: '#9ca3af', fontSize: '0.7rem', marginBottom: '0.25rem' }}>
              Calculated:
            </div>
            <div className={comparisonResult.match ? 'hash-match' : 'hash-mismatch'}>
              {comparisonResult.calculated}
            </div>
            <div style={{ color: '#9ca3af', fontSize: '0.7rem', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
              Expected:
            </div>
            <div className={comparisonResult.match ? 'hash-match' : 'hash-mismatch'}>
              {comparisonResult.expected}
            </div>
          </div>

          {comparisonResult.match && caseId === '102' && fileName === 'credentials.txt' && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '0.75rem',
              background: 'rgba(251,191,36,0.1)',
              border: '1px solid #fbbf24',
              borderRadius: '0.375rem',
              color: '#fbbf24',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Award size={16} />
              <span>✅ Discovery 5 verified! The credentials file is authentic.</span>
            </div>
          )}

          {!comparisonResult.match && (
            <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem' }}>
              ⚠️ WARNING: Evidence integrity compromised!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HashComparer;