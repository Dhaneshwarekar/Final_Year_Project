// Simple localStorage-based game state manager
const CASE_ID = '101';

export const GameState = {
  // Get all discoveries
  getDiscoveries: () => {
    const saved = localStorage.getItem(`case${CASE_ID}_discoveries`);
    return saved ? JSON.parse(saved) : [];
  },

  // Get total XP
  getXP: () => {
    const saved = localStorage.getItem(`case${CASE_ID}_xp`);
    return saved ? parseInt(saved) : 0;
  },

  // Check if discovery is already found
  hasDiscovery: (discoveryId) => {
    const discoveries = GameState.getDiscoveries();
    return discoveries.includes(discoveryId);
  },

  // Add new discovery (returns true if new)
  addDiscovery: (discoveryId, xp) => {
    const discoveries = GameState.getDiscoveries();
    const currentXP = GameState.getXP();
    
    if (!discoveries.includes(discoveryId)) {
      discoveries.push(discoveryId);
      localStorage.setItem(`case${CASE_ID}_discoveries`, JSON.stringify(discoveries));
      localStorage.setItem(`case${CASE_ID}_xp`, (currentXP + xp).toString());
      
      // Notify other components
      window.dispatchEvent(new Event('game-progress-updated'));
      return true;
    }
    return false;
  },

  // Add note
  addNote: (note) => {
    const notes = JSON.parse(localStorage.getItem(`case${CASE_ID}_notes`) || '[]');
    notes.push(note);
    localStorage.setItem(`case${CASE_ID}_notes`, JSON.stringify(notes));
    window.dispatchEvent(new Event('case-notes-updated'));
  },

  // Reset case (for testing)
  resetCase: () => {
    localStorage.removeItem(`case${CASE_ID}_discoveries`);
    localStorage.removeItem(`case${CASE_ID}_xp`);
    localStorage.removeItem(`case${CASE_ID}_notes`);
    window.location.reload();
  }
};

// Discovery definitions
export const DISCOVERIES = [
  {
    id: 1,
    name: "3:00 AM Suspicious Login",
    description: "You found an unauthorized login at 3:00 AM from IP 10.12.45.89",
    evidence: "2024-03-16 03:00:47 LOGIN_SUCCESS jdoe 10.12.45.89",
    xp: 15,
    source: "auth.log",
    nextStep: "Now verify if John was supposed to be working at 3 AM.",
    nextStepApp: "terminal",
    nextStepCommand: "cd employees && cat shifts.csv",
    hint: "Use Terminal to check John's work schedule: cd employees && cat shifts.csv"
  },
  {
    id: 2,
    name: "Attack Pattern Detected",
    description: "Two failed attempts then success at 3 AM indicates an automated brute-force attack",
    evidence: "02:58:12 LOGIN_FAILED\n02:59:03 LOGIN_FAILED\n03:00:47 LOGIN_SUCCESS",
    xp: 15,
    source: "auth.log",
    nextStep: "This confirms it was an automated attack. Find WHY the attacker targeted John.",
    nextStepApp: "terminal",
    nextStepCommand: "cd system_info && cat permissions.txt",
    hint: "Check permissions: cd system_info && cat permissions.txt"
  },
  {
    id: 3,
    name: "John Was OFF Work",
    description: "Verified John was not scheduled to work on March 16. His alibi checks out!",
    evidence: "jdoe,2024-03-16,OFF",
    xp: 15,
    source: "shifts.csv",
    nextStep: "Great! John is telling the truth. Now find out WHY the attacker targeted him.",
    nextStepApp: "terminal",
    nextStepCommand: "cd system_info && cat permissions.txt",
    hint: "Check permissions: cd system_info && cat permissions.txt"
  },
  {
    id: 4,
    name: "Unauthorized HR Access",
    description: "John has HR access despite being in Marketing. This explains why attackers targeted him.",
    evidence: "jdoe (Marketing): HR_READ, SALES_READ, MARKETING_WRITE",
    xp: 15,
    source: "permissions.txt",
    nextStep: "Now you know WHY. Investigate the suspicious IP address.",
    nextStepApp: "terminal",
    nextStepCommand: "cd logs && grep '10.12.45.89' auth.log",
    hint: "Investigate the IP: cd logs && grep '10.12.45.89' auth.log"
  },
  {
    id: 5,
    name: "Suspicious IP Identified",
    description: "IP 10.12.45.89 was only active at 3 AM, never during normal hours.",
    evidence: "02:58:12 LOGIN_FAILED\n02:59:03 LOGIN_FAILED\n03:00:47 LOGIN_SUCCESS\n03:15:22 QUERY_EXEC\n03:16:45 LOGOUT",
    xp: 15,
    source: "auth.log",
    nextStep: "You have all 5 discoveries! Go to Case Notes, write your conclusion, and submit the case.",
    nextStepApp: "case-notes",
    nextStepCommand: null,
    hint: "All discoveries found! Go to Case Notes and write your conclusion."
  }
];