export const discoveries = [
  {
    id: 1,
    name: "3:00 AM Suspicious Login",
    description: "You found an unauthorized login at 3:00 AM from IP 10.12.45.89",
    evidence: "2024-03-16 03:00:47 LOGIN_SUCCESS jdoe 10.12.45.89",
    xp: 15,
    source: "auth.log",
    nextStep: "Now verify if John was supposed to be working at 3 AM. Use Terminal to check his work schedule.",
    nextStepApp: "terminal",
    nextStepCommand: "cd employees && cat shifts.csv",
    pattern: "success"
  },
  {
    id: 2,
    name: "Attack Pattern Detected",
    description: "Two failed attempts then success at 3 AM indicates an automated brute-force attack",
    evidence: "02:58:12 LOGIN_FAILED\n02:59:03 LOGIN_FAILED\n03:00:47 LOGIN_SUCCESS",
    xp: 15,
    source: "auth.log",
    nextStep: "This confirms it was an automated attack, not a mistaken password. Next, find WHY the attacker targeted John.",
    nextStepApp: "terminal",
    nextStepCommand: "cd system_info && cat permissions.txt",
    pattern: "attack_pattern"
  },
  {
    id: 3,
    name: "John Was OFF Work",
    description: "Verified John was not scheduled to work on March 16. His alibi checks out!",
    evidence: "jdoe,2024-03-16,OFF  ← John was off work",
    xp: 15,
    source: "shifts.csv",
    nextStep: "Great! John is telling the truth. Now find out WHY the attacker targeted him specifically.",
    nextStepApp: "terminal",
    nextStepCommand: "cd system_info && cat permissions.txt",
    pattern: "off_work"
  },
  {
    id: 4,
    name: "Unauthorized HR Access",
    description: "John has HR access despite being in Marketing. This explains why attackers targeted him.",
    evidence: "jdoe (Marketing): HR_READ, SALES_READ, MARKETING_WRITE",
    xp: 15,
    source: "permissions.txt",
    nextStep: "Now you know WHY - John had HR access he shouldn't have. Investigate the suspicious IP address.",
    nextStepApp: "terminal",
    nextStepCommand: "cd logs && grep '10.12.45.89' auth.log",
    pattern: "hr_access"
  },
  {
    id: 5,
    name: "Suspicious IP Identified",
    description: "IP 10.12.45.89 was only active at 3 AM, never during normal hours.",
    evidence: "02:58:12 LOGIN_FAILED\n02:59:03 LOGIN_FAILED\n03:00:47 LOGIN_SUCCESS\n03:15:22 QUERY_EXEC\n03:16:45 LOGOUT",
    xp: 15,
    source: "auth.log (grep)",
    nextStep: "You have all 5 discoveries! Go to Case Notes, write your conclusion, and submit the case.",
    nextStepApp: "case-notes",
    nextStepCommand: null,
    pattern: "ip_identified"
  }
];