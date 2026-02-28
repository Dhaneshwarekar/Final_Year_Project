export const fileSystems = {
  '101': {
    'Evidence (D:)': {
      type: 'drive',
      icon: 'HardDrive',
      color: 'blue',
      children: {
        'Case #101': {
          type: 'folder',
          icon: 'Folder',
          color: 'yellow',
          children: {
            'Evidence': {
              type: 'folder',
              icon: 'Folder',
              color: 'yellow',
              children: {
                'README.txt': { type: 'file', size: '1.2 KB', modified: 'Today', icon: 'FileText', color: 'gray' },
                'brief.txt': { type: 'file', size: '2.5 KB', modified: 'Today', icon: 'FileText', color: 'gray' }
              }
            },
            'logs': {
              type: 'folder',
              icon: 'Folder',
              color: 'cyan',
              children: {
                'auth.log': { type: 'file', size: '12 KB', modified: 'Today', icon: 'FileText', color: 'cyan', isLog: true },
                'access.log': { type: 'file', size: '45 KB', modified: 'Today', icon: 'FileText', color: 'cyan', isLog: true },
                'error.log': { type: 'file', size: '3 KB', modified: 'Today', icon: 'FileText', color: 'cyan', isLog: true }
              }
            },
            'employees': {
              type: 'folder',
              icon: 'Folder',
              color: 'green',
              children: {
                'employees.csv': { type: 'file', size: '8 KB', modified: 'Today', icon: 'Table', color: 'green' },
                'shifts.csv': { type: 'file', size: '4 KB', modified: 'Today', icon: 'Table', color: 'green' }
              }
            },
            'system_info': {
              type: 'folder',
              icon: 'Folder',
              color: 'purple',
              children: {
                'permissions.txt': { type: 'file', size: '2 KB', modified: 'Today', icon: 'FileText', color: 'purple' },
                'config.txt': { type: 'file', size: '5 KB', modified: 'Today', icon: 'FileText', color: 'purple' }
              }
            }
          }
        }
      }
    }
  },

  '102': {
    'Evidence (D:)': {
      type: 'drive',
      icon: 'HardDrive',
      color: 'blue',
      children: {
        'Case #102': {
          type: 'folder',
          icon: 'Folder',
          color: 'cyan',
          children: {
            'email_logs': {
              type: 'folder',
              icon: 'Folder',
              color: 'blue',
              children: {
                'smtp.log': { type: 'file', size: '24 KB', modified: 'Today', icon: 'FileText', color: 'blue', isLog: true },
                'spam_filter.log': { type: 'file', size: '8 KB', modified: 'Today', icon: 'FileText', color: 'blue', isLog: true },
                'webmail_access.log': { type: 'file', size: '15 KB', modified: 'Today', icon: 'FileText', color: 'blue', isLog: true }
              }
            },
            'employee_data': {
              type: 'folder',
              icon: 'Folder',
              color: 'green',
              children: {
                'employees.csv': { type: 'file', size: '12 KB', modified: 'Today', icon: 'Table', color: 'green' },
                'login_history.csv': { type: 'file', size: '45 KB', modified: 'Today', icon: 'Table', color: 'green' },
                'training_records.csv': { type: 'file', size: '6 KB', modified: 'Today', icon: 'Table', color: 'green' }
              }
            },
            'network_logs': {
              type: 'folder',
              icon: 'Folder',
              color: 'purple',
              children: {
                'dns_queries.log': { type: 'file', size: '18 KB', modified: 'Today', icon: 'FileText', color: 'purple', isLog: true },
                'proxy.log': { type: 'file', size: '32 KB', modified: 'Today', icon: 'FileText', color: 'purple', isLog: true },
                'firewall.log': { type: 'file', size: '28 KB', modified: 'Today', icon: 'FileText', color: 'purple', isLog: true }
              }
            },
            'suspicious_files': {
              type: 'folder',
              icon: 'Folder',
              color: 'red',
              children: {
                'phishing_page.html': { type: 'file', size: '4 KB', modified: 'Today', icon: 'FileCode', color: 'orange' },
                // ✅ ADDED: credentials.txt (if not already present)
                'credentials.txt': { type: 'file', size: '2 KB', modified: 'Today', icon: 'FileText', color: 'red' },
                'hashes.txt': { type: 'file', size: '1 KB', modified: 'Today', icon: 'FileText', color: 'gray' }
              }
            },
            'README.txt': { type: 'file', size: '3 KB', modified: 'Today', icon: 'FileText', color: 'gray' }
          }
        }
      }
    }
  }
};

export const getFileSystemForCase = (caseId = '101') => {
  return fileSystems[caseId] || fileSystems['101'];
};