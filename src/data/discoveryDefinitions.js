export const discoveryDefinitions = {
  '101': [
    { id: 1, name: '3:00 AM Suspicious Login', file: 'auth.log', xp: 15 },
    { id: 2, name: 'Attack Pattern Detected', file: 'auth.log', xp: 15 },
    { id: 3, name: 'John Was OFF Work', file: 'shifts.csv', xp: 15 },
    { id: 4, name: 'Unauthorized HR Access', file: 'permissions.txt', xp: 15 },
    { id: 5, name: 'Suspicious IP Identified', file: 'auth.log', xp: 15 }
  ],

  '102': [
    { id: 1, name: 'Phishing Email Found', file: 'smtp.log', xp: 15 },
    { id: 2, name: 'Victims Identified', file: 'proxy.log', xp: 15 },
    { id: 3, name: 'Phishing Page Analyzed', file: 'phishing_page.html', xp: 15 },
    { id: 4, name: 'Malicious Server Located', file: 'network_scanner', xp: 15 },
    // ✅ ADDED: Discovery 5 for credentials.txt
    { id: 5, name: 'Stolen Credentials Found', file: 'credentials.txt', xp: 15 },
    { id: 6, name: '2FA Saved the Day', file: 'firewall.log', xp: 15 }
  ]
};

export const getDiscoveriesForCase = (caseId = '101') => {
  return discoveryDefinitions[caseId] || discoveryDefinitions['101'];
};