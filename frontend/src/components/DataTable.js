import React from 'react';
import './DataTable.css';

const DataTable = ({ data, loading, hasFilters = false }) => {
  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const formatQuantity = (qty) => {
    if (qty === null || qty === undefined) return '0';
    return new Intl.NumberFormat('en-US').format(qty);
  };

  const isAccessoryCategory = (category) => {
    // Categories that typically don't have fabric/concept (accessories, jewelry, etc.)
    const accessoryCategories = ['HDB', 'PTL', 'SET', 'EAR', 'BRC', 'BAN', 'PRF', 'RNG', 'NEC', 'TIK', 'NSP'];
    return accessoryCategories.includes(category);
  };

  const getFabricDisplay = (fabric, category) => {
    if (fabric && fabric.trim() !== '') return fabric;
    return 'None';
  };

  const getConceptDisplay = (concept, category) => {
    if (concept && concept.trim() !== '') return concept;
    return 'None';
  };

  if (loading) {
    return (
      <div className="data-table-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="data-table-container">
        <div className="no-data">
          {hasFilters ? (
            <p>No data found matching your current filters. Try adjusting your filter criteria.</p>
          ) : (
            <p>No data available. Please upload an Excel file to get started.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="data-table-container">
      <div className="table-header">
        <h2>Aggregated Data</h2>
        <div className="data-count">
          {data.length} record(s) found
        </div>
      </div>
      
      <div className="table-note">
        <small>
          <strong>Note:</strong> "None" values in Fabric and Concept columns indicate items where these fields are not applicable (accessories, jewelry, perfumes, etc.).
        </small>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Branch</th>
              <th>Supplier</th>
              <th>Article No</th>
              <th>Fabric</th>
              <th>Concept</th>
              <th className="number-column">Net Sales Qty</th>
              <th className="number-column">Amount</th>
              <th className="number-column">Cost</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.category || '-'}</td>
                <td>{row.branch || '-'}</td>
                <td>{row.supplier || '-'}</td>
                <td>{row.articleNo || '-'}</td>
                <td className={(!row.fabric || row.fabric.trim() === '') ? 'accessory-value' : ''}>
                  {getFabricDisplay(row.fabric, row.category)}
                </td>
                <td className={(!row.concept || row.concept.trim() === '') ? 'accessory-value' : ''}>
                  {getConceptDisplay(row.concept, row.category)}
                </td>
                <td className="number-column">{formatQuantity(row.NetSlsQty)}</td>
                <td className="number-column">${formatNumber(row.Amount)}</td>
                <td className="number-column">${formatNumber(row.Cost)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-summary">
        <div className="summary-row">
          <span className="summary-label">Total Records:</span>
          <span className="summary-value">{data.length}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Total Quantity:</span>
          <span className="summary-value">
            {formatQuantity(data.reduce((sum, row) => sum + (row.NetSlsQty || 0), 0))}
          </span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Total Amount:</span>
          <span className="summary-value">
            ${formatNumber(data.reduce((sum, row) => sum + (row.Amount || 0), 0))}
          </span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Total Cost:</span>
          <span className="summary-value">
            ${formatNumber(data.reduce((sum, row) => sum + (row.Cost || 0), 0))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
