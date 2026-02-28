import React, { useState } from 'react';
import { Hash, Copy, CheckCircle } from 'lucide-react';

/**
 * Step 2: Hash Calculation
 * Generates hash of selected file using chosen algorithm
 */
const HashCalculator = ({ selectedFile, onHashCalculated, caseId = '101' }) => {
  const [algorithm, setAlgorithm] = useState('sha256');
  const [isCalculating, setIsCalculating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hash, setHash] = useState(null);
  const [copied, setCopied] = useState(false);

  // Algorithm options with descriptions
  const algorithms = [
    { id: 'md5', name: 'MD5', length: 32, note: 'Legacy - not secure' },
    { id: 'sha1', name: 'SHA-1', length: 40, note: 'Weak - being phased out' },
    { id: 'sha256', name: 'SHA-256', length: 64, note: 'Current standard ✅' }
  ];

  // Simulate hash calculation
  const calculateHash = () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    setIsCalculating(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 20;
      });
    }, 300);

    // Simulate calculation delay
    setTimeout(() => {
      clearInterval(interval);
      
      // Get hash from pre-calculated database based on file and algorithm
      let calculatedHash = '';
      if (selectedFile.hashes && selectedFile.hashes[algorithm]) {
        calculatedHash = selectedFile.hashes[algorithm];
      } else {
        // Fallback demo hash
        calculatedHash = 'a7f8c9d3b5e6f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6'.substring(0, algorithms.find(a => a.id === algorithm).length * 2);
      }
      
      setHash(calculatedHash);
      onHashCalculated(calculatedHash);
      setIsCalculating(false);
      setProgress(100);
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="step-card">
      <div className="step-title">
        <span>🔍</span>
        STEP 2: CALCULATE HASH
        {caseId === '102' && selectedFile?.name === 'credentials.txt' && (
          <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#fbbf24' }}>
            ⭐ Discovery 5
          </span>
        )}
      </div>

      {/* Algorithm Selection */}
      <div className="algorithm-selector">
        {algorithms.map(algo => (
          <label key={algo.id} className="algorithm-option">
            <input
              type="radio"
              name="algorithm"
              value={algo.id}
              checked={algorithm === algo.id}
              onChange={(e) => setAlgorithm(e.target.value)}
              disabled={isCalculating}
            />
            <span>
              {algo.name} ({algo.length} chars)
              {algo.note && <span style={{ fontSize: '0.7rem', color: '#9ca3af', marginLeft: '0.25rem' }}>{algo.note}</span>}
            </span>
          </label>
        ))}
      </div>

      {/* Calculate Button */}
      <button 
        className="calculate-btn"
        onClick={calculateHash}
        disabled={isCalculating || !selectedFile}
      >
        <Hash size={16} />
        {isCalculating ? 'CALCULATING...' : 'CALCULATE HASH'}
      </button>

      {/* Progress Bar */}
      {isCalculating && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Hash Result */}
      {hash && !isCalculating && (
        <div className="hash-result">
          <span className="hash-value">{hash}</span>
          <button className="copy-btn" onClick={copyToClipboard}>
            {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
            {copied ? 'COPIED!' : 'COPY'}
          </button>
        </div>
      )}
    </div>
  );
};

export default HashCalculator;