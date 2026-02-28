import React, { useState, useEffect } from 'react';
import FileIcon from './FileIcon';
import { Zap, CheckCircle, AlertCircle } from 'lucide-react';
// No need to import from contexts here - we receive props

const FileList = ({ 
  contents, 
  currentPath, 
  onItemClick, 
  onItemDoubleClick,
  viewMode, 
  searchQuery,
  selectedFile,
  discoveries = [],
  caseId = '101',
  discoveryDefs = []
}) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [fileDiscoveryMap, setFileDiscoveryMap] = useState({});

  // Build file discovery map when discoveries or case changes
  useEffect(() => {
    const map = {};
    
    // For each discovery definition, check if it's found
    discoveryDefs.forEach(def => {
      if (discoveries.includes(def.id)) {
        if (!map[def.file]) {
          map[def.file] = [];
        }
        map[def.file].push(def);
      }
    });
    
    setFileDiscoveryMap(map);
    
  }, [discoveries, discoveryDefs, caseId]);

  // Filter items based on search query
  const filteredItems = Object.entries(contents).filter(([name]) => 
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format file size
  const formatSize = (size) => {
    if (!size) return '<dir>';
    if (size === '<dir>') return size;
    return size;
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return new Date().toLocaleString();
    return date;
  };

  // Get file type display
  const getFileType = (name, item) => {
    if (item.type === 'folder') return 'File folder';
    if (name.endsWith('.log')) return 'LOG File';
    if (name.endsWith('.csv')) return 'CSV File';
    if (name.endsWith('.txt')) return 'TXT File';
    if (name.endsWith('.html')) return 'HTML File';
    return 'File';
  };

  // Get discovery count for a file
  const getDiscoveryCount = (fileName) => {
    return fileDiscoveryMap[fileName]?.length || 0;
  };

  // Get discovery names for tooltip
  const getDiscoveryNames = (fileName) => {
    const discoveries = fileDiscoveryMap[fileName];
    if (!discoveries || discoveries.length === 0) return '';
    return discoveries.map(d => d.name).join(', ');
  };

  if (viewMode === 'details') {
    return (
      <div className="file-list-container">
        <table className="file-list-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Size</th>
              <th>Modified</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(([name, item]) => {
              const discoveryCount = getDiscoveryCount(name);
              const discoveryNames = getDiscoveryNames(name);
              
              return (
                <tr
                  key={name}
                  className={`file-list-row ${selectedFile === name ? 'selected' : ''}`}
                  onClick={() => onItemClick(name, item)}
                  onDoubleClick={() => onItemDoubleClick(name, item)}
                  onMouseEnter={() => setHoveredItem(name)}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{
                    cursor: 'pointer',
                    background: hoveredItem === name ? 'rgba(59,130,246,0.1)' : 'transparent'
                  }}
                  title={discoveryNames ? `Discoveries: ${discoveryNames}` : ''}
                >
                  <td>
                    <span className="file-icon">
                      <FileIcon
                        type={item.type}
                        name={name}
                        icon={item.icon}
                        color={item.color}
                        size={20}
                      />
                    </span>
                    <span>
                      {name}
                      {item.type === 'file' && name.endsWith('.log') && (
                        <span style={{
                          marginLeft: '0.5rem',
                          fontSize: '0.7rem',
                          color: '#3b82f6',
                          background: 'rgba(59,130,246,0.1)',
                          padding: '0.1rem 0.4rem',
                          borderRadius: '0.25rem'
                        }}>
                          LOG
                        </span>
                      )}
                      {item.type === 'file' && name.endsWith('.html') && (
                        <span style={{
                          marginLeft: '0.5rem',
                          fontSize: '0.7rem',
                          color: '#f97316',
                          background: 'rgba(249,115,22,0.1)',
                          padding: '0.1rem 0.4rem',
                          borderRadius: '0.25rem'
                        }}>
                          HTML
                        </span>
                      )}
                      {/* Discovery Badge */}
                      {discoveryCount > 0 && (
                        <span style={{
                          marginLeft: '0.5rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                          color: '#10b981',
                          background: 'rgba(16,185,129,0.1)',
                          padding: '0.1rem 0.4rem',
                          borderRadius: '1rem',
                          fontSize: '0.7rem',
                          fontWeight: 'bold'
                        }}>
                          <CheckCircle size={12} />
                          {discoveryCount} {discoveryCount === 1 ? 'discovery' : 'discoveries'}
                        </span>
                      )}
                    </span>
                  </td>
                  <td>{formatSize(item.size)}</td>
                  <td>{formatDate(item.modified)}</td>
                  <td>{getFileType(name, item)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredItems.length === 0 && (
          <div className="empty-folder">
            <span className="empty-folder-icon">📂</span>
            <p>This folder is empty</p>
          </div>
        )}
      </div>
    );
  }

  // Icons View
  return (
    <div className="file-list-container">
      <div className="icons-view">
        {filteredItems.map(([name, item]) => {
          const discoveryCount = getDiscoveryCount(name);
          const discoveryNames = getDiscoveryNames(name);
          
          return (
            <div
              key={name}
              className={`icon-item ${selectedFile === name ? 'selected' : ''}`}
              onClick={() => onItemClick(name, item)}
              onDoubleClick={() => onItemDoubleClick(name, item)}
              style={{
                position: 'relative',
                border: item.type === 'file' && name.endsWith('.log') ? '1px solid rgba(59,130,246,0.3)' : 
                        item.type === 'file' && name.endsWith('.html') ? '1px solid rgba(249,115,22,0.3)' : 'none'
              }}
              title={discoveryNames ? `Discoveries: ${discoveryNames}` : ''}
            >
              {/* Discovery Badge */}
              {discoveryCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  background: '#10b981',
                  color: 'white',
                  borderRadius: '1rem',
                  padding: '0.1rem 0.4rem',
                  fontSize: '0.6rem',
                  fontWeight: 'bold',
                  zIndex: 2
                }}>
                  {discoveryCount}
                </span>
              )}
              <span className="file-icon-large">
                <FileIcon
                  type={item.type}
                  name={name}
                  icon={item.icon}
                  color={item.color}
                  size={32}
                />
              </span>
              <span className="file-name">{name}</span>
              {item.type === 'file' && (name.endsWith('.log') || name.endsWith('.html')) && (
                <span style={{
                  fontSize: '0.6rem',
                  color: name.endsWith('.log') ? '#3b82f6' : '#f97316',
                  marginTop: '0.25rem'
                }}>
                  Double-click to open
                </span>
              )}
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="empty-folder">
          <span className="empty-folder-icon">📂</span>
          <p>This folder is empty</p>
        </div>
      )}
    </div>
  );
};

export default FileList;