import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const Taskbar = ({ onNotificationClick, notificationCount }) => {
  const navigate = useNavigate();
  const [clickedButton, setClickedButton] = useState(null);

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });

  const handleButtonClick = (e, buttonId, callback) => {
    e.preventDefault();
    setClickedButton(buttonId);
    
    setTimeout(() => {
      setClickedButton(null);
      if (callback) callback();
    }, 200);
  };

  const handleGoBack = () => {
    navigate('/game-level');
  };

  return (
    <div className="taskbar">
      <div className="taskbar-left">
        <button
          className={`taskbar-start ${clickedButton === 'start' ? 'clicked' : ''}`}
          onClick={(e) => handleButtonClick(e, 'start', () => navigate('/game-level'))}
        >
          <Icon name="Zap" size={18} />
          <span>CrimeSolver</span>
        </button>
      </div>

      <div className="taskbar-center">
        {/* Empty for now - can add pinned apps later */}
      </div>

      <div className="taskbar-right">
        <button
          className={`taskbar-notification ${clickedButton === 'notification' ? 'clicked' : ''}`}
          onClick={(e) => handleButtonClick(e, 'notification', onNotificationClick)}
        >
          <Icon name="Bell" size={18} />
          {notificationCount > 0 && (
            <span className="notification-badge">{notificationCount}</span>
          )}
        </button>

        <div className="taskbar-time">
          <div className="time">{currentTime}</div>
          <div className="date">{currentDate}</div>
        </div>

        <button
          className={`taskbar-back ${clickedButton === 'back' ? 'clicked' : ''}`}
          onClick={(e) => handleButtonClick(e, 'back', handleGoBack)}
        >
          <Icon name="ArrowLeft" size={18} />
          <span>Back</span>
        </button>
      </div>
    </div>
  );
};

export default Taskbar;