import React from 'react';
import Icon from '../AppIcon';

const NotificationPanel = ({ isOpen, onClose, notifications, activeCase }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-1100"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-20 right-6 w-96 bg-[#1a1d3a]/98 backdrop-blur-xl border border-cyan-500/30 rounded-xl shadow-2xl z-1200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Icon name="Mail" size={20} className="text-cyan-400" />
            <h3 className="text-white font-semibold">Case Brief</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <Icon name="X" size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Case Brief Content */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {activeCase && (
            <div className="space-y-4">
              {/* Case Header */}
              <div className="bg-cyan-500/10 p-3 rounded-lg border border-cyan-500/30">
                <h4 className="text-cyan-400 font-bold text-lg">CASE {activeCase.id}</h4>
                <p className="text-white font-semibold">{activeCase.title}</p>
              </div>

              {/* Full Brief */}
              <div className="space-y-3">
                <div className="bg-black/30 p-3 rounded-lg">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    "This morning, HR noticed something strange. At 3:00 AM, someone accessed employee salary 
                    records using John Doe's account. John is a marketing manager. He swears he was asleep at 3 AM. 
                    His wife confirms he was home. But the system shows his account was used."
                  </p>
                </div>

                {/* Victim Info */}
                <div className="border-l-2 border-cyan-500 pl-3">
                  <p className="text-xs text-gray-500">VICTIM</p>
                  <p className="text-white text-sm">{activeCase.victim}</p>
                </div>

                {/* Incident Info */}
                <div className="border-l-2 border-cyan-500 pl-3">
                  <p className="text-xs text-gray-500">INCIDENT</p>
                  <p className="text-white text-sm">{activeCase.incident}</p>
                </div>

                {/* Stakes */}
                <div className="border-l-2 border-amber-500 pl-3">
                  <p className="text-xs text-gray-500">STAKES</p>
                  <p className="text-amber-400 text-sm">{activeCase.stakes}</p>
                </div>

                {/* Mission */}
                <div className="bg-black/30 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">YOUR MISSION</p>
                  <ul className="space-y-2">
                    {activeCase.mission.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-cyan-400">☐</span>
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tools */}
                <div className="bg-black/30 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">TOOLS UNLOCKED</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-green-400">✅</span>
                      <span className="text-gray-300">File Explorer</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-green-400">✅</span>
                      <span className="text-gray-300">Log Viewer</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-green-400">✅</span>
                      <span className="text-gray-300">Terminal</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-green-400">✅</span>
                      <span className="text-gray-300">Case Notes</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-full mt-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all"
              >
                Start Investigation
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;