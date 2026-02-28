import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Displays query results in a table
 * Includes pagination and error display
 */
const QueryResults = ({ results, error, onOpenInjectionLab }) => {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 5;

  if (error) {
    return (
      <div className="results-container">
        <div className="error-message">
          <AlertCircle size={14} style={{ marginRight: '0.25rem' }} />
          {error}
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="results-container">
        <div className="no-results" style={{ height: '100px' }}>
          <span style={{ fontSize: '2rem' }}>🗄️</span>
          <p>Run a query to see results</p>
        </div>
      </div>
    );
  }

  // Handle sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Sort data
  let sortedData = [...results.data];
  if (sortColumn) {
    const colIndex = results.columns.indexOf(sortColumn);
    sortedData.sort((a, b) => {
      if (a[colIndex] < b[colIndex]) return sortDirection === 'asc' ? -1 : 1;
      if (a[colIndex] > b[colIndex]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Pagination
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const paginatedData = sortedData.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  return (
    <div className="results-container">
      <div className="results-header">
        <div className="results-title">
          QUERY RESULTS - {results.data.length} rows returned
        </div>
        <button className="injection-btn" onClick={onOpenInjectionLab}>
          <span>💉</span>
          SQL INJECTION LAB
        </button>
      </div>

      {/* Results table */}
      <table className="results-table">
        <thead>
          <tr>
            {results.columns.map(col => (
              <th key={col} onClick={() => handleSort(col)}>
                {col} {sortColumn === col && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="page-btn"
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
          >
            ← PREV
          </button>
          <span className="page-info">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button 
            className="page-btn"
            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
          >
            NEXT →
          </button>
        </div>
      )}
    </div>
  );
};

export default QueryResults;