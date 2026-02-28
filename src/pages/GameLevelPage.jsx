import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LevelCard from '../components/Game-level/LevelCard';
import ProfileModal from '../components/Game-level/ProfileModal';
import CaseBriefModal from '../components/Game-level/CaseBriefModal';
import PasswordVerifyModal from '../components/Game-level/PasswordVerifyModal';
import { GameProgressService } from '../services/GameProgressService';
import '../styles/game-level.css';

function GameLevelPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get completion data from navigation state (when returning from case)
  const { levelCompleted, levelId, accuracy, xp, nextLevel } = location.state || {};
  
  // ===== STATE MANAGEMENT =====
  const [userInfo, setUserInfo] = useState({
    _id: '',
    fullName: '',
    email: '',
    joinDate: '',
    username: '',
    bio: '',
    avatar: '',
    casesSolved: 0,
    successRate: 0,
    achievements: 0,
    rank: 'Cadet Detective',
    gameProgress: {
      case101: { discoveries: [], xp: 0, notes: [], completed: false, completedAt: null, accuracy: 0 },
      case102: { discoveries: [], xp: 0, notes: [], completed: false, completedAt: null, accuracy: 0 },
      totalXP: 0,
      level: 1
    }
  });

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCaseBrief, setShowCaseBrief] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [levels, setLevels] = useState([]);
  const [hasInitializedLevel, setHasInitializedLevel] = useState(false);
  const [completionMessage, setCompletionMessage] = useState('');

  // ===== FETCH USER FROM MONGODB =====
  const fetchUserData = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      
      if (!storedUser) {
        console.log('❌ No authenticated user found - redirecting to login');
        navigate('/');
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser._id || parsedUser.id;
      
      if (!userId) {
        console.error('No user ID found');
        navigate('/');
        return;
      }

      console.log('📤 Fetching user data for ID:', userId);
      
      // ===== STEP 1: Fetch user profile from users collection =====
      const userResponse = await fetch(`http://localhost:5000/api/users/${userId}`);
      
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await userResponse.json();
      console.log('✅ User data loaded from MongoDB:', userData);

      // ===== STEP 2: Fetch case progress from MongoDB =====
      let case101Progress = {
        discoveries: [],
        xp: 0,
        notes: [],
        completed: false,
        completedAt: null,
        accuracy: 0
      };
      
      let case102Progress = {
        discoveries: [],
        xp: 0,
        notes: [],
        completed: false,
        completedAt: null,
        accuracy: 0
      };
      
      // Try to fetch from MongoDB first
      try {
        // Fetch Case #101 progress from MongoDB
        const progress101Response = await fetch(`http://localhost:5000/api/level1progresses/notes/${userId}`);
        if (progress101Response.ok) {
          const progressData = await progress101Response.json();
          console.log('📊 Case #101 progress loaded from MongoDB:', progressData);
          
          const discoveries = progressData.discoveries || [];
          case101Progress = {
            discoveries: discoveries,
            xp: progressData.xpEarned || 0,
            notes: progressData.notes || [],
            completed: progressData.status === 'completed' || discoveries.length === 5,
            completedAt: progressData.completedAt || null,
            accuracy: progressData.accuracy || 0
          };
          
          // Update localStorage with MongoDB data
          localStorage.setItem('case101_discoveries', JSON.stringify(discoveries));
          localStorage.setItem('case101_xp', (progressData.xpEarned || 0).toString());
          localStorage.setItem('case101_notes', JSON.stringify(progressData.notes || []));
          if (progressData.accuracy) {
            localStorage.setItem('case101_accuracy', progressData.accuracy.toString());
          }
        } else {
          console.log('⚠️ No MongoDB data for Case #101, checking localStorage');
          // Try localStorage fallback
          const localDiscoveries = localStorage.getItem('case101_discoveries');
          const localXP = localStorage.getItem('case101_xp');
          const localNotes = localStorage.getItem('case101_notes');
          const localAccuracy = localStorage.getItem('case101_accuracy');
          
          if (localDiscoveries) {
            const discoveries = JSON.parse(localDiscoveries);
            case101Progress = {
              discoveries: discoveries,
              xp: localXP ? parseInt(localXP) : 0,
              notes: localNotes ? JSON.parse(localNotes) : [],
              completed: discoveries.length === 5,
              completedAt: null,
              accuracy: localAccuracy ? parseInt(localAccuracy) : 0
            };
          }
        }

        // Fetch Case #102 progress from MongoDB
        const progress102Response = await fetch(`http://localhost:5000/api/level2progresses/notes/${userId}`);
        if (progress102Response.ok) {
          const progressData = await progress102Response.json();
          console.log('📊 Case #102 progress loaded from MongoDB:', progressData);
          
          const discoveries = progressData.discoveries || [];
          case102Progress = {
            discoveries: discoveries,
            xp: progressData.xpEarned || 0,
            notes: progressData.notes || [],
            completed: progressData.status === 'completed' || discoveries.length === 6,
            completedAt: progressData.completedAt || null,
            accuracy: progressData.accuracy || 0
          };
          
          // Update localStorage with MongoDB data
          localStorage.setItem('case102_discoveries', JSON.stringify(discoveries));
          localStorage.setItem('case102_xp', (progressData.xpEarned || 0).toString());
          localStorage.setItem('case102_notes', JSON.stringify(progressData.notes || []));
          if (progressData.accuracy) {
            localStorage.setItem('case102_accuracy', progressData.accuracy.toString());
          }
        } else {
          console.log('⚠️ No MongoDB data for Case #102, checking localStorage');
          // Try localStorage fallback
          const localDiscoveries = localStorage.getItem('case102_discoveries');
          const localXP = localStorage.getItem('case102_xp');
          const localNotes = localStorage.getItem('case102_notes');
          const localAccuracy = localStorage.getItem('case102_accuracy');
          
          if (localDiscoveries) {
            const discoveries = JSON.parse(localDiscoveries);
            case102Progress = {
              discoveries: discoveries,
              xp: localXP ? parseInt(localXP) : 0,
              notes: localNotes ? JSON.parse(localNotes) : [],
              completed: discoveries.length === 6,
              completedAt: null,
              accuracy: localAccuracy ? parseInt(localAccuracy) : 0
            };
          }
        }
      } catch (error) {
        console.error('❌ Error fetching from MongoDB, falling back to localStorage:', error);
        
        // Fall back to localStorage if MongoDB fails
        try {
          const case101Discoveries = localStorage.getItem('case101_discoveries');
          const case101XP = localStorage.getItem('case101_xp');
          const case101Notes = localStorage.getItem('case101_notes');
          const case101Accuracy = localStorage.getItem('case101_accuracy');
          
          if (case101Discoveries) {
            const discoveries = JSON.parse(case101Discoveries);
            case101Progress = {
              discoveries: discoveries,
              xp: case101XP ? parseInt(case101XP) : 0,
              notes: case101Notes ? JSON.parse(case101Notes) : [],
              completed: discoveries.length === 5,
              completedAt: null,
              accuracy: case101Accuracy ? parseInt(case101Accuracy) : 0
            };
          }

          const case102Discoveries = localStorage.getItem('case102_discoveries');
          const case102XP = localStorage.getItem('case102_xp');
          const case102Notes = localStorage.getItem('case102_notes');
          const case102Accuracy = localStorage.getItem('case102_accuracy');
          
          if (case102Discoveries) {
            const discoveries = JSON.parse(case102Discoveries);
            case102Progress = {
              discoveries: discoveries,
              xp: case102XP ? parseInt(case102XP) : 0,
              notes: case102Notes ? JSON.parse(case102Notes) : [],
              completed: discoveries.length === 6,
              completedAt: null,
              accuracy: case102Accuracy ? parseInt(case102Accuracy) : 0
            };
          }
        } catch (e) {
          console.error('Error reading from localStorage:', e);
        }
      }

      // Calculate cases solved based on completed cases
      const casesSolved = (case101Progress.completed ? 1 : 0) + (case102Progress.completed ? 1 : 0);
      
      // Calculate success rate based on cases solved and accuracy
      let successRate = 0;
      if (casesSolved > 0) {
        let totalAccuracy = 0;
        if (case101Progress.completed) totalAccuracy += case101Progress.accuracy || 100;
        if (case102Progress.completed) totalAccuracy += case102Progress.accuracy || 100;
        successRate = Math.round(totalAccuracy / casesSolved);
      }

      const joinDate = userData.createdAt 
        ? new Date(userData.createdAt).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          })
        : new Date().toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          });

      const username = userData.email ? userData.email.split('@')[0] : 'detective';
      const bio = userData.bio || `Passionate detective solving mysteries and uncovering truth. Member since ${joinDate}.`;

      // ===== STEP 3: Combine user data with case progress =====
      setUserInfo(prev => ({
        ...prev,
        _id: userData._id,
        fullName: userData.fullName || 'Detective',
        email: userData.email || 'detective@crimesolver.com',
        joinDate: joinDate,
        username: username,
        bio: bio,
        avatar: userData.avatar || '',
        rank: userData.rank || 'Cadet Detective',
        casesSolved: casesSolved,
        successRate: successRate,
        achievements: userData.achievements || 0,
        gameProgress: {
          case101: case101Progress,
          case102: case102Progress,
          totalXP: (case101Progress.xp || 0) + (case102Progress.xp || 0),
          level: Math.floor(((case101Progress.xp || 0) + (case102Progress.xp || 0)) / 100) + 1
        }
      }));

      setIsAuthenticated(true);
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching user data:', error);
      navigate('/');
    }
  };

  // ===== LOAD FROM LOCALSTORAGE =====
  const loadFromLocalStorage = () => {
    console.log('🔄 Loading progress from localStorage');
    
    try {
      // Get Case #101 progress
      const case101Discoveries = localStorage.getItem('case101_discoveries');
      const case101XP = localStorage.getItem('case101_xp');
      const case101Notes = localStorage.getItem('case101_notes');
      const case101Accuracy = localStorage.getItem('case101_accuracy');
      
      let case101DiscoveriesArray = case101Discoveries ? JSON.parse(case101Discoveries) : [];
      let case101NotesArray = case101Notes ? JSON.parse(case101Notes) : [];
      let case101XPValue = case101XP ? parseInt(case101XP) : 0;
      let case101Completed = case101DiscoveriesArray.length === 5;
      
      // Get Case #102 progress
      const case102Discoveries = localStorage.getItem('case102_discoveries');
      const case102XP = localStorage.getItem('case102_xp');
      const case102Notes = localStorage.getItem('case102_notes');
      const case102Accuracy = localStorage.getItem('case102_accuracy');
      
      let case102DiscoveriesArray = case102Discoveries ? JSON.parse(case102Discoveries) : [];
      let case102NotesArray = case102Notes ? JSON.parse(case102Notes) : [];
      let case102XPValue = case102XP ? parseInt(case102XP) : 0;
      let case102Completed = case102DiscoveriesArray.length === 6;
      
      // Calculate cases solved
      const casesSolved = (case101Completed ? 1 : 0) + (case102Completed ? 1 : 0);
      
      // Calculate success rate
      let successRate = 0;
      if (casesSolved > 0) {
        let totalAccuracy = 0;
        if (case101Completed && case101Accuracy) totalAccuracy += parseInt(case101Accuracy);
        if (case102Completed && case102Accuracy) totalAccuracy += parseInt(case102Accuracy);
        if (totalAccuracy > 0) successRate = Math.round(totalAccuracy / casesSolved);
      }
      
      // Update state with ALL data including notes
      setUserInfo(prev => {
        const newTotalXP = case101XPValue + case102XPValue;
        
        return {
          ...prev,
          casesSolved: casesSolved,
          successRate: successRate,
          gameProgress: {
            case101: {
              ...prev.gameProgress.case101,
              discoveries: case101DiscoveriesArray,
              xp: case101XPValue,
              notes: case101NotesArray,
              completed: case101Completed,
              accuracy: case101Accuracy ? parseInt(case101Accuracy) : 0
            },
            case102: {
              ...prev.gameProgress.case102,
              discoveries: case102DiscoveriesArray,
              xp: case102XPValue,
              notes: case102NotesArray,
              completed: case102Completed,
              accuracy: case102Accuracy ? parseInt(case102Accuracy) : 0
            },
            totalXP: newTotalXP,
            level: Math.floor(newTotalXP / 100) + 1
          }
        };
      });
      
      console.log('✅ Loaded from localStorage:', {
        case101: {
          discoveries: case101DiscoveriesArray.length,
          notes: case101NotesArray.length,
          xp: case101XPValue
        },
        case102: {
          discoveries: case102DiscoveriesArray.length,
          notes: case102NotesArray.length,
          xp: case102XPValue
        },
        casesSolved: casesSolved
      });
    } catch (e) {
      console.error('Error loading from localStorage:', e);
    }
  };

  // ===== LISTEN FOR CASE NOTES UPDATES =====
  useEffect(() => {
    const handleCaseNotesUpdate = (event) => {
      console.log('📢 Case notes updated event received:', event.detail);
      const { caseId, notes, discoveries, xp } = event.detail;
      
      if (caseId === '101' || caseId === '102') {
        const caseKey = caseId === '101' ? 'case101' : 'case102';
        
        setUserInfo(prev => {
          // Update localStorage with new data
          localStorage.setItem(`case${caseId}_notes`, JSON.stringify(notes || []));
          localStorage.setItem(`case${caseId}_discoveries`, JSON.stringify(discoveries || []));
          localStorage.setItem(`case${caseId}_xp`, (xp || 0).toString());
          
          const updatedCase = {
            ...prev.gameProgress[caseKey],
            notes: notes || prev.gameProgress[caseKey].notes,
            discoveries: discoveries || prev.gameProgress[caseKey].discoveries,
            xp: xp || prev.gameProgress[caseKey].xp,
            completed: (discoveries?.length === (caseId === '101' ? 5 : 6))
          };
          
          const newTotalXP = (caseId === '101' ? xp : prev.gameProgress.case101.xp) + 
                            (caseId === '102' ? xp : prev.gameProgress.case102.xp);
          
          return {
            ...prev,
            gameProgress: {
              ...prev.gameProgress,
              [caseKey]: updatedCase,
              totalXP: newTotalXP,
              level: Math.floor(newTotalXP / 100) + 1
            }
          };
        });
      }
    };

    window.addEventListener('case-notes-updated', handleCaseNotesUpdate);
    
    return () => {
      window.removeEventListener('case-notes-updated', handleCaseNotesUpdate);
    };
  }, []);

  // Load user data when page loads
  useEffect(() => {
    fetchUserData();
  }, []);

  // ===== LISTEN FOR PAGE FOCUS AND STORAGE CHANGES =====
  useEffect(() => {
    // Load when page is focused/refreshed
    const handleFocus = () => {
      console.log('👁️ Page focused - reloading progress');
      loadFromLocalStorage();
    };

    // Listen for storage changes (when localStorage is updated)
    const handleStorageChange = (e) => {
      console.log('💾 Storage changed:', e.key);
      if (e.key && (e.key.includes('case101') || e.key.includes('case102') || e.key.includes('accuracy'))) {
        loadFromLocalStorage();
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // ===== FIXED: CHECK FOR COMPLETED CASE FROM NAVIGATION =====
  useEffect(() => {
    const updateUserProgress = async () => {
      if (levelCompleted && userInfo._id) {
        console.log(`🎯 Case #${levelId} completed! Updating user progress...`);
        console.log(`Accuracy: ${accuracy}%, XP Earned: ${xp}`);
        
        // Determine case number string
        const caseNumber = levelId === 1 ? '101' : '102';
        const collection = levelId === 1 ? 'level1progresses' : 'level2progresses';
        const requiredDiscoveries = levelId === 1 ? 5 : 6;
        
        // ===== FETCH THE LATEST CASE PROGRESS FROM MONGODB =====
        let discoveriesCount = 0;
        let notes = [];
        let currentDiscoveries = [];
        
        try {
          const progressResponse = await fetch(`http://localhost:5000/api/${collection}/notes/${userInfo._id}`);
          if (progressResponse.ok) {
            const progressData = await progressResponse.json();
            currentDiscoveries = progressData.discoveries || [];
            discoveriesCount = currentDiscoveries.length;
            notes = progressData.notes || [];
            console.log(`📊 Discoveries found for Case #${caseNumber}:`, discoveriesCount);
          }
        } catch (error) {
          console.error('❌ Error fetching case progress:', error);
        }
        
        // ===== UPDATE USER IN MONGODB =====
        try {
          // Update user profile with stats - preserve completed status
          const userResponse = await fetch(`http://localhost:5000/api/users/${userInfo._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              casesSolved: userInfo.casesSolved + 1,
              successRate: Math.round(((userInfo.successRate * userInfo.casesSolved) + accuracy) / (userInfo.casesSolved + 1)),
              gameProgress: {
                ...userInfo.gameProgress,
                [`case${caseNumber}`]: {
                  discoveries: currentDiscoveries,
                  xp: xp,
                  notes: notes,
                  completed: true,
                  completedAt: new Date().toISOString(),
                  accuracy: accuracy
                },
                totalXP: (userInfo.gameProgress.totalXP || 0) + xp,
                level: Math.floor(((userInfo.gameProgress.totalXP || 0) + xp) / 100) + 1
              }
            })
          });
          
          // Also update the progress collection with completed status
          await fetch(`http://localhost:5000/api/${collection}/sync-state`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: userInfo._id,
              notes: notes,
              discoveries: currentDiscoveries,
              xpEarned: xp,
              status: 'completed',
              completedAt: new Date().toISOString(),
              accuracy: accuracy
            })
          });
          
          if (userResponse.ok) {
            const updatedUser = await userResponse.json();
            console.log('✅ User progress updated:', updatedUser);
            
            // Update localStorage with accuracy and completed status
            localStorage.setItem(`case${caseNumber}_accuracy`, accuracy.toString());
            localStorage.setItem(`case${caseNumber}_completed`, 'true');
            
            // Update local state
            setUserInfo(prev => ({
              ...prev,
              casesSolved: prev.casesSolved + 1,
              successRate: Math.round(((prev.successRate * prev.casesSolved) + accuracy) / (prev.casesSolved + 1)),
              gameProgress: {
                ...prev.gameProgress,
                [`case${caseNumber}`]: {
                  discoveries: currentDiscoveries,
                  xp: xp,
                  notes: notes,
                  completed: true,
                  completedAt: new Date().toISOString(),
                  accuracy: accuracy
                },
                totalXP: (prev.gameProgress.totalXP || 0) + xp,
                level: Math.floor(((prev.gameProgress.totalXP || 0) + xp) / 100) + 1
              }
            }));
            
            // Update localStorage user object
            const storedUser = JSON.parse(localStorage.getItem('user'));
            storedUser.casesSolved = storedUser.casesSolved + 1;
            storedUser.successRate = Math.round(((storedUser.successRate * storedUser.casesSolved) + accuracy) / (storedUser.casesSolved + 1));
            storedUser.gameProgress = {
              ...storedUser.gameProgress,
              [`case${caseNumber}`]: {
                discoveries: currentDiscoveries,
                xp: xp,
                notes: notes,
                completed: true,
                completedAt: new Date().toISOString(),
                accuracy: accuracy
              },
              totalXP: (storedUser.gameProgress.totalXP || 0) + xp,
              level: Math.floor(((storedUser.gameProgress.totalXP || 0) + xp) / 100) + 1
            };
            localStorage.setItem('user', JSON.stringify(storedUser));
            
            setCompletionMessage(`🎉 Case #${caseNumber} solved with ${accuracy}% accuracy! +${xp} XP`);
            
            // Clear the navigation state to prevent re-processing
            window.history.replaceState({}, document.title);
          }
        } catch (error) {
          console.error('❌ Error updating user progress:', error);
        }
      }
    };
    
    updateUserProgress();
  }, [levelCompleted, levelId, userInfo._id]); // Only run when these change

  // ===== CASE LEVELS DATA =====
  const baseLevels = [
    {
      id: 1,
      levelNumber: '#101',
      title: 'The Unauthorized Login',
      difficulty: 'BEGINNER',
      difficultyColor: 'cyan',
      icon: '🔓',
      description: 'A marketing employee\'s account was used at 3 AM to access HR data. He claims he was asleep. Is he lying or was he hacked?',
      features: [
        'Find the unauthorized login',
        'Identify the attacker\'s IP',
        'Determine how they got in',
        'Verify John\'s alibi',
        'Find why John was targeted'
      ],
      tagline: 'Was it an inside job or a cyber attack?',
      route: '/os-boot',
      totalDiscoveries: 5,
      brief: {
        from: 'IT Security Department',
        to: 'Detective',
        date: 'March 16, 2024',
        message: 'This morning, HR noticed something strange. At 3:00 AM, someone accessed employee salary records using John Doe\'s account.\n\nJohn is a marketing manager. He swears he was asleep at 3 AM. His wife confirms he was home. But the system shows his account was used.',
        victim: 'John Doe, Marketing Manager',
        incident: '3:00 AM, March 16, 2024',
        stakes: '$5M in fines, 500+ employees affected'
      }
    },
    {
      id: 2,
      levelNumber: '#102',
      title: 'The Phishing Trap',
      difficulty: 'BEGINNER',
      difficultyColor: 'cyan',
      icon: '🎣',
      description: 'Yesterday, 15 employees received a suspicious email about password expiry. Three clicked the link. Now their accounts show unusual activity.',
      features: [
        'Find the phishing email in logs',
        'Extract the malicious link',
        'Identify which employees fell for it',
        'Trace where credentials were sent',
        'Verify if stolen credentials were used',
        'Check if 2FA stopped the attack'
      ],
      tagline: 'One click. Three victims. Zero breach.',
      route: '/os-boot',
      totalDiscoveries: 6,
      brief: {
        from: 'IT Security Department',
        to: 'Detective',
        date: 'March 20, 2024',
        message: 'Yesterday, 15 employees received this email:\n\nFROM: IT-Support@company-reset.com\nSUBJECT: URGENT: Password Expiry Notification\n\nYour password will expire in 24 hours. Click here to keep your current password.\n\nThree employees clicked the link and entered their passwords. Within hours, their accounts showed suspicious activity.\n\nYOUR TASK: Find out what happened, identify the phishing site, and determine what data was stolen.',
        victim: 'Sarah (HR), Mike (Sales), Lisa (Finance)',
        incident: 'Yesterday, 2:30 PM - 3:45 PM',
        stakes: 'Employee credentials stolen, company data at risk'
      }
    },
    {
      id: 3,
      levelNumber: '#103',
      title: 'Digital Shadows',
      difficulty: 'INTERMEDIATE',
      difficultyColor: 'orange',
      icon: '💻',
      description: 'Investigate cyber intrusions, decrypt corrupted data, and track digital movements through forensic tools.',
      features: [
        'Deep system evidence analysis',
        'Network and activity tracing',
        'Encrypted data recovery'
      ],
      tagline: 'The shadows hide answers – uncover them.',
      route: '/game-level/3',
      totalDiscoveries: 0,
      brief: {
        from: 'Cyber Crime Unit',
        to: 'Detective',
        date: 'March 25, 2024',
        message: 'A sophisticated attacker has breached our systems. We need you to trace their movements and identify how they got in.',
        victim: 'Government Network',
        incident: 'Ongoing Breach',
        stakes: 'National security'
      }
    }
  ];

  // Update levels with progress data
  useEffect(() => {
    if (userInfo.gameProgress) {
      const updatedLevels = baseLevels.map(level => {
        if (level.levelNumber === '#101') {
          return {
            ...level,
            progress: userInfo.gameProgress.case101
          };
        } else if (level.levelNumber === '#102') {
          return {
            ...level,
            progress: userInfo.gameProgress.case102
          };
        }
        return level;
      });
      setLevels(updatedLevels);
    } else {
      setLevels(baseLevels);
    }
  }, [userInfo.gameProgress]);

  // ===== FIXED: CREATE EMPTY LEVEL PROGRESS - But only for incomplete cases =====
  const createLevelProgress = async (userId, levelNumber) => {
    try {
      console.log(`📤 Creating Level ${levelNumber} progress for user:`, userId);
      
      const endpoint = levelNumber === '101' ? 'level1progresses' : 'level2progresses';
      const response = await fetch(`http://localhost:5000/api/${endpoint}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ Level ${levelNumber} progress created:`, data);
        return data.progress;
      } else {
        console.error(`❌ Failed to create level ${levelNumber} progress:`, data.message);
        return null;
      }
    } catch (error) {
      console.error(`❌ Error creating level ${levelNumber} progress:`, error);
      return null;
    }
  };

  // ===== FIXED: CHECK AND RESET COMPLETED LEVEL - Only reset if user chooses to restart =====
  const checkAndResetCompletedLevel = async (userId, levelNumber) => {
    try {
      const endpoint = levelNumber === '101' ? 'level1progresses' : 'level2progresses';
      const response = await fetch(`http://localhost:5000/api/${endpoint}/progress/${userId}`);
      const data = await response.json();
      
      // Don't automatically reset completed cases
      if (data.progress && data.progress.status === 'completed') {
        console.log(`📌 Level ${levelNumber} is already completed. Not resetting.`);
        return false;
      }
      return false;
    } catch (error) {
      console.error(`❌ Error checking level ${levelNumber} completion:`, error);
      return false;
    }
  };

  // ===== FIXED: INITIALIZE LEVELS - Don't reset completed cases =====
  useEffect(() => {
    const initializeLevels = async () => {
      if (userInfo._id && !hasInitializedLevel) {
        console.log('🎮 Initializing levels for user:', userInfo._id);
        
        // Check if cases are already completed
        const case101Completed = userInfo.gameProgress?.case101?.completed;
        const case102Completed = userInfo.gameProgress?.case102?.completed;
        
        // Only create progress for incomplete cases
        if (!case101Completed) {
          await createLevelProgress(userInfo._id, '101');
        } else {
          console.log('✅ Case #101 already completed, skipping initialization');
        }
        
        if (!case102Completed) {
          await createLevelProgress(userInfo._id, '102');
        } else {
          console.log('✅ Case #102 already completed, skipping initialization');
        }
        
        setHasInitializedLevel(true);
      }
    };

    initializeLevels();
  }, [userInfo._id, hasInitializedLevel, userInfo.gameProgress]);

  // ===== ACTUAL LOGOUT =====
  const handleActualLogout = () => {
    console.log('🔴 ACTUAL LOGOUT - Clearing user session');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/');
  };

  // ===== UPDATE USER PROFILE =====
  const updateUserProfile = async (updatedData) => {
    try {
      console.log('📤 Updating user profile:', updatedData);
      
      const response = await fetch(`http://localhost:5000/api/users/${userInfo._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const data = await response.json();
      console.log('✅ User updated successfully:', data);

      setUserInfo(prev => ({
        ...prev,
        ...updatedData
      }));

      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        localStorage.setItem('user', JSON.stringify({
          ...parsedUser,
          ...updatedData
        }));
      }

      alert('✅ Profile updated successfully!');
    } catch (error) {
      console.error('❌ Error updating user:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleStartCase = (level) => {
    setSelectedCase(level);
    setShowCaseBrief(true);
  };

  // ===== FIXED: handleConfirmStart - Properly passes caseId =====
  const handleConfirmStart = () => {
    setShowCaseBrief(false);
    
    if (selectedCase) {
      // Extract the numeric case ID from levelNumber (e.g., '#101' -> '101')
      const caseId = selectedCase.levelNumber.replace('#', '');
      
      console.log(`🎮 Starting case #${caseId} for user: ${userInfo._id}`);
      console.log(`🎮 Selected case:`, selectedCase);
      
      // Check if case is already completed
      const isCompleted = caseId === '101' 
        ? userInfo.gameProgress?.case101?.completed 
        : userInfo.gameProgress?.case102?.completed;
      
      if (isCompleted) {
        // If completed, ask if they want to restart
        if (window.confirm(`Case #${caseId} is already completed. Do you want to restart it?`)) {
          // Reset the case
          const collection = caseId === '101' ? 'level1progresses' : 'level2progresses';
          
          fetch(`http://localhost:5000/api/${collection}/reset-complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userInfo._id })
          }).then(() => {
            // Clear localStorage for this case
            localStorage.removeItem(`case${caseId}_notes`);
            localStorage.removeItem(`case${caseId}_discoveries`);
            localStorage.removeItem(`case${caseId}_xp`);
            localStorage.removeItem(`case${caseId}_completed`);
            localStorage.removeItem(`case${caseId}_accuracy`);
            
            // Navigate to the case
            if (caseId === '101') {
              setShowPasswordModal(true);
            } else {
              navigate('/os-boot', {
                state: {
                  userId: userInfo._id,
                  userEmail: userInfo.email,
                  caseId: caseId,
                  levelProgress: null
                }
              });
            }
          });
        }
      } else {
        // Not completed, proceed normally
        if (caseId === '101') {
          setShowPasswordModal(true);
        } else {
          navigate('/os-boot', {
            state: {
              userId: userInfo._id,
              userEmail: userInfo.email,
              caseId: caseId,
              levelProgress: null
            }
          });
        }
      }
    }
  };

  // ===== FIXED: handlePasswordSuccess - Properly passes caseId =====
  const handlePasswordSuccess = async () => {
    console.log('✅ Password verified, preparing to start case...');
    
    if (selectedCase) {
      const caseId = selectedCase.levelNumber.replace('#', '');
      
      console.log(`🎮 Starting case #${caseId} after password verification`);
      
      // Navigate to OS Boot with case ID
      navigate('/os-boot', {
        state: {
          userId: userInfo._id,
          userEmail: userInfo.email,
          caseId: caseId,
          levelProgress: {
            discoveries: [],
            xp: 0,
            notes: [],
            completed: false
          }
        }
      });
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (userInfo.fullName) {
      return userInfo.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
    return 'DT';
  };

  // Get avatar display
  const getAvatarDisplay = () => {
    if (userInfo.avatar) {
      return <img src={userInfo.avatar} alt={userInfo.fullName} className="profile-avatar-image" />;
    }
    return <span className="profile-avatar-initials">{getUserInitials()}</span>;
  };

  // Get display name
  const getDisplayName = () => {
    return userInfo.username || userInfo.fullName?.split(' ')[0] || 'Detective';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-container')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  if (loading) {
    return (
      <div className="game-level-container">
        <div className="game-level-background"></div>
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="game-level-container">
      
      {/* ===== BACKGROUND ===== */}
      <div className="game-level-background"></div>
      
      {/* ===== COMPLETION MESSAGE ===== */}
      {completionMessage && (
        <div className="completion-message">
          <div className="completion-content">
            <span className="completion-icon">🎉</span>
            <span className="completion-text">{completionMessage}</span>
            <button className="completion-close" onClick={() => setCompletionMessage('')}>×</button>
          </div>
        </div>
      )}
      
      {/* ===== HEADER WITH PROFILE ===== */}
      <header className="game-level-header">
        <div className="header-content">
          {/* Logo Area */}
          <div className="logo-area">
            <div className="logo-icon">🕵️</div>
            <h1>CRIME SOLVER OS</h1>
          </div>
          
          {/* Profile Section */}
          <div className="profile-section">
            <div className="profile-container">
              <button 
                className="profile-button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="profile-avatar">
                  {getAvatarDisplay()}
                </div>
                <div className="profile-info">
                  <span className="profile-name">{getDisplayName()}</span>
                  <span className="profile-rank">{userInfo.rank}</span>
                </div>
                <span className="profile-arrow">{showProfileMenu ? '▲' : '▼'}</span>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="profile-dropdown">
                  
                  <div className="dropdown-cover">
                    <div className="cover-gradient"></div>
                  </div>
                  
                  <div className="dropdown-avatar-large">
                    <div className="avatar-wrapper">
                      {userInfo.avatar ? (
                        <img src={userInfo.avatar} alt={userInfo.fullName} className="avatar-image" />
                      ) : (
                        <div className="avatar-initials">{getUserInitials()}</div>
                      )}
                      <div className="avatar-status"></div>
                    </div>
                  </div>
                  
                  <div className="dropdown-user-info">
                    <h3>{userInfo.fullName}</h3>
                    <div className="user-badges">
                      <span className="badge-rank">🏆 {userInfo.rank}</span>
                      <span className="badge-level">⭐ Level {Math.floor((userInfo.gameProgress?.totalXP || 0) / 100) + 1}</span>
                    </div>
                    <p className="user-email">{userInfo.email}</p>
                    
                    <div className="user-bio">
                      <p>{userInfo.bio}</p>
                    </div>
                    
                    <div className="user-join">
                      <span className="join-icon">📅</span>
                      <span className="join-text">Member since {userInfo.joinDate}</span>
                    </div>
                  </div>
                  
                  <div className="dropdown-stats-grid">
                    <div className="stat-card">
                      <span className="stat-value">{userInfo.casesSolved}</span>
                      <span className="stat-label">Cases Solved</span>
                    </div>
                    <div className="stat-card">
                      <span className="stat-value">{userInfo.successRate}%</span>
                      <span className="stat-label">Success Rate</span>
                    </div>
                    <div className="stat-card">
                      <span className="stat-value">{userInfo.achievements}</span>
                      <span className="stat-label">Achievements</span>
                    </div>
                  </div>
                  
                  <div className="dropdown-menu-items">
                    <button 
                      className="dropdown-item"
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowProfileModal(true);
                      }}
                    >
                      <span className="item-icon">✏️</span>
                      <div className="item-content">
                        <span className="item-title">Edit Profile</span>
                        <span className="item-desc">Change your bio, avatar, and rank</span>
                      </div>
                      <span className="item-arrow">→</span>
                    </button>
                    
                    <button className="dropdown-item" onClick={() => alert('📊 Statistics coming soon!')}>
                      <span className="item-icon">📊</span>
                      <div className="item-content">
                        <span className="item-title">Statistics</span>
                        <span className="item-desc">View your case history</span>
                      </div>
                      <span className="item-arrow">→</span>
                    </button>
                    
                    <button className="dropdown-item" onClick={() => alert('🏆 Achievements coming soon!')}>
                      <span className="item-icon">🏆</span>
                      <div className="item-content">
                        <span className="item-title">Achievements</span>
                        <span className="item-desc">View your earned badges</span>
                      </div>
                      <span className="item-arrow">→</span>
                    </button>
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  <button className="dropdown-logout" onClick={handleActualLogout}>
                    <span className="item-icon">🔒</span>
                    <div className="item-content">
                      <span className="item-title">Sign Out</span>
                      <span className="item-desc">Logout from your account</span>
                    </div>
                    <span className="item-arrow">→</span>
                  </button>
                  
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="game-level-main">
        
        <div className="welcome-banner">
          <div className="banner-content">
            <h2>Welcome back, <span className="highlight">{getDisplayName()}</span>!</h2>
            <p>Your next mystery awaits. Review the case brief and begin your investigation.</p>
          </div>
          <div className="banner-stats">
            <div className="banner-stat">
              <span className="stat-label">Current Streak</span>
              <span className="stat-value">7 days</span>
            </div>
            <div className="banner-stat">
              <span className="stat-label">Total XP</span>
              <span className="stat-value">{userInfo.gameProgress?.totalXP || 0}</span>
            </div>
          </div>
        </div>

        <section className="levels-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">📋</span>
              ACTIVE CASES
            </h2>
            <span className="section-count">{levels.length} cases</span>
          </div>
          <div className="levels-grid">
            {levels.map(level => (
              <LevelCard 
                key={level.id} 
                level={level} 
                onStartCase={handleStartCase}
              />
            ))}
          </div>
        </section>

        <section className="quick-stats">
          <h3 className="stats-title">Your Investigation Stats</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-details">
                <span className="stat-value">{userInfo.casesSolved}</span>
                <span className="stat-label">Cases Solved</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <div className="stat-details">
                <span className="stat-value">
                  {(userInfo.gameProgress?.case101?.completed ? 1 : 0) + 
                   (userInfo.gameProgress?.case102?.completed ? 1 : 0)}
                </span>
                <span className="stat-label">Completed</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏅</div>
              <div className="stat-details">
                <span className="stat-value">{userInfo.successRate}%</span>
                <span className="stat-label">Success Rate</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔍</div>
              <div className="stat-details">
                <span className="stat-value">
                  {(userInfo.gameProgress?.case101?.discoveries?.length || 0) + 
                   (userInfo.gameProgress?.case102?.discoveries?.length || 0)}
                </span>
                <span className="stat-label">Clues Found</span>
              </div>
            </div>
          </div>

          {/* Case Progress Summary */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Case #101 Progress */}
            {userInfo.gameProgress?.case101 && (
              <div className="p-4 bg-[#1a1d3a] border border-cyan-500/30 rounded-lg">
                <h4 className="text-cyan-400 font-semibold mb-2">Case #101 Progress</h4>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="w-full h-2 bg-[#0a0a1a] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${((userInfo.gameProgress.case101.discoveries?.length || 0) / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-white text-sm">
                    {userInfo.gameProgress.case101.discoveries?.length || 0}/5
                  </span>
                  <span className="text-yellow-400 text-sm">
                    ⚡{userInfo.gameProgress.case101.xp || 0} XP
                  </span>
                  {userInfo.gameProgress.case101.completed && (
                    <span className="text-green-400 text-sm">✅</span>
                  )}
                </div>
              </div>
            )}

            {/* Case #102 Progress */}
            {userInfo.gameProgress?.case102 && (
              <div className="p-4 bg-[#1a1d3a] border border-orange-500/30 rounded-lg">
                <h4 className="text-orange-400 font-semibold mb-2">Case #102 Progress</h4>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="w-full h-2 bg-[#0a0a1a] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-500"
                        style={{ width: `${((userInfo.gameProgress.case102.discoveries?.length || 0) / 6) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-white text-sm">
                    {userInfo.gameProgress.case102.discoveries?.length || 0}/6
                  </span>
                  <span className="text-yellow-400 text-sm">
                    ⚡{userInfo.gameProgress.case102.xp || 0} XP
                  </span>
                  {userInfo.gameProgress.case102.completed && (
                    <span className="text-green-400 text-sm">✅</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Case Brief Modal */}
      <CaseBriefModal 
        isOpen={showCaseBrief}
        onClose={() => setShowCaseBrief(false)}
        onConfirm={handleConfirmStart}
        caseData={selectedCase}
      />

      {/* Password Verification Modal */}
      <PasswordVerifyModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={handlePasswordSuccess}
        user={userInfo}
      />

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userInfo={userInfo}
        onUpdate={updateUserProfile}
      />
    </div>
  );
}

export default GameLevelPage;