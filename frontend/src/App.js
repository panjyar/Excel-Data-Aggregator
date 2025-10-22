import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import FileUpload from './components/FileUpload';
import FilterPanel from './components/FilterPanel';
import DataTable from './components/DataTable';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

function App() {
  const [data, setData] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    branches: [],
    suppliers: [],
    fabrics: [],
    concepts: []
  });
  const [filters, setFilters] = useState({
    categories: [],
    branches: [],
    suppliers: [],
    fabrics: [],
    concepts: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchFilterOptions = async () => {
    try {
      setInitialLoad(true);
      const response = await axios.get(`${API_BASE_URL}/data/filter-options`);
      const options = response.data.filterOptions;
      setFilterOptions(options);
      
      setFilters({
        categories: options.categories || [],
        branches: options.branches || [],
        suppliers: options.suppliers || [],
        fabrics: options.fabrics || [],
        concepts: options.concepts || []
      });
    } catch (error) {
      console.error('Error fetching filter options:', error);
      setError('Failed to fetch filter options');
    } finally {
      setInitialLoad(false);
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      
      if (filters.categories.length > 0 && filters.categories.length < filterOptions.categories.length) {
        params.append('categories', filters.categories.join(','));
      }
      if (filters.branches.length > 0 && filters.branches.length < filterOptions.branches.length) {
        params.append('branches', filters.branches.join(','));
      }
      if (filters.suppliers.length > 0 && filters.suppliers.length < filterOptions.suppliers.length) {
        params.append('suppliers', filters.suppliers.join(','));
      }
      if (filters.fabrics.length > 0 && filters.fabrics.length < filterOptions.fabrics.length) {
        params.append('fabrics', filters.fabrics.join(','));
      }
      if (filters.concepts.length > 0 && filters.concepts.length < filterOptions.concepts.length) {
        params.append('concepts', filters.concepts.join(','));
      }

      console.log('Fetching data with filters:', filters);
      console.log('Filter options available:', filterOptions);
      console.log('API URL:', `${API_BASE_URL}/data/aggregated?${params}`);
      
      const response = await axios.get(`${API_BASE_URL}/data/aggregated?${params}`);
      console.log('API Response:', response.data);
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [filters, filterOptions]);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    if (filterOptions.categories.length > 0) {
      fetchData();
    }
  }, [filters, filterOptions, fetchData]);

  const handleFileUpload = async (file) => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      await fetchFilterOptions();
      await fetchData();
      
      alert(`File uploaded successfully! ${response.data.recordsCount} records imported.`);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters) => {
    console.log('App: Filters changed to:', newFilters);
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      categories: filterOptions.categories || [],
      branches: filterOptions.branches || [],
      suppliers: filterOptions.suppliers || [],
      fabrics: filterOptions.fabrics || [],
      concepts: filterOptions.concepts || []
    });
  };

  const handleApplyFilters = () => {
    console.log('App: Apply filters clicked, current filters:', filters);
    fetchData();
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Excel Data Aggregator</h1>
        <p>Import Excel files and analyze data with advanced filtering</p>
      </header>

      <main className="app-main">
        <div className="upload-section">
          <FileUpload onFileUpload={handleFileUpload} loading={loading} />
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {initialLoad ? (
          <div className="loading-message">
            <div className="spinner"></div>
            <p>Loading data...</p>
          </div>
        ) : filterOptions.categories.length > 0 ? (
          <>
            <div className="filter-section">
              <FilterPanel
                filterOptions={filterOptions}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
              />
            </div>

            <div className="data-section">
              <DataTable 
                data={data} 
                loading={loading} 
                hasFilters={Object.values(filters).some(filterArray => filterArray.length > 0)}
              />
            </div>
          </>
        ) : (
          <div className="no-data-message">
            <h3>No Data Available</h3>
            <p>Please upload an Excel file to get started, or check if the backend server is running.</p>
            <div className="help-text">
              <p><strong>To upload data:</strong></p>
              <ol>
                <li>Make sure the backend server is running on port 5000</li>
                <li>Use the upload section above to import your Excel file</li>
                <li>Or run the direct import script: <code>node backend/direct-import.js</code></li>
              </ol>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;