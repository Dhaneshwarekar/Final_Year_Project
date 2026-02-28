import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Lock } from 'lucide-react';

const PasswordVerifyModal = ({ isOpen, onClose, onSuccess, user }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError('');
      setAttempts(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Trim password to remove spaces or hidden characters
    const trimmedPassword = password.trim();

    try {
      console.log('🔐 Sending verification for user:', user?._id);

      const response = await fetch('http://localhost:5000/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          password: trimmedPassword
        })
      });

      const data = await response.json();

      if (response.ok && data.verified) {
        console.log('✅ Verified! Calling onSuccess...');
        
        // CALL THE PARENT'S SUCCESS FUNCTION
        onSuccess();
        onClose();
      } else {
        setError(data.message || 'Incorrect password');
        setPassword('');
        setAttempts(prev => prev + 1);
      }
    } catch (error) {
      setError('Connection error. Please try again.');
      setAttempts(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#1a1d3a] border-2 border-cyan-500/30 rounded-2xl w-full max-w-md p-8 shadow-2xl animate-slideUp">
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Lock size={40} className="text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-white mb-2">
          Level 1 Access Required
        </h2>
        <p className="text-center text-gray-400 mb-6">
          Enter your account password to start the investigation
        </p>

        {/* User info */}
        <div className="bg-[#0a0a1a] border border-cyan-500/20 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-xl">👤</span>
            </div>
            <div>
              <p className="text-white font-semibold">{user?.fullName || 'Detective'}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleVerify}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Investigation Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-[#0a0a1a] border border-cyan-500/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition font-mono tracking-wider"
              autoFocus
              disabled={loading}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {attempts >= 2 && (
            <div className="mb-4 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-400 text-xs text-center">
                ⚠️ Forgot password? Use the same password you used to log in
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-400 hover:to-blue-500 transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Unlock Investigation →'}
          </button>
        </form>

        {/* Hint */}
        <p className="text-center text-xs text-gray-500 mt-4">
          This is the same password you used to log in
        </p>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease;
        }
      `}</style>
    </div>
  );
};

export default PasswordVerifyModal;