import React from 'react';

const StatCard = ({ title, value, subtitle, icon }) => {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
        <div className="w-10 h-10 bg-crime-light/20 rounded-lg flex items-center justify-center 
                      group-hover:bg-crime-light/30 transition">
          <span className="text-xl">{icon}</span>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-4xl font-bold text-crime-glow">{value}</p>
        <p className="text-xs text-gray-400 uppercase tracking-wider">{subtitle}</p>
      </div>
    </div>
  );
};

export default StatCard;