// ActivityItem.jsx - Updated version
import React from 'react';

const ActivityItem = ({ icon, color, message, time, xp }) => {
  return (
    <div className="flex items-start gap-3 p-3 bg-crime-dark/30 rounded-lg hover:bg-crime-dark/50 transition-all">
      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${color}20`, color: color }}>
        <span>{icon}</span>
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-200">{message}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-500">{time}</span>
          {xp && xp > 0 && (
            <>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-yellow-400">⚡ +{xp} XP</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;