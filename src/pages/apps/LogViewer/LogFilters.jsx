import React from 'react';
import { Search, Filter, ChevronDown, RefreshCw, X } from 'lucide-react';

const LogFilters = ({ 
  searchQuery, 
  setSearchQuery, 
  filterType, 
  setFilterType, 
  sortOrder, 
  setSortOrder,
  onRefresh,
  onClear,
  caseId
}) => {
  return (
    <div className="log-viewer-toolbar">
      {/* Search */}
      <div className="search-container">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          className="search-input"
          placeholder={caseId === '102' 
            ? "Search (email, domain, user...)" 
            : "Search logs (IP, user, event...)"}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-white">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filter Dropdown */}
      <div className="filter-group">
        <Filter size={16} className="text-gray-400" />
        <select 
          className="filter-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Events</option>
          <option value="suspicious">Suspicious Only</option>
          <option value="error">Errors Only</option>
          <option value="warning">Warnings Only</option>
          <option value="normal">Normal Activity</option>
        </select>
      </div>

      {/* Sort Dropdown */}
      <div className="filter-group">
        <ChevronDown size={16} className="text-gray-400" />
        <select 
          className="filter-select"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Refresh Button */}
      <button className="refresh-btn" onClick={onRefresh} title="Clear selection">
        <RefreshCw size={16} />
      </button>

      {/* Clear Button */}
      <button className="toolbar-btn" onClick={onClear} title="Clear filters">
        <X size={16} />
        <span>Clear</span>
      </button>

      {/* Hint */}
      <div style={{
        marginLeft: 'auto',
        color: caseId === '102' ? '#06b6d4' : '#fbbf24',
        fontSize: '0.8rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        {caseId === '102' ? (
          <span>🔍 Look for emails from company-reset.com at 14:32</span>
        ) : (
          <span>🔍 Look for 3 AM activity from IP 10.12.45.89</span>
        )}
      </div>
    </div>
  );
};

export default LogFilters;