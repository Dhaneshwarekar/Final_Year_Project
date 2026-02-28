// AdminPage.jsx - COMPLETELY FIXED VERSION with REAL-TIME updates
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import StatCard from '../components/Game-level/StatCard';
import ActivityItem from '../components/Game-level/ActivityItem';

function AdminPage() {
  const navigate = useNavigate();
  
  // ===== STATE MANAGEMENT =====
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  // Game progress state
  const [case101Progress, setCase101Progress] = useState([]);
  const [case102Progress, setCase102Progress] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [refreshCounter, setRefreshCounter] = useState(0); // Force re-render
  
  // 🔴 CHECK IF USER IS ADMIN
  useEffect(() => {
    const isAdmin = window.confirm('Are you an admin? Click OK to continue, Cancel to go home.');
    if (!isAdmin) {
      navigate('/');
    }
  }, [navigate]);

  // ===== FETCH USERS FROM MONGODB =====
  const fetchUsers = async () => {
    setLoading(true);
    try {
      console.log('🔄 Fetching users from server...');
      const response = await fetch('http://localhost:5000/api/users');
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Loaded users:', data.length);
      setUsers(data);
    } catch (error) {
      console.error('❌ Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // ===== FETCH GAME PROGRESS FROM MONGODB - FIXED VERSION =====
  const fetchGameProgress = async () => {
    try {
      console.log('🔄 Fetching game progress...');
      
      // Fetch all users first to get IDs
      const usersResponse = await fetch('http://localhost:5000/api/users');
      const usersData = await usersResponse.json();
      
      const case101Data = [];
      const case102Data = [];
      const activities = [];

      // For each user, fetch their case progress
      for (const user of usersData) {
        const userName = user.fullName || user.email?.split('@')[0] || 'Unknown';
        
        // ===== FETCH CASE #101 PROGRESS =====
        try {
          // Try different possible endpoint formats
          let response101;
          let data101 = null;
          
          // Try level1progresses first
          response101 = await fetch(`http://localhost:5000/api/level1progresses/notes/${user._id}`);
          if (response101.ok) {
            data101 = await response101.json();
            console.log(`📊 Case #101 data for ${userName}:`, data101);
          } else {
            // Try alternative endpoint
            response101 = await fetch(`http://localhost:5000/api/level1progresses/${user._id}`);
            if (response101.ok) {
              data101 = await response101.json();
            }
          }
          
          if (data101) {
            // Handle different possible data formats
            const discoveries = data101.discoveries || [];
            const xpEarned = data101.xpEarned || data101.xp || 0;
            const notes = data101.notes || [];
            const completed = discoveries.length === 5;
            const accuracy = data101.accuracy || (completed ? 100 : 0);
            
            case101Data.push({
              userId: user._id,
              userName: userName,
              discoveries: discoveries,
              xp: xpEarned,
              notes: notes,
              status: data101.status || (completed ? 'completed' : 'in-progress'),
              completed: completed,
              completedAt: data101.completedAt,
              accuracy: accuracy,
              lastActivity: data101.updatedAt || data101.createdAt
            });

            // Add to activities if there are discoveries
            if (discoveries.length > 0) {
              activities.push({
                id: `101-${user._id}-${Date.now()}`,
                icon: '🔓',
                color: '#00b4d8',
                message: `${userName} found ${discoveries.length}/5 discoveries in Case #101`,
                time: new Date().toLocaleTimeString(),
                xp: xpEarned,
                details: `Discoveries: ${discoveries.join(', ')}`
              });
            }

            // Add completion activity
            if (completed) {
              activities.push({
                id: `complete-101-${user._id}`,
                icon: '🏆',
                color: '#4ade80',
                message: `${userName} SOLVED Case #101 with ${accuracy}% accuracy!`,
                time: new Date().toLocaleTimeString(),
                xp: xpEarned
              });
            }
          }
        } catch (error) {
          console.error(`Error fetching case101 for user ${user._id}:`, error);
        }

        // ===== FETCH CASE #102 PROGRESS =====
        try {
          // Try different possible endpoint formats
          let response102;
          let data102 = null;
          
          // Try level2progresses first
          response102 = await fetch(`http://localhost:5000/api/level2progresses/notes/${user._id}`);
          if (response102.ok) {
            data102 = await response102.json();
            console.log(`📊 Case #102 data for ${userName}:`, data102);
          } else {
            // Try alternative endpoint
            response102 = await fetch(`http://localhost:5000/api/level2progresses/${user._id}`);
            if (response102.ok) {
              data102 = await response102.json();
            }
          }
          
          if (data102) {
            // Handle different possible data formats
            const discoveries = data102.discoveries || [];
            const xpEarned = data102.xpEarned || data102.xp || 0;
            const notes = data102.notes || [];
            const completed = discoveries.length === 6;
            const accuracy = data102.accuracy || (completed ? 100 : 0);
            
            case102Data.push({
              userId: user._id,
              userName: userName,
              discoveries: discoveries,
              xp: xpEarned,
              notes: notes,
              status: data102.status || (completed ? 'completed' : 'in-progress'),
              completed: completed,
              completedAt: data102.completedAt,
              accuracy: accuracy,
              lastActivity: data102.updatedAt || data102.createdAt
            });

            // Add to activities if there are discoveries
            if (discoveries.length > 0) {
              activities.push({
                id: `102-${user._id}-${Date.now()}`,
                icon: '🎣',
                color: '#f97316',
                message: `${userName} found ${discoveries.length}/6 discoveries in Case #102`,
                time: new Date().toLocaleTimeString(),
                xp: xpEarned,
                details: `Discoveries: ${discoveries.join(', ')}`
              });
            }

            // Add completion activity
            if (completed) {
              activities.push({
                id: `complete-102-${user._id}`,
                icon: '🏆',
                color: '#4ade80',
                message: `${userName} SOLVED Case #102 with ${accuracy}% accuracy!`,
                time: new Date().toLocaleTimeString(),
                xp: xpEarned
              });
            }
          }
        } catch (error) {
          console.error(`Error fetching case102 for user ${user._id}:`, error);
        }
      }

      // Sort activities by time (most recent first)
      activities.sort((a, b) => new Date(b.time) - new Date(a.time));
      
      setCase101Progress(case101Data);
      setCase102Progress(case102Data);
      setRecentActivities(activities.slice(0, 15)); // Show last 15 activities
      
      console.log('✅ Game progress loaded:', {
        case101: case101Data.length,
        case102: case102Data.length,
        activities: activities.length
      });
      
      // Log the actual data to verify
      if (case101Data.length > 0) {
        console.log('Sample Case #101 data:', case101Data[0]);
      }
      if (case102Data.length > 0) {
        console.log('Sample Case #102 data:', case102Data[0]);
      }
      
    } catch (error) {
      console.error('❌ Error fetching game progress:', error);
    }
  };

  // ===== FORCE REFRESH FUNCTION =====
  const forceRefresh = async () => {
    console.log('🔄 Force refreshing all data...');
    await fetchUsers();
    await fetchGameProgress();
    setLastUpdate(new Date());
    setRefreshCounter(prev => prev + 1);
  };

  // ===== AUTO-REFRESH EVERY 5 SECONDS =====
  useEffect(() => {
    // Initial load
    forceRefresh();
    
    // Set up auto-refresh
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing admin data...');
      fetchGameProgress(); // Only refresh progress, not users
      setLastUpdate(new Date());
    }, 5000); // 5 seconds for more real-time feel
    
    return () => clearInterval(interval);
  }, []);

  // ===== REFRESH WHEN TAB CHANGES =====
  useEffect(() => {
    if (activeTab === 'users' || activeTab === 'dashboard' || activeTab === 'analytics') {
      forceRefresh();
    }
  }, [activeTab]);

  // ===== DELETE USER FROM MONGODB =====
  const deleteUser = async (userId, username) => {
    if (!window.confirm(`Are you sure you want to delete user "${username}"? This will also delete all their game progress!`)) {
      return;
    }

    try {
      console.log(`🗑️ Deleting user ${userId}...`);
      
      // First delete user's progress
      await fetch(`http://localhost:5000/api/level1progresses/reset-complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      
      await fetch(`http://localhost:5000/api/level2progresses/reset-complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      
      // Then delete user
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUsers(users.filter(user => user._id !== userId));
        // Refresh game progress
        await fetchGameProgress();
        alert(`✅ User "${username}" and all their progress deleted successfully!`);
      } else {
        alert(`❌ Failed to delete user: ${data.message}`);
      }
    } catch (error) {
      console.error('❌ Error deleting user:', error);
      alert('Error deleting user. Please try again.');
    }
  };

  // ===== LOGOUT FUNCTION =====
  const handleLogout = () => {
    navigate('/');
  };

  // ===== FORMAT DATE FOR DISPLAY =====
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ===== SIDEBAR MENU ITEMS =====
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ];

  // ===== CALCULATE STATS =====
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  
  const totalCase101Completions = case101Progress.filter(p => p.completed).length;
  const totalCase102Completions = case102Progress.filter(p => p.completed).length;
  
  const totalDiscoveriesFound = 
    case101Progress.reduce((sum, p) => sum + p.discoveries.length, 0) +
    case102Progress.reduce((sum, p) => sum + p.discoveries.length, 0);
  
  const totalXPEarned = 
    case101Progress.reduce((sum, p) => sum + p.xp, 0) +
    case102Progress.reduce((sum, p) => sum + p.xp, 0);
  
  const avgCase101Progress = case101Progress.length > 0 
    ? Math.round((case101Progress.reduce((sum, p) => sum + p.discoveries.length, 0) / (case101Progress.length * 5)) * 100)
    : 0;
    
  const avgCase102Progress = case102Progress.length > 0
    ? Math.round((case102Progress.reduce((sum, p) => sum + p.discoveries.length, 0) / (case102Progress.length * 6)) * 100)
    : 0;

  const stats = [
    { title: 'Total Users', value: totalUsers.toString(), subtitle: 'REGISTERED PLAYERS', icon: '👥' },
    { title: 'Active Players', value: activeUsers.toString(), subtitle: 'CURRENTLY PLAYING', icon: '🎮' },
    { title: 'Cases Solved', value: (totalCase101Completions + totalCase102Completions).toString(), subtitle: 'COMPLETED CASES', icon: '🏆' },
    { title: 'Total XP', value: totalXPEarned.toString(), subtitle: 'EARNED BY PLAYERS', icon: '⚡' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-crime-dark via-crime-medium to-crime-dark">
      
      {/* ===== TWO-COLUMN LAYOUT ===== */}
      <div className="flex">
        
        {/* ===== SIDEBAR ===== */}
        <div className="w-64 bg-crime-dark/90 backdrop-blur-sm min-h-screen border-r border-crime-light/30">
          
          {/* Logo Area */}
          <div className="p-6 border-b border-crime-light/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-crime-light/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🕵️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-crime-glow">CrimeSolver</h1>
                <p className="text-xs text-gray-400">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${activeTab === item.id 
                    ? 'bg-crime-glow text-crime-dark' 
                    : 'text-gray-300 hover:bg-crime-light/20 hover:text-crime-glow'
                  }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
          
          {/* Last Update Info */}
          <div className="absolute bottom-4 left-4 right-4 text-center">
            <p className="text-xs text-gray-500">
              Last Update: {lastUpdate.toLocaleTimeString()}
            </p>
            <p className="text-xs text-green-400 mt-1">🔄 Auto-refresh every 5s</p>
            <button 
              onClick={forceRefresh}
              className="mt-2 text-xs bg-crime-glow/20 hover:bg-crime-glow/40 text-crime-glow px-3 py-1 rounded-full transition"
            >
              Refresh Now
            </button>
          </div>
        </div>

        {/* ===== MAIN CONTENT AREA ===== */}
        <div className="flex-1">
          
          {/* Top Bar */}
          <div className="bg-crime-dark/80 backdrop-blur-sm border-b border-crime-light/30 px-8 py-6 
                        flex justify-between items-center">
            <h2 className="text-3xl font-bold text-crime-soft">
              {activeTab === 'dashboard' && 'Admin Dashboard'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'analytics' && 'Game Analytics'}
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-gray-300">Administrator</span>
              <button 
                onClick={handleLogout}
                className="bg-red-500/80 hover:bg-red-600 text-white px-5 py-2 rounded-lg 
                         transition font-medium"
              >
                Logout
              </button>
            </div>
          </div>

          {/* ===== DYNAMIC CONTENT ===== */}
          <div className="p-8">
            
            {/* ===== 1. DASHBOARD TAB ===== */}
            {activeTab === 'dashboard' && (
              <div>
                {/* Stats Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {stats.map((stat, index) => (
                    <StatCard
                      key={index}
                      title={stat.title}
                      value={stat.value}
                      subtitle={stat.subtitle}
                      icon={stat.icon}
                    />
                  ))}
                </div>

                {/* Case Progress Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Case #101 Progress */}
                  <div className="bg-crime-medium/30 backdrop-blur-sm border border-crime-light/30 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                      <span>🔓</span> Case #101: The Unauthorized Login
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">Average Progress</span>
                          <span className="text-cyan-400 font-bold">{avgCase101Progress}%</span>
                        </div>
                        <div className="w-full bg-crime-dark/50 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full h-2"
                            style={{ width: `${avgCase101Progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-crime-dark/50 p-3 rounded-lg">
                          <span className="text-gray-400 text-xs">Players Started</span>
                          <span className="text-white text-xl font-bold block">{case101Progress.length}</span>
                        </div>
                        <div className="bg-crime-dark/50 p-3 rounded-lg">
                          <span className="text-gray-400 text-xs">Completed</span>
                          <span className="text-white text-xl font-bold block">{totalCase101Completions}</span>
                        </div>
                        <div className="bg-crime-dark/50 p-3 rounded-lg">
                          <span className="text-gray-400 text-xs">Discoveries</span>
                          <span className="text-white text-xl font-bold block">
                            {case101Progress.reduce((sum, p) => sum + p.discoveries.length, 0)}
                          </span>
                        </div>
                        <div className="bg-crime-dark/50 p-3 rounded-lg">
                          <span className="text-gray-400 text-xs">Total XP</span>
                          <span className="text-white text-xl font-bold block">
                            {case101Progress.reduce((sum, p) => sum + p.xp, 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Case #102 Progress */}
                  <div className="bg-crime-medium/30 backdrop-blur-sm border border-crime-light/30 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-orange-400 mb-4 flex items-center gap-2">
                      <span>🎣</span> Case #102: The Phishing Trap
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">Average Progress</span>
                          <span className="text-orange-400 font-bold">{avgCase102Progress}%</span>
                        </div>
                        <div className="w-full bg-crime-dark/50 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-orange-400 to-red-500 rounded-full h-2"
                            style={{ width: `${avgCase102Progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-crime-dark/50 p-3 rounded-lg">
                          <span className="text-gray-400 text-xs">Players Started</span>
                          <span className="text-white text-xl font-bold block">{case102Progress.length}</span>
                        </div>
                        <div className="bg-crime-dark/50 p-3 rounded-lg">
                          <span className="text-gray-400 text-xs">Completed</span>
                          <span className="text-white text-xl font-bold block">{totalCase102Completions}</span>
                        </div>
                        <div className="bg-crime-dark/50 p-3 rounded-lg">
                          <span className="text-gray-400 text-xs">Discoveries</span>
                          <span className="text-white text-xl font-bold block">
                            {case102Progress.reduce((sum, p) => sum + p.discoveries.length, 0)}
                          </span>
                        </div>
                        <div className="bg-crime-dark/50 p-3 rounded-lg">
                          <span className="text-gray-400 text-xs">Total XP</span>
                          <span className="text-white text-xl font-bold block">
                            {case102Progress.reduce((sum, p) => sum + p.xp, 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-crime-medium/30 backdrop-blur-sm border border-crime-light/30 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-crime-soft mb-6 flex items-center gap-2">
                    <span>📋</span> Recent Player Activity
                  </h3>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto">
                    {recentActivities.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">No recent activity</p>
                    ) : (
                      recentActivities.map((activity) => (
                        <ActivityItem
                          key={activity.id}
                          icon={activity.icon}
                          color={activity.color}
                          message={activity.message}
                          time={activity.time}
                          xp={activity.xp}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ===== 2. USER MANAGEMENT TAB ===== */}
            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-crime-soft">User Management</h3>
                    <p className="text-gray-400 mt-1">Monitor player progress and game activity</p>
                  </div>
                  <button 
                    onClick={forceRefresh}
                    disabled={loading}
                    className="bg-crime-glow text-crime-dark px-5 py-2 rounded-lg font-semibold 
                             hover:bg-white transition flex items-center gap-2 disabled:opacity-50"
                  >
                    <span className="text-lg">🔄</span>
                    {loading ? 'Refreshing...' : 'Refresh Data'}
                  </button>
                </div>

                {/* Users Summary */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="bg-crime-light/20 text-crime-glow px-4 py-2 rounded-lg text-sm font-semibold">
                    Total Players: {users.length}
                  </span>
                  <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg text-sm font-semibold">
                    Active: {users.filter(u => u.status === 'active').length}
                  </span>
                  <span className="bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-lg text-sm font-semibold">
                    Cases Solved: {totalCase101Completions + totalCase102Completions}
                  </span>
                  <span className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-lg text-sm font-semibold">
                    Total XP: {totalXPEarned}
                  </span>
                </div>

                {/* Users Table with Progress */}
                <div className="bg-crime-medium/30 backdrop-blur-sm border border-crime-light/30 rounded-xl overflow-hidden">
                  {loading ? (
                    <div className="p-12 text-center">
                      <div className="inline-block w-8 h-8 border-3 border-crime-glow border-t-transparent 
                                    rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-400">Loading users...</p>
                    </div>
                  ) : users.length === 0 ? (
                    <div className="p-12 text-center">
                      <span className="text-5xl mb-4 block">👤</span>
                      <h3 className="text-xl font-bold text-crime-soft mb-2">No Users Found</h3>
                      <p className="text-gray-400">There are no registered users in the database yet.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-crime-dark/50 border-b border-crime-light/30">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-crime-glow">Player</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-crime-glow">Email</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-crime-glow">Join Date</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-crime-glow">Case #101</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-crime-glow">Case #102</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-crime-glow">Total XP</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-crime-glow">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => {
                            const user101 = case101Progress.find(p => p.userId === user._id);
                            const user102 = case102Progress.find(p => p.userId === user._id);
                            const totalXP = (user101?.xp || 0) + (user102?.xp || 0);
                            
                            // Debug log for first user
                            if (user === users[0]) {
                              console.log('User 101 progress:', user101);
                              console.log('User 102 progress:', user102);
                            }
                            
                            return (
                              <tr key={user._id} className="border-b border-crime-light/10 hover:bg-crime-light/5">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-crime-glow to-crime-light 
                                                  rounded-full flex items-center justify-center text-crime-dark 
                                                  font-bold">
                                      {user.fullName?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                      <div className="font-medium text-white">{user.fullName}</div>
                                      <div className="text-xs text-gray-400">ID: {user._id?.slice(-6)}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-gray-300">{user.email}</span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-gray-400 text-sm">
                                    {formatDate(user.createdAt)}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                      <span className={`text-sm font-semibold ${
                                        user101?.discoveries?.length === 5 ? 'text-green-400' : 'text-cyan-400'
                                      }`}>
                                        {user101?.discoveries?.length || 0}/5
                                      </span>
                                      {user101?.completed && (
                                        <span className="text-green-400 text-xs" title={`${user101.accuracy}% accuracy`}>✅</span>
                                      )}
                                    </div>
                                    <div className="w-20 h-1 bg-crime-dark/50 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-cyan-400 rounded-full"
                                        style={{ width: `${((user101?.discoveries?.length || 0) / 5) * 100}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-xs text-yellow-400">
                                      ⚡{user101?.xp || 0} XP
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                      <span className={`text-sm font-semibold ${
                                        user102?.discoveries?.length === 6 ? 'text-green-400' : 'text-orange-400'
                                      }`}>
                                        {user102?.discoveries?.length || 0}/6
                                      </span>
                                      {user102?.completed && (
                                        <span className="text-green-400 text-xs" title={`${user102.accuracy}% accuracy`}>✅</span>
                                      )}
                                    </div>
                                    <div className="w-20 h-1 bg-crime-dark/50 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-orange-400 rounded-full"
                                        style={{ width: `${((user102?.discoveries?.length || 0) / 6) * 100}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-xs text-yellow-400">
                                      ⚡{user102?.xp || 0} XP
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-yellow-400 font-bold text-lg">
                                    {totalXP} XP
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <button 
                                    onClick={() => deleteUser(user._id, user.fullName)}
                                    className="text-red-400 hover:text-red-300 transition px-3 py-1 
                                             rounded-lg hover:bg-red-500/10"
                                    title="Delete User"
                                  >
                                    🗑️ Delete
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ===== 3. ANALYTICS TAB ===== */}
            {activeTab === 'analytics' && (
              <div>
                <h3 className="text-2xl font-bold text-crime-soft mb-6">Game Analytics</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Case #101 Detailed Stats */}
                  <div className="bg-crime-medium/30 backdrop-blur-sm border border-crime-light/30 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                      <span>🔓</span> Case #101: The Unauthorized Login
                    </h4>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-crime-dark/50 p-4 rounded-lg">
                          <span className="text-gray-400 text-sm">Started By</span>
                          <span className="text-white text-2xl font-bold block">{case101Progress.length}</span>
                        </div>
                        <div className="bg-crime-dark/50 p-4 rounded-lg">
                          <span className="text-gray-400 text-sm">Completed</span>
                          <span className="text-white text-2xl font-bold block">{totalCase101Completions}</span>
                        </div>
                        <div className="bg-crime-dark/50 p-4 rounded-lg">
                          <span className="text-gray-400 text-sm">Completion Rate</span>
                          <span className="text-white text-2xl font-bold block">
                            {case101Progress.length > 0 
                              ? Math.round((totalCase101Completions / case101Progress.length) * 100) 
                              : 0}%
                          </span>
                        </div>
                        <div className="bg-crime-dark/50 p-4 rounded-lg">
                          <span className="text-gray-400 text-sm">Avg Accuracy</span>
                          <span className="text-white text-2xl font-bold block">
                            {case101Progress.filter(p => p.completed).length > 0
                              ? Math.round(case101Progress.filter(p => p.completed).reduce((sum, p) => sum + p.accuracy, 0) / case101Progress.filter(p => p.completed).length)
                              : 0}%
                          </span>
                        </div>
                      </div>

                      <h5 className="text-sm font-semibold text-gray-300 mt-4 mb-2">Discovery Breakdown:</h5>
                      {[1,2,3,4,5].map(discoveryId => {
                        const playersWithDiscovery = case101Progress.filter(p => p.discoveries.includes(discoveryId)).length;
                        const percentage = case101Progress.length > 0 
                          ? Math.round((playersWithDiscovery / case101Progress.length) * 100)
                          : 0;
                          
                        const discoveryNames = {
                          1: "3:00 AM Suspicious Login",
                          2: "Attack Pattern Detected",
                          3: "John Was OFF Work",
                          4: "Unauthorized HR Access",
                          5: "Suspicious IP Identified"
                        };
                        
                        return (
                          <div key={discoveryId} className="mb-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-300">{discoveryNames[discoveryId]}</span>
                              <span className="text-cyan-400">{percentage}%</span>
                            </div>
                            <div className="w-full bg-crime-dark/50 rounded-full h-1.5">
                              <div 
                                className="bg-cyan-400 rounded-full h-1.5"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Case #102 Detailed Stats */}
                  <div className="bg-crime-medium/30 backdrop-blur-sm border border-crime-light/30 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-orange-400 mb-4 flex items-center gap-2">
                      <span>🎣</span> Case #102: The Phishing Trap
                    </h4>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-crime-dark/50 p-4 rounded-lg">
                          <span className="text-gray-400 text-sm">Started By</span>
                          <span className="text-white text-2xl font-bold block">{case102Progress.length}</span>
                        </div>
                        <div className="bg-crime-dark/50 p-4 rounded-lg">
                          <span className="text-gray-400 text-sm">Completed</span>
                          <span className="text-white text-2xl font-bold block">{totalCase102Completions}</span>
                        </div>
                        <div className="bg-crime-dark/50 p-4 rounded-lg">
                          <span className="text-gray-400 text-sm">Completion Rate</span>
                          <span className="text-white text-2xl font-bold block">
                            {case102Progress.length > 0 
                              ? Math.round((totalCase102Completions / case102Progress.length) * 100) 
                              : 0}%
                          </span>
                        </div>
                        <div className="bg-crime-dark/50 p-4 rounded-lg">
                          <span className="text-gray-400 text-sm">Avg Accuracy</span>
                          <span className="text-white text-2xl font-bold block">
                            {case102Progress.filter(p => p.completed).length > 0
                              ? Math.round(case102Progress.filter(p => p.completed).reduce((sum, p) => sum + p.accuracy, 0) / case102Progress.filter(p => p.completed).length)
                              : 0}%
                          </span>
                        </div>
                      </div>

                      <h5 className="text-sm font-semibold text-gray-300 mt-4 mb-2">Discovery Breakdown:</h5>
                      {[1,2,3,4,5,6].map(discoveryId => {
                        const playersWithDiscovery = case102Progress.filter(p => p.discoveries.includes(discoveryId)).length;
                        const percentage = case102Progress.length > 0 
                          ? Math.round((playersWithDiscovery / case102Progress.length) * 100)
                          : 0;
                          
                        const discoveryNames = {
                          1: "Phishing Email Found",
                          2: "Victims Identified",
                          3: "Phishing Page Analyzed",
                          4: "Malicious Server Located",
                          5: "Stolen Credentials Found",
                          6: "2FA Saved the Day"
                        };
                        
                        return (
                          <div key={discoveryId} className="mb-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-300">{discoveryNames[discoveryId]}</span>
                              <span className="text-orange-400">{percentage}%</span>
                            </div>
                            <div className="w-full bg-crime-dark/50 rounded-full h-1.5">
                              <div 
                                className="bg-orange-400 rounded-full h-1.5"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Global Stats */}
                  <div className="lg:col-span-2 bg-crime-medium/30 backdrop-blur-sm border border-crime-light/30 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-crime-soft mb-4 flex items-center gap-2">
                      <span>📊</span> Global Statistics
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-crime-dark/50 p-4 rounded-lg">
                        <span className="text-gray-400 text-sm">Total Players</span>
                        <span className="text-white text-2xl font-bold block">{users.length}</span>
                      </div>
                      <div className="bg-crime-dark/50 p-4 rounded-lg">
                        <span className="text-gray-400 text-sm">Total Discoveries</span>
                        <span className="text-white text-2xl font-bold block">{totalDiscoveriesFound}</span>
                      </div>
                      <div className="bg-crime-dark/50 p-4 rounded-lg">
                        <span className="text-gray-400 text-sm">Total Cases Solved</span>
                        <span className="text-white text-2xl font-bold block">
                          {totalCase101Completions + totalCase102Completions}
                        </span>
                      </div>
                      <div className="bg-crime-dark/50 p-4 rounded-lg">
                        <span className="text-gray-400 text-sm">Avg XP per Player</span>
                        <span className="text-white text-2xl font-bold block">
                          {users.length > 0 ? Math.round(totalXPEarned / users.length) : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;