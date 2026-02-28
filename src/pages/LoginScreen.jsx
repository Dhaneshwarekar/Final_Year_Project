// Add this to your login success handler
const handleLoginSuccess = (userData) => {
  // Save user to localStorage
  localStorage.setItem('user', JSON.stringify(userData));
  
  // Initialize game progress if not exists
  if (!userData.gameProgress) {
    userData.gameProgress = {
      case101: { discoveries: [], xp: 0, notes: [], completed: false },
      totalXP: 0,
      level: 1
    };
    localStorage.setItem('user', JSON.stringify(userData));
  }
  
  // Navigate to game
  navigate('/game-level');
};