import React, { useState, useEffect } from 'react';
import './FilterPanel.css';

const FilterPanel = ({ 
  filterOptions, 
  filters, 
  onFiltersChange, 
  onApplyFilters, 
  onClearFilters 
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  // Sync local filters with parent filters when they change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (filterType, value, checked) => {
    const newFilters = { ...localFilters };
    
    if (checked) {
      newFilters[filterType] = [...newFilters[filterType], value];
    } else {
      newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
    }
    
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    console.log('FilterPanel: Applying filters:', localFilters);
    onFiltersChange(localFilters);
    onApplyFilters();
  };

  const handleClearFilters = () => {
    // Reset to all available options (show all data)
    const clearedFilters = {
      categories: filterOptions.categories || [],
      branches: filterOptions.branches || [],
      suppliers: filterOptions.suppliers || [],
      fabrics: filterOptions.fabrics || [],
      concepts: filterOptions.concepts || []
    };
    setLocalFilters(clearedFilters);
    onClearFilters();
  };

  const handleSelectAll = (filterType) => {
    const newFilters = { ...localFilters };
    newFilters[filterType] = [...filterOptions[filterType]];
    setLocalFilters(newFilters);
  };

  const handleDeselectAll = (filterType) => {
    const newFilters = { ...localFilters };
    newFilters[filterType] = [];
    setLocalFilters(newFilters);
  };

  const renderFilterSection = (title, filterType, options) => {
    const allSelected = localFilters[filterType].length === options.length;
    const noneSelected = localFilters[filterType].length === 0;
    
    return (
      <div className="filter-section">
        <div className="filter-section-header">
          <h3>{title}</h3>
          <div className="filter-section-controls">
            <button 
              type="button"
              className="filter-control-btn"
              onClick={() => handleSelectAll(filterType)}
              disabled={allSelected}
            >
              All
            </button>
            <button 
              type="button"
              className="filter-control-btn"
              onClick={() => handleDeselectAll(filterType)}
              disabled={noneSelected}
            >
              None
            </button>
          </div>
        </div>
        <div className="filter-options">
          {options.map((option) => (
            <label key={option} className="filter-option">
              <input
                type="checkbox"
                checked={localFilters[filterType].includes(option)}
                onChange={(e) => handleFilterChange(filterType, option, e.target.checked)}
              />
              <span className="filter-label">{option}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  const getActiveFiltersCount = () => {
    return Object.values(localFilters).reduce((total, filterArray) => total + filterArray.length, 0);
  };

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h2>Filters</h2>
        <div className="filter-count">
          {getActiveFiltersCount()} filter(s) selected
        </div>
      </div>

      <div className="filter-content">
        {renderFilterSection('Category', 'categories', filterOptions.categories)}
        {renderFilterSection('Branch', 'branches', filterOptions.branches)}
        {renderFilterSection('Supplier', 'suppliers', filterOptions.suppliers)}
        {renderFilterSection('Fabric', 'fabrics', filterOptions.fabrics)}
        {renderFilterSection('Concept', 'concepts', filterOptions.concepts)}
      </div>

      <div className="filter-actions">
        <button 
          className="btn btn-primary" 
          onClick={handleApplyFilters}
          disabled={getActiveFiltersCount() === 0}
        >
          Apply Filters
        </button>
        <button 
          className="btn btn-secondary" 
          onClick={handleClearFilters}
          disabled={getActiveFiltersCount() === 0}
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
