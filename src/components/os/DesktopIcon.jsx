import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';

const DesktopIcon = ({ app, onClick }) => {
  // Color classes using Tailwind (since that's what your project uses)
  const colorClasses = {
    red: 'bg-red-500/20 border-red-500/50 hover:bg-red-500/30 hover:border-red-500',
    blue: 'bg-blue-500/20 border-blue-500/50 hover:bg-blue-500/30 hover:border-blue-500',
    cyan: 'bg-cyan-500/20 border-cyan-500/50 hover:bg-cyan-500/30 hover:border-cyan-500',
    yellow: 'bg-yellow-500/20 border-yellow-500/50 hover:bg-yellow-500/30 hover:border-yellow-500',
    purple: 'bg-purple-500/20 border-purple-500/50 hover:bg-purple-500/30 hover:border-purple-500',
    gray: 'bg-gray-500/20 border-gray-500/50 hover:bg-gray-500/30 hover:border-gray-500',
    orange: 'bg-orange-500/20 border-orange-500/50 hover:bg-orange-500/30 hover:border-orange-500',
    green: 'bg-green-500/20 border-green-500/50 hover:bg-green-500/30 hover:border-green-500',
    amber: 'bg-amber-500/20 border-amber-500/50 hover:bg-amber-500/30 hover:border-amber-500',
    pink: 'bg-pink-500/20 border-pink-500/50 hover:bg-pink-500/30 hover:border-pink-500'
  };

  const iconColorClasses = {
    red: 'text-red-400',
    blue: 'text-blue-400',
    cyan: 'text-cyan-400',
    yellow: 'text-yellow-400',
    purple: 'text-purple-400',
    gray: 'text-gray-400',
    orange: 'text-orange-400',
    green: 'text-green-400',
    amber: 'text-amber-400',
    pink: 'text-pink-400'
  };

  const content = (
    <>
      <div className={`w-full aspect-square rounded-lg border-2 ${colorClasses?.[app?.color] || colorClasses?.gray} flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105`}>
        <Icon name={app?.icon} size={32} className={iconColorClasses?.[app?.color] || iconColorClasses?.gray} />
      </div>
      <span className="text-xs text-gray-200 text-center mt-2 font-medium leading-tight line-clamp-2">
        {app?.name}
      </span>
    </>
  );

  if (app?.route) {
    return (
      <Link
        to={app?.route}
        state={app?.state}
        className="flex flex-col items-center cursor-pointer group"
        onClick={(e) => {
          if (onClick) {
            e.preventDefault();
            onClick(app);
          }
        }}
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      onClick={() => onClick && onClick(app)}
      className="flex flex-col items-center cursor-pointer group"
    >
      {content}
    </div>
  );
};

export default DesktopIcon;