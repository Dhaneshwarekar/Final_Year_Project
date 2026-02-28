// CaseNotes.jsx - Complete fixed version with NO DUPLICATES

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  X, Minus, Square, Plus, Save, 
  Paperclip, Search, Send, Download,
  Clock, User, FolderOpen, AlertCircle,
  Award, Zap, CheckCircle, Copy, FileText,
  RotateCcw
} from 'lucide-react';
import NoteCard from './NoteCard';
import NoteEditor from './NoteEditor';
import CaseInfoBar from './CaseInfoBar';
import ConclusionModal from './ConclusionModal';
import { getDiscoveriesByCase, getTitleToIdMap, getCaseConfig, getStorageKeys } from './caseData';
import './CaseNotes.css';

const CaseNotes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get user data and case ID from navigation state
  const { userId, caseId: initialCaseId, levelProgress: initialProgress } = location.state || {};
  
  // ===== CASE CONFIGURATION =====
  const caseNumber = initialCaseId ? initialCaseId.replace('#', '') : '101';
  const caseId = `#${caseNumber}`;
  const caseConfig = getCaseConfig(caseNumber);
  const storageKeys = getStorageKeys(caseNumber);
  
  console.log(`📋 Case Notes loaded for Case ${caseId} - ${caseConfig.title}`);
  
  // Get case-specific data
  const discoveriesData = getDiscoveriesByCase(caseNumber);
  const titleToIdMap = getTitleToIdMap(caseNumber);
  
  const [notes, setNotes] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [showConclusionModal, setShowConclusionModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [caseResult, setCaseResult] = useState(null);
  
  const [discoveries, setDiscoveries] = useState([]);
  const [totalXP, setTotalXP] = useState(0);
  
  // ===== MongoDB Connection State =====
  const [mongoXP, setMongoXP] = useState(0);
  const [playerMessage, setPlayerMessage] = useState("Player currently not find anything");
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState('synced');
  const [mongoNotesCount, setMongoNotesCount] = useState(0);
  
  // ===== Evidence Collection State =====
  const [evidenceData, setEvidenceData] = useState(null);
  const [verificationLoading, setVerificationLoading] = useState(false);
  
  const requiredDiscoveries = caseConfig.requiredDiscoveries;

  // ===== TRACK PROCESSED NOTES TO PREVENT DUPLICATES =====
  const processedNoteIds = useRef(new Set());
  const hasProcessedNavigation = useRef(false);

  // ===========================================
  // Use correct collection name with 'es'
  // ===========================================
  const getCollectionName = () => {
    return caseNumber === '101' ? 'level1progresses' : 'level2progresses';
  };

  // ===========================================
  // ===== FIXED: HANDLE INCOMING NOTE FROM LOG VIEWER - ONCE ONLY =====
  // ===========================================
  useEffect(() => {
    // Only process navigation state once
    if (hasProcessedNavigation.current) return;
    
    const { newNote, discoveryId, xpEarned, isNewDiscovery } = location.state || {};
    
    if (newNote) {
      console.log('📥 Received new note from Log Viewer:', { newNote, discoveryId, xpEarned, isNewDiscovery });
      
      // Mark as processed immediately to prevent duplicates
      hasProcessedNavigation.current = true;
      
      // Check if this note already exists in the list using multiple checks
      const noteExists = notes.some(n => 
        n.id === newNote.id || 
        (n.title === newNote.title && n.content === newNote.content && n.timestamp === newNote.timestamp)
      );
      
      // Check if we've already processed this note ID
      if (processedNoteIds.current.has(newNote.id) || noteExists) {
        console.log('⚠️ Note already processed or exists, skipping duplicate');
        
        // Clear navigation state
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }
      
      // Mark this note ID as processed
      processedNoteIds.current.add(newNote.id);
      
      // Add the note to state and localStorage
      const updatedNotes = [newNote, ...notes];
      setNotes(updatedNotes);
      localStorage.setItem(storageKeys.notes, JSON.stringify(updatedNotes));
      
      // If this is a new discovery, update discoveries and XP
      if (isNewDiscovery && discoveryId) {
        // Check if discovery already exists (prevent duplicates)
        if (!discoveries.includes(discoveryId)) {
          const updatedDiscoveries = [...discoveries, discoveryId];
          const updatedXP = totalXP + (xpEarned || 0);
          
          setDiscoveries(updatedDiscoveries);
          setTotalXP(updatedXP);
          
          localStorage.setItem(storageKeys.discoveries, JSON.stringify(updatedDiscoveries));
          localStorage.setItem(storageKeys.xp, updatedXP.toString());
          
          // Save to MongoDB - ONLY ONCE
          if (userId && userId !== 'admin') {
            addNoteToMongoDB(newNote, discoveryId, xpEarned);
          }
        } else {
          console.log('⚠️ Discovery already exists, saving note only');
          // Save note without discovery (already found)
          if (userId && userId !== 'admin') {
            addNoteToMongoDB(newNote, null, 0);
          }
        }
      } else {
        // Just save the note without discovery
        if (userId && userId !== 'admin') {
          addNoteToMongoDB(newNote, null, 0);
        }
      }
      
      // Clear the navigation state to prevent re-adding on refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location.state]); // This runs when component receives navigation state

  // ===========================================
  // TEST CONNECTION FUNCTION
  // ===========================================
  const testConnection = async () => {
    try {
      console.log('🔍 Testing server connection...');
      const response = await fetch('http://localhost:5000/api/test');
      const data = await response.json();
      console.log('✅ Server test:', data);
      alert(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      alert('Cannot connect to server: ' + error.message);
    }
  };

  // ===========================================
  // TEST MONGODB FUNCTION
  // ===========================================
  const testMongoDB = async () => {
    try {
      console.log('🔍 Testing MongoDB connection...');
      const response = await fetch('http://localhost:5000/api/debug/collection');
      const data = await response.json();
      console.log('✅ MongoDB debug:', data);
      alert(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('❌ MongoDB test failed:', error);
      alert('Cannot connect to MongoDB: ' + error.message);
    }
  };

  // ===========================================
  // LOAD DATA FROM LOCALSTORAGE
  // ===========================================
  const loadFromStorage = () => {
    try {
      const savedNotes = localStorage.getItem(storageKeys.notes);
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(parsedNotes);
        console.log('📂 Loaded notes from localStorage:', parsedNotes.length);
      }

      const savedDiscoveries = localStorage.getItem(storageKeys.discoveries);
      if (savedDiscoveries) {
        const parsedDiscoveries = JSON.parse(savedDiscoveries);
        setDiscoveries(parsedDiscoveries);
        console.log('📂 Loaded discoveries from localStorage:', parsedDiscoveries);
      }

      const savedXP = localStorage.getItem(storageKeys.xp);
      if (savedXP) {
        const parsedXP = parseInt(savedXP);
        setTotalXP(parsedXP);
      }
      
      const currentNotes = savedNotes ? JSON.parse(savedNotes) : [];
      if (currentNotes.length === 0) {
        setPlayerMessage("Player currently not find anything");
      } else {
        setPlayerMessage("Player has found evidence");
      }
    } catch (error) {
      console.error('❌ Error loading from localStorage:', error);
    }
  };

  // ===========================================
  // FETCH NOTES FROM MONGODB
  // ===========================================
  const fetchFromMongoDB = async () => {
    if (!userId || userId === 'admin') {
      setPlayerMessage("Player currently not find anything");
      setLoading(false);
      return;
    }

    try {
      setSyncStatus('syncing');
      const collection = getCollectionName();
      console.log(`📡 Fetching from MongoDB: http://localhost:5000/api/${collection}/notes/${userId}`);
      
      const response = await fetch(`http://localhost:5000/api/${collection}/notes/${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ MongoDB fetch response:', data);
        
        setMongoXP(data.xpEarned || 0);
        setMongoNotesCount(data.notes?.length || 0);
        
        if (data.notes && Array.isArray(data.notes) && data.notes.length > 0) {
          // Transform MongoDB notes to match our frontend format
          const formattedNotes = data.notes.map(note => ({
            id: note.noteId || note.id || Date.now() + Math.random(),
            noteId: note.noteId || note.id,
            timestamp: note.timestamp || new Date(note.createdAt || Date.now()).toLocaleString(),
            title: note.title || 'Note',
            content: note.content || '',
            source: note.source || 'MongoDB',
            xp: note.xp || 0,
            isConclusion: note.isConclusion || false,
            caseId: note.caseId || caseNumber,
            createdAt: note.createdAt || new Date().toISOString()
          }));
          
          // Remove any duplicates based on id
          const uniqueNotes = formattedNotes.filter((note, index, self) =>
            index === self.findIndex(n => n.id === note.id)
          );
          
          setNotes(uniqueNotes);
          localStorage.setItem(storageKeys.notes, JSON.stringify(uniqueNotes));
          
          if (data.discoveries && data.discoveries.length > 0) {
            // Remove duplicates from discoveries array
            const uniqueDiscoveries = [...new Set(data.discoveries)];
            setDiscoveries(uniqueDiscoveries);
            localStorage.setItem(storageKeys.discoveries, JSON.stringify(uniqueDiscoveries));
          }
          
          if (data.xpEarned > 0) {
            setTotalXP(data.xpEarned);
            localStorage.setItem(storageKeys.xp, data.xpEarned.toString());
          }
          
          setPlayerMessage("Player has found evidence");
          console.log('✅ Loaded notes from MongoDB:', data.notes.length);
        } else {
          console.log('⚠️ No notes in MongoDB, loading from localStorage');
          loadFromStorage();
        }
        setSyncStatus('synced');
      } else {
        const errorText = await response.text();
        console.error('❌ MongoDB fetch failed:', response.status, errorText);
        loadFromStorage();
        setSyncStatus('error');
      }
    } catch (error) {
      console.error(`❌ Error fetching from MongoDB:`, error);
      loadFromStorage();
      setSyncStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // ===========================================
  // VERIFICATION FUNCTION
  // ===========================================
  const verifyNoteAgainstEvidence = (noteContent, noteTitle) => {
    // Extract discovery title from note
    let discoveryTitle = null;
    
    if (noteTitle && noteTitle.includes('DISCOVERY:')) {
      discoveryTitle = noteTitle.replace('DISCOVERY:', '').trim();
    } else {
      const titleMatch = noteContent.match(/DISCOVERY:\s*(.+?)(?:\n|$)/);
      if (titleMatch) {
        discoveryTitle = titleMatch[1].trim();
      }
    }

    if (!discoveryTitle) {
      return { isValid: false, discoveryId: null };
    }
    
    const discoveryId = titleToIdMap[discoveryTitle];
    
    if (!discoveryId) {
      return { isValid: false, discoveryId: null };
    }

    if (discoveryId === 99) {
      return { isValid: true, discoveryId, xpEarned: 0 };
    }

    // Compare note content with correct evidence based on case
    let isMatch = false;
    
    if (caseNumber === '101') {
      switch(discoveryId) {
        case 1: // 3:00 AM Suspicious Login
          isMatch = noteContent.includes('03:00:47 LOGIN_SUCCESS') && 
                    noteContent.includes('10.12.45.89');
          break;
        case 2: // Attack Pattern Detected
          isMatch = noteContent.includes('02:58:12 LOGIN_FAILED') && 
                    noteContent.includes('02:59:03 LOGIN_FAILED') &&
                    noteContent.includes('03:00:47 LOGIN_SUCCESS');
          break;
        case 3: // John Was OFF Work
          isMatch = noteContent.includes('jdoe,2024-03-16,OFF');
          break;
        case 4: // Unauthorized HR Access
          isMatch = noteContent.includes('HR_READ') && 
                    noteContent.includes('Marketing');
          break;
        case 5: // Suspicious IP Identified
          isMatch = noteContent.includes('10.12.45.89') && 
                    noteContent.includes('Found 5 matches');
          break;
        default:
          isMatch = false;
      }
    } else if (caseNumber === '102') {
      switch(discoveryId) {
        case 1: // Phishing Email Found
          isMatch = noteContent.includes('IT-Support@company-reset.com');
          break;
        case 2: // Victims Identified
          isMatch = noteContent.includes('sarah') && noteContent.includes('mike') && noteContent.includes('lisa');
          break;
        case 3: // Phishing Page Analyzed
          isMatch = noteContent.includes('evil-server.com');
          break;
        case 4: // Malicious Server Located
          isMatch = noteContent.includes('185.142.53.89') && noteContent.includes('Russia');
          break;
        case 5: // Stolen Credentials Found
          isMatch = noteContent.includes('Summer2024!') || noteContent.includes('sales123') || noteContent.includes('finance2024');
          break;
        case 6: // 2FA Saved the Day
          isMatch = noteContent.includes('VPN_FAILED') || noteContent.includes('2FA');
          break;
        default:
          isMatch = false;
      }
    }
    
    return { 
      isValid: isMatch, 
      discoveryId, 
      xpEarned: isMatch ? 15 : 0 
    };
  };

  // ===========================================
  // SYNC WITH MONGODB
  // ===========================================
  const syncWithMongoDB = async (updatedNotes, updatedDiscoveries, updatedXP, status = 'in-progress') => {
    if (!userId || userId === 'admin') return;

    try {
      setSyncStatus('syncing');
      const collection = getCollectionName();
      console.log(`📤 Syncing with MongoDB: http://localhost:5000/api/${collection}/sync-state`);
      
      // Remove duplicates from discoveries before sending
      const uniqueDiscoveries = [...new Set(updatedDiscoveries)];
      
      // Remove duplicate notes based on id
      const uniqueNotes = updatedNotes.filter((note, index, self) =>
        index === self.findIndex(n => n.id === note.id)
      );
      
      const response = await fetch(`http://localhost:5000/api/${collection}/sync-state`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          userId,
          notes: uniqueNotes,
          discoveries: uniqueDiscoveries,
          xpEarned: updatedXP,
          status
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ MongoDB sync successful:', data);
        setMongoXP(data.xpEarned || updatedXP);
        setMongoNotesCount(data.notes?.length || uniqueNotes.length);
        setSyncStatus('synced');
        
        if (updatedNotes.length === 0) {
          setPlayerMessage("Player currently not find anything");
        } else {
          setPlayerMessage("Player has found evidence");
        }
      } else {
        const errorText = await response.text();
        console.error('❌ MongoDB sync failed:', response.status, errorText);
        setSyncStatus('error');
      }
    } catch (error) {
      console.error(`❌ Error syncing with MongoDB:`, error);
      setSyncStatus('error');
    }
  };

  // ===========================================
  // ADD NOTE TO MONGODB
  // ===========================================
  const addNoteToMongoDB = async (note, discoveryId, xpEarned) => {
    if (!userId || userId === 'admin') return null;

    try {
      const collection = getCollectionName();
      console.log(`📤 Adding note to MongoDB: http://localhost:5000/api/${collection}/add-note`);
      
      // Create a clean note object WITHOUT the xp field
      const cleanNote = {
        id: note.id,
        noteId: note.noteId || note.id,
        timestamp: note.timestamp,
        title: note.title,
        content: note.content,
        source: note.source,
        isConclusion: note.isConclusion || false,
        caseId: note.caseId,
        createdAt: note.createdAt,
        type: note.type || 'note'
      };
      
      const response = await fetch(`http://localhost:5000/api/${collection}/add-note`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          userId,
          note: cleanNote,
          discoveryId: discoveryId,
          xpEarned: xpEarned
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ MongoDB add-note successful:', data);
        
        // Update local state with server response (which has unique discoveries)
        if (data.discoveries) {
          setDiscoveries(data.discoveries);
          localStorage.setItem(storageKeys.discoveries, JSON.stringify(data.discoveries));
        }
        if (data.xpEarned) {
          setTotalXP(data.xpEarned);
          localStorage.setItem(storageKeys.xp, data.xpEarned.toString());
          setMongoXP(data.xpEarned);
        }
        if (data.notes) {
          setMongoNotesCount(data.notes.length);
        }
        
        return data;
      } else {
        const errorText = await response.text();
        console.error('❌ MongoDB add-note failed:', response.status, errorText);
        return null;
      }
    } catch (error) {
      console.error(`❌ Error adding note to MongoDB:`, error);
      return null;
    }
  };

  // ===========================================
  // RESET LEVEL FUNCTION
  // ===========================================
  const handleResetLevel = async () => {
    if (!window.confirm('⚠️ Are you sure? This will DELETE all your notes, discoveries, and XP for this case. This cannot be undone!')) {
      return;
    }

    console.log(`🔄 Resetting ${caseId} progress...`);
    setVerificationLoading(true);
    setSyncStatus('syncing');

    try {
      // 1. Clear React state
      setNotes([]);
      setDiscoveries([]);
      setTotalXP(0);
      processedNoteIds.current = new Set();
      hasProcessedNavigation.current = false;
      
      // 2. Clear localStorage
      localStorage.removeItem(storageKeys.notes);
      localStorage.removeItem(storageKeys.discoveries);
      localStorage.removeItem(storageKeys.xp);
      localStorage.removeItem(storageKeys.completed);
      localStorage.removeItem(storageKeys.accuracy);
      localStorage.removeItem(storageKeys.finalXP);
      
      console.log(`✅ localStorage cleared for ${caseId}`);

      // 3. Reset MongoDB via the complete reset endpoint
      if (userId && userId !== 'admin') {
        const collection = getCollectionName();
        console.log(`📤 Resetting MongoDB: http://localhost:5000/api/${collection}/reset-complete`);
        
        const response = await fetch(`http://localhost:5000/api/${collection}/reset-complete`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ userId })
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ MongoDB progress reset for ${caseId}:`, data);
        } else {
          const errorText = await response.text();
          console.error('❌ MongoDB reset failed:', response.status, errorText);
        }
      }

      // 4. Update player message
      setPlayerMessage("Player currently not find anything");
      setMongoXP(0);
      setMongoNotesCount(0);
      setSyncStatus('synced');
      
      // 5. Dispatch update event
      window.dispatchEvent(new CustomEvent('case-notes-updated', { 
        detail: { 
          caseId: caseNumber,
          notes: [], 
          discoveries: [], 
          xp: 0,
          reset: true 
        }
      }));

      alert(`✅ ${caseId} has been reset. You can start fresh!`);
      
    } catch (error) {
      console.error(`❌ Error resetting ${caseId}:`, error);
      setSyncStatus('error');
      alert('Error resetting level. Please try again.');
    } finally {
      setVerificationLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (userId && userId !== 'admin') {
      fetchFromMongoDB();
    } else {
      loadFromStorage();
    }
  }, [caseNumber, userId]);

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter notes
  const filteredNotes = notes.filter(note => 
    note.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (note.source && note.source.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const investigator = {
    name: userId || 'detective',
    case: `${caseId} - ${caseConfig.title}`,
    status: discoveries.length === requiredDiscoveries ? 'Ready to Submit' : 'In Progress'
  };

  const discoveryChecklist = discoveriesData.map(d => ({
    id: d.id,
    name: d.name,
    description: d.description,
    found: discoveries.includes(d.id)
  }));

  const handleNewNote = () => {
    setEditingNote(null);
    setShowEditor(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setShowEditor(true);
  };

  // ===========================================
  // HANDLE SAVE NOTE - FIXED to prevent duplicates
  // ===========================================
  const handleSaveNote = async (noteData) => {
    setVerificationLoading(true);
    setSyncStatus('syncing');
    
    let updatedNotes;
    let verificationResult = null;
    let isNewNote = false;
    let newNote = null;
    
    if (editingNote && editingNote.id) {
      // Edit existing note
      updatedNotes = notes.map(n => {
        if (n.id === editingNote.id) {
          return { 
            ...n, 
            content: noteData.content,
            title: noteData.title || n.title,
            isConclusion: n.isConclusion || noteData.isConclusion || false
          };
        }
        return n;
      });
      
      // Save to localStorage
      localStorage.setItem(storageKeys.notes, JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
      
      // For existing notes, just sync full state
      if (userId && userId !== 'admin') {
        await syncWithMongoDB(updatedNotes, discoveries, totalXP);
      }
      
      setShowEditor(false);
      setEditingNote(null);
      setVerificationLoading(false);
      return;
    }
    
    // Create new note
    isNewNote = true;
    const now = new Date();
    const timestamp = now.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(',', '');

    newNote = {
      id: Date.now(),
      noteId: Date.now(),
      timestamp: timestamp,
      title: noteData.title || (noteData.isConclusion ? `FINAL CONCLUSION - ${caseId}` : 'Manual Note'),
      content: noteData.content,
      source: noteData.isConclusion ? 'Final Conclusion' : 'Manual Entry',
      xp: 0,
      isConclusion: noteData.isConclusion || false,
      caseId: caseNumber,
      createdAt: new Date().toISOString(),
      type: noteData.isConclusion ? 'conclusion' : 'note'
    };
    
    // Check if this note already exists (prevent duplicates)
    const noteExists = notes.some(n => 
      n.id === newNote.id || 
      (n.title === newNote.title && n.content === newNote.content && n.timestamp === newNote.timestamp)
    );
    
    if (noteExists) {
      console.log('⚠️ Note already exists, skipping save');
      setShowEditor(false);
      setEditingNote(null);
      setVerificationLoading(false);
      return;
    }
    
    // Verify if this is a discovery
    verificationResult = verifyNoteAgainstEvidence(
      noteData.content, 
      newNote.title
    );
    
    let updatedDiscoveries = [...discoveries];
    let updatedXP = totalXP;
    let xpEarnedThisNote = 0;
    let discoveryIdAdded = null;
    let isNewDiscovery = false;
    
    // Check if this is a new discovery
    if (verificationResult && verificationResult.isValid && verificationResult.discoveryId) {
      const discoveryId = verificationResult.discoveryId;
      xpEarnedThisNote = verificationResult.xpEarned || 0;
      
      // Only add XP if this discovery hasn't been found yet
      if (!updatedDiscoveries.includes(discoveryId) && discoveryId !== 99) {
        updatedDiscoveries.push(discoveryId);
        updatedXP += xpEarnedThisNote;
        discoveryIdAdded = discoveryId;
        isNewDiscovery = true;
        newNote.xp = xpEarnedThisNote;
      }
    }
    
    // Add note to list
    updatedNotes = [newNote, ...notes];
    
    // Save to localStorage first
    localStorage.setItem(storageKeys.notes, JSON.stringify(updatedNotes));
    if (isNewDiscovery) {
      localStorage.setItem(storageKeys.discoveries, JSON.stringify(updatedDiscoveries));
      localStorage.setItem(storageKeys.xp, updatedXP.toString());
    }
    
    setNotes(updatedNotes);
    if (isNewDiscovery) {
      setDiscoveries(updatedDiscoveries);
      setTotalXP(updatedXP);
    }
    
    // ===== SYNC WITH MONGODB - ONLY IF NOT ALREADY PROCESSED =====
    if (userId && userId !== 'admin' && !processedNoteIds.current.has(newNote.id)) {
      // Mark as processed
      processedNoteIds.current.add(newNote.id);
      
      const mongoResult = await addNoteToMongoDB(
        newNote, 
        isNewDiscovery ? discoveryIdAdded : null, 
        isNewDiscovery ? xpEarnedThisNote : 0
      );
      
      if (mongoResult) {
        console.log('✅ Note saved to MongoDB successfully');
        setSyncStatus('synced');
        
        // Update with server data (which has unique discoveries)
        if (mongoResult.xpEarned) {
          setMongoXP(mongoResult.xpEarned);
        }
        if (mongoResult.notes) {
          setMongoNotesCount(mongoResult.notes.length);
        }
        
        alert('✅ Note saved successfully to cloud!');
      } else {
        setSyncStatus('error');
        alert('⚠️ Note saved locally only. Cloud sync failed.');
      }
    }
    
    setPlayerMessage(updatedNotes.length === 0 ? "Player currently not find anything" : "Player has found evidence");
    
    setShowEditor(false);
    setEditingNote(null);
    setVerificationLoading(false);
    
    // Dispatch event to update Game Level Page
    window.dispatchEvent(new CustomEvent('case-notes-updated', { 
      detail: { 
        caseId: caseNumber,
        notes: updatedNotes, 
        discoveries: updatedDiscoveries, 
        xp: updatedXP 
      }
    }));
    
    console.log('📢 Dispatched update with discoveries:', updatedDiscoveries);
  };

  // ===========================================
  // HANDLE DELETE NOTE
  // ===========================================
  const handleDeleteNote = async (noteId) => {
    console.log(`🗑️ Attempting to delete note with id:`, noteId);
    
    if (window.confirm('Delete this note?')) {
      const noteToDelete = notes.find(n => n.id === noteId);
      if (!noteToDelete) return;
      
      let discoveryIdRemoved = null;
      let xpLost = noteToDelete.xp || 0;
      
      if (xpLost > 0 && noteToDelete.title && noteToDelete.title.includes('DISCOVERY:')) {
        const discoveryTitle = noteToDelete.title.replace('DISCOVERY:', '').trim();
        discoveryIdRemoved = titleToIdMap[discoveryTitle];
      }
      
      const updatedNotes = notes.filter(n => n.id !== noteId);
      
      let updatedDiscoveries = [...discoveries];
      let updatedXP = totalXP;
      
      if (discoveryIdRemoved) {
        const otherNotesWithSameDiscovery = updatedNotes.some(n => 
          n.title && n.title.includes('DISCOVERY:') && 
          n.title.replace('DISCOVERY:', '').trim() === noteToDelete.title.replace('DISCOVERY:', '').trim()
        );
        
        if (!otherNotesWithSameDiscovery) {
          updatedDiscoveries = updatedDiscoveries.filter(id => id !== discoveryIdRemoved);
          updatedXP = Math.max(0, updatedXP - xpLost);
        }
      }
      
      localStorage.setItem(storageKeys.notes, JSON.stringify(updatedNotes));
      localStorage.setItem(storageKeys.discoveries, JSON.stringify(updatedDiscoveries));
      localStorage.setItem(storageKeys.xp, updatedXP.toString());
      
      setNotes(updatedNotes);
      setDiscoveries(updatedDiscoveries);
      setTotalXP(updatedXP);
      
      if (updatedNotes.length === 0) {
        setPlayerMessage("Player currently not find anything");
      }
      
      setSyncStatus('syncing');
      
      if (userId && userId !== 'admin') {
        const collection = getCollectionName();
        
        try {
          const response = await fetch(`http://localhost:5000/api/${collection}/delete-note`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({ 
              userId, 
              noteId,
              discoveryId: discoveryIdRemoved,
              xpLost: xpLost
            })
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('✅ MongoDB delete successful:', data);
            setDiscoveries(data.discoveries || updatedDiscoveries);
            setTotalXP(data.xpEarned || updatedXP);
            setMongoXP(data.xpEarned || updatedXP);
            setMongoNotesCount(data.notes?.length || updatedNotes.length);
            setSyncStatus('synced');
          } else {
            console.error('❌ MongoDB delete failed, falling back to sync');
            await syncWithMongoDB(updatedNotes, updatedDiscoveries, updatedXP);
          }
        } catch (error) {
          console.error(`❌ Error syncing delete:`, error);
          await syncWithMongoDB(updatedNotes, updatedDiscoveries, updatedXP);
        }
      }
      
      window.dispatchEvent(new CustomEvent('case-notes-updated', { 
        detail: { 
          caseId: caseNumber,
          notes: updatedNotes, 
          discoveries: updatedDiscoveries, 
          xp: updatedXP 
        }
      }));
    }
  };

  // ===========================================
  // CREATE CONCLUSION
  // ===========================================
  const handleCreateConclusion = () => {
    const existingConclusion = notes.find(n => n.isConclusion === true);
    if (existingConclusion) {
      if (window.confirm('A conclusion already exists. Do you want to edit it?')) {
        setEditingNote(existingConclusion);
        setShowEditor(true);
      }
      return;
    }

    const conclusionNote = {
      isConclusion: true,
      title: `FINAL CONCLUSION - ${caseId}`,
      content: caseConfig.conclusionTemplate
    };
    
    setEditingNote(conclusionNote);
    setShowEditor(true);
  };

  const handleReview = () => {
    const conclusion = notes.find(n => n.isConclusion === true);
    const missingDiscoveries = discoveryChecklist.filter(d => !d.found);
    
    let message = `📋 CASE REVIEW - ${caseId}\n══════════════\n\n`;
    message += `Discoveries: ${discoveries.length}/${requiredDiscoveries}\n`;
    message += `Evidence Notes: ${notes.length}\n`;
    message += `Total XP: ${totalXP}\n\n`;
    
    if (discoveries.length < requiredDiscoveries) {
      message += '❌ MISSING EVIDENCE:\n';
      missingDiscoveries.forEach(d => {
        message += `   • ${d.name}\n`;
      });
      message += `\nFind ${missingDiscoveries.length} more discovery${missingDiscoveries.length > 1 ? 'ies' : 'y'} to submit.`;
    } else if (!conclusion) {
      message += '✅ All discoveries found!\n';
      message += '❌ Missing final conclusion. Click "Conclusion" to add it.';
    } else {
      message += '✅ READY TO SUBMIT!\n';
      message += 'All evidence found and conclusion written.';
    }
    
    alert(message);
  };

  const handleSubmit = () => {
    const currentNotes = JSON.parse(localStorage.getItem(storageKeys.notes) || '[]');
    setNotes(currentNotes);
    
    const hasConclusion = currentNotes.some(note => 
      note.isConclusion === true || 
      note.title?.includes('CONCLUSION') ||
      note.content?.includes('FINAL CONCLUSION')
    );
    
    if (discoveries.length < requiredDiscoveries) {
      alert(`❌ Cannot submit case!\nYou need all ${requiredDiscoveries} discoveries.\nCurrent: ${discoveries.length}/${requiredDiscoveries}`);
      return;
    }
    
    if (!hasConclusion) {
      alert('❌ Please add a final conclusion note before submitting.');
      return;
    }
    
    setShowConclusionModal(true);
  };

  const handleConfirmSubmit = () => {
    const conclusion = notes.find(n => 
      n.isConclusion === true || 
      n.title?.includes('CONCLUSION') ||
      n.content?.includes('FINAL CONCLUSION')
    );
    
    let accuracy = 60;
    
    if (conclusion) {
      if (caseNumber === '101') {
        if (conclusion.content.includes('COMPROMISED') || conclusion.content.includes('compromised')) {
          accuracy += 15;
        }
        if (conclusion.content.includes('victim') || conclusion.content.includes('VICTIM')) {
          accuracy += 15;
        }
        if (conclusion.content.includes('automated') || conclusion.content.includes('brute-force')) {
          accuracy += 10;
        }
      } else if (caseNumber === '102') {
        if (conclusion.content.includes('phishing') || conclusion.content.includes('PHISHING')) {
          accuracy += 10;
        }
        if (conclusion.content.includes('2FA') || conclusion.content.includes('two-factor')) {
          accuracy += 20;
        }
        if (conclusion.content.includes('blocked') || conclusion.content.includes('failed')) {
          accuracy += 10;
        }
      }
    }
    
    accuracy = Math.min(accuracy, 100);
    
    setCaseResult({
      success: accuracy >= 80,
      accuracy: accuracy,
      totalXP: totalXP,
      message: accuracy >= 80 ? caseConfig.successMessage : caseConfig.failureMessage
    });
    
    setShowSuccessPopup(true);
    setShowConclusionModal(false);
  };

  const handleCaseComplete = async () => {
    if (caseResult.success) {
      localStorage.setItem(storageKeys.completed, 'true');
      localStorage.setItem(storageKeys.accuracy, caseResult.accuracy.toString());
      localStorage.setItem(storageKeys.finalXP, totalXP.toString());
      
      if (userId && userId !== 'admin') {
        await syncWithMongoDB(notes, discoveries, totalXP, 'completed');
      }
      
      navigate('/game-level', { 
        state: { 
          levelCompleted: true,
          levelId: parseInt(caseNumber),
          accuracy: caseResult.accuracy,
          xp: totalXP,
          nextLevel: parseInt(caseNumber) + 1
        }
      });
    } else {
      localStorage.removeItem(storageKeys.notes);
      localStorage.removeItem(storageKeys.discoveries);
      localStorage.removeItem(storageKeys.xp);
      setNotes([]);
      setDiscoveries([]);
      setTotalXP(0);
      
      if (userId && userId !== 'admin') {
        await handleResetLevel();
      }
      
      navigate('/os-desktop', { state: { userId, caseId: caseNumber, restart: true } });
    }
    
    setShowSuccessPopup(false);
  };

  const handleExport = () => {
    if (notes.length === 0) {
      alert('No notes to export.');
      return;
    }

    let header = `${caseId} NOTES - ${caseConfig.title}\n`;
    header += `Investigator: ${investigator.name}\n`;
    header += `Date: ${new Date().toLocaleString()}\n`;
    header += `Discoveries: ${discoveries.length}/${requiredDiscoveries}\n`;
    header += `Total XP: ${totalXP}\n`;
    header += `${'='.repeat(60)}\n\n`;

    const notesText = notes.map(n => 
      `[${n.timestamp}] ${n.title || 'Note'}\n${'-'.repeat(40)}\n${n.content}\n${n.xp > 0 ? `\nXP: +${n.xp}` : ''}\n`
    ).join('\n\n');
    
    const fullText = header + notesText;
    
    const blob = new Blob([fullText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `case_${caseNumber}_notes_${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClose = () => {
    navigate('/os-desktop', { state: { userId, caseId: caseNumber } });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  // ===== UPDATE MONGO XP WHEN DISCOVERIES CHANGE =====
  useEffect(() => {
    // Update mongoXP whenever discoveries or totalXP changes
    if (discoveries.length > 0) {
      const correctXP = discoveries.length * 15;
      if (totalXP !== correctXP) {
        console.log(`⚠️ Fixing XP display: ${totalXP} → ${correctXP}`);
        setTotalXP(correctXP);
        localStorage.setItem(storageKeys.xp, correctXP.toString());
      }
      setMongoXP(correctXP);
    } else {
      setMongoXP(0);
    }
  }, [discoveries, totalXP]);

  return (
    <div className="case-notes-container">
      {/* Success Popup */}
      {showSuccessPopup && caseResult && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: caseResult.success ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            maxWidth: '500px',
            width: '90%',
            textAlign: 'center',
            animation: 'popIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
              {caseResult.success ? '🎉' : '❌'}
            </div>
            
            <h2 style={{ fontSize: '2rem', margin: '0 0 1rem 0' }}>
              {caseResult.success ? `${caseId} SOLVED!` : 'INVESTIGATION FAILED'}
            </h2>
            
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Accuracy: {caseResult.accuracy}%
              </div>
              <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                Total XP: {caseResult.totalXP}
              </div>
              <p style={{ margin: '1rem 0 0 0', lineHeight: '1.6' }}>
                {caseResult.message}
              </p>
            </div>
            
            {caseResult.success && (
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '1rem',
                borderRadius: '0.5rem',
                marginBottom: '1.5rem',
                fontWeight: 'bold'
              }}>
                🔓 NEXT CASE UNLOCKED: #{parseInt(caseNumber) + 1}
              </div>
            )}
            
            <button
              onClick={handleCaseComplete}
              style={{
                background: 'white',
                border: 'none',
                color: caseResult.success ? '#10b981' : '#ef4444',
                padding: '1rem 2rem',
                borderRadius: '0.5rem',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              {caseResult.success ? `CONTINUE TO CASE #${parseInt(caseNumber) + 1}` : 'RESTART CASE'}
            </button>
          </div>
        </div>
      )}

      {/* Window Header */}
      <div className="case-notes-header">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center">
            <span className="text-blue-400 text-sm">📓</span>
          </div>
          <span className="text-white font-semibold">Case Notes - {caseId}</span>
          <span className="text-gray-400 text-sm ml-4">[_][□][✕]</span>
          
          <div style={{ marginLeft: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award className="w-4 h-4 text-yellow-400" />
              <span className="text-white text-sm">{totalXP} XP</span>
            </div>
            {verificationLoading && (
              <span style={{ color: '#fbbf24', fontSize: '0.8rem' }}>Verifying...</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={handleClose} className="window-control hover:bg-gray-700 text-gray-300">
            <Minus className="w-4 h-4" />
          </button>
          <button onClick={handleClose} className="window-control hover:bg-gray-700 text-gray-300">
            <Square className="w-4 h-4" />
          </button>
          <button onClick={handleClose} className="window-control hover:bg-red-600 text-gray-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Case Info Bar */}
      <CaseInfoBar 
        investigator={investigator.name}
        caseName={investigator.case}
        status={investigator.status}
        currentTime={formatTime(currentTime)}
      />

      {/* Action Toolbar */}
      <div className="case-notes-toolbar">
        <button className="toolbar-btn primary" onClick={handleNewNote}>
          <Plus size={16} />
          <span>New Note</span>
        </button>
        
        <button className="toolbar-btn" onClick={() => alert('💡 Notes are auto-saved.')}>
          <Save size={16} />
          <span>Save</span>
        </button>
        
        <button className="toolbar-btn" onClick={handleReview}>
          <Search size={16} />
          <span>Review</span>
        </button>
        
        {/* Debug Buttons */}
        <button 
          className="toolbar-btn" 
          onClick={testConnection}
          style={{ background: '#3b82f6', color: 'white', marginLeft: '0.5rem' }}
        >
          Test Server
        </button>
        
        <button 
          className="toolbar-btn" 
          onClick={testMongoDB}
          style={{ background: '#8b5cf6', color: 'white' }}
        >
          Test DB
        </button>
        
        {/* Reset Button */}
        <button 
          className="toolbar-btn" 
          onClick={handleResetLevel}
          style={{
            background: '#ef4444',
            borderColor: '#ef4444',
            color: 'white',
            marginLeft: '0.5rem'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#dc2626';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#ef4444';
          }}
        >
          <RotateCcw size={16} />
          <span>Reset Level</span>
        </button>
        
        <button 
          className="toolbar-btn" 
          onClick={handleCreateConclusion}
          style={{
            background: notes.some(n => n.isConclusion === true) ? '#fbbf24' : '#1a1d3a',
            borderColor: notes.some(n => n.isConclusion === true) ? '#fbbf24' : '#374151',
            color: notes.some(n => n.isConclusion === true) ? '#000' : '#e5e7eb'
          }}
        >
          <FileText size={16} />
          <span>{notes.some(n => n.isConclusion === true) ? 'Edit Conclusion' : 'Conclusion'}</span>
        </button>
        
        <button 
          className={`toolbar-btn ${discoveries.length === requiredDiscoveries ? 'submit' : ''}`} 
          onClick={handleSubmit}
          style={{
            background: discoveries.length === requiredDiscoveries ? '#10b981' : '#1a1d3a',
            borderColor: discoveries.length === requiredDiscoveries ? '#10b981' : '#374151',
            opacity: discoveries.length === requiredDiscoveries ? 1 : 0.7
          }}
          disabled={discoveries.length < requiredDiscoveries}
        >
          <Send size={16} />
          <span>Submit</span>
        </button>

        <div className="flex-1"></div>

        <div className="search-container">
          <Search size={14} className="text-gray-400" />
          <input
            type="text"
            className="search-input"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Discovery Checklist */}
      <div className="discovery-progress">
        <div className="progress-header">
          <span className="progress-title">REQUIRED EVIDENCE ({requiredDiscoveries} needed to solve case)</span>
          <span className="progress-count">{discoveries.length}/{requiredDiscoveries}</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(discoveries.length / requiredDiscoveries) * 100}%` }}
          ></div>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.5rem',
          marginTop: '1rem'
        }}>
          {discoveryChecklist.map(item => (
            <div key={item.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem',
              background: item.found ? 'rgba(16, 185, 129, 0.1)' : '#1a1d3a',
              borderRadius: '0.375rem',
              border: item.found ? '1px solid #10b981' : `1px solid ${caseConfig.color}`,
              transition: 'all 0.3s ease'
            }}>
              <span style={{ color: item.found ? '#10b981' : '#6b7280' }}>
                {item.found ? '✅' : '⬜'}
              </span>
              <div>
                <div style={{ 
                  color: item.found ? '#10b981' : '#e5e7eb',
                  fontSize: '0.85rem',
                  fontWeight: item.found ? 'bold' : 'normal'
                }}>
                  {item.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {discoveries.length < requiredDiscoveries && (
          <div className="progress-hint">
            <AlertCircle size={12} />
            <span>Find {requiredDiscoveries - discoveries.length} more discovery{requiredDiscoveries - discoveries.length > 1 ? 'ies' : 'y'} to submit case</span>
          </div>
        )}
        {discoveries.length === requiredDiscoveries && !notes.some(n => n.isConclusion === true) && (
          <div className="progress-hint" style={{ color: '#fbbf24' }}>
            <FileText size={12} />
            <span>✅ All discoveries found! Click "Conclusion" to write your final report</span>
          </div>
        )}
        {discoveries.length === requiredDiscoveries && notes.some(n => n.isConclusion === true) && (
          <div className="progress-hint" style={{ color: '#4ade80' }}>
            <Zap size={12} />
            <span>✅ Ready to submit! Click SUBMIT to complete the case</span>
          </div>
        )}
      </div>

      {/* Notes List */}
      <div className="notes-list">
        {filteredNotes.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📓</span>
            <h3>No Notes Yet - {caseId}</h3>
            <p style={{ color: '#fbbf24', marginBottom: '1rem' }}>{playerMessage}</p>
            <p>Evidence you copy from Log Viewer or Terminal will appear here</p>
            <div className="empty-state-hints">
              <div className="hint-item">
                <span className="hint-icon">📋</span>
                <div className="hint-text">
                  <strong>From Log Viewer:</strong> Select suspicious entries and click "Copy to Notes"
                </div>
              </div>
              <div className="hint-item">
                <span className="hint-icon">💻</span>
                <div className="hint-text">
                  <strong>From Terminal:</strong> Run commands, then click "Copy to Notes" button
                </div>
              </div>
            </div>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={() => handleEditNote(note)}
              onDelete={() => handleDeleteNote(note.id)}
            />
          ))
        )}
      </div>

      {/* Status Bar */}
      <div className="case-notes-statusbar">
        <div className="status-left">
          <FolderOpen size={14} className="text-gray-500" />
          <span>Case: {investigator.case}</span>
        </div>
        <div className="status-right">
          <div className="note-count">
            <span className="count">{notes.length}</span>
            <span>Notes</span>
          </div>
          <div className="discovery-count">
            <span className="count">{discoveries.length}</span>
            <span>Discoveries</span>
          </div>
          <button className="export-btn" onClick={handleExport} title="Export Notes">
            <Download size={14} />
          </button>
        </div>
      </div>

      {/* MongoDB Status Display */}
      <div style={{
        background: '#1a1d3a',
        borderTop: '1px solid #374151',
        padding: '0.5rem 1rem',
        fontSize: '0.75rem',
        color: '#9ca3af',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ color: '#00b4d8' }}>📊 MongoDB:</span>
          <span>XP: {mongoXP}</span>
          <span>•</span>
          <span style={{ 
            color: playerMessage === "Player currently not find anything" ? '#fbbf24' : '#4ade80',
            fontWeight: 'bold'
          }}>
            {playerMessage}
          </span>
          <span>•</span>
          <span>Notes in DB: {mongoNotesCount}</span>
          <span>•</span>
          <span style={{
            color: syncStatus === 'synced' ? '#4ade80' : syncStatus === 'syncing' ? '#fbbf24' : '#ef4444'
          }}>
            {syncStatus === 'synced' ? '✅ Synced' : syncStatus === 'syncing' ? '🔄 Syncing...' : '❌ Error'}
          </span>
          <span>•</span>
          <span style={{ color: '#00b4d8' }}>
            Collection: {getCollectionName()}
          </span>
        </div>
        {loading && <span style={{ color: '#fbbf24' }}>Loading...</span>}
      </div>

      {/* Note Editor Modal */}
      {showEditor && (
        <NoteEditor
          note={editingNote}
          onSave={handleSaveNote}
          onClose={() => {
            setShowEditor(false);
            setEditingNote(null);
          }}
          caseId={caseId}
        />
      )}

      {/* Conclusion Modal */}
      {showConclusionModal && (
        <ConclusionModal
          onConfirm={handleConfirmSubmit}
          onClose={() => setShowConclusionModal(false)}
          noteCount={notes.length}
          evidenceCount={notes.length}
          discoveries={discoveries.length}
          requiredDiscoveries={requiredDiscoveries}
          caseId={caseId}
        />
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn { 0% { opacity: 0; transform: scale(0.5); } 100% { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
};

export default CaseNotes;