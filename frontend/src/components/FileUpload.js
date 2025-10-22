import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './FileUpload.css';

const FileUpload = ({ onFileUpload, loading }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  });

  return (
    <div className="file-upload-container">
      <h2>Upload Excel File</h2>
      <div 
        {...getRootProps()} 
        className={`file-upload-dropzone ${isDragActive ? 'active' : ''} ${loading ? 'loading' : ''}`}
      >
        <input {...getInputProps()} />
        {loading ? (
          <div className="upload-loading">
            <div className="spinner"></div>
            <p>Processing file...</p>
          </div>
        ) : (
          <div className="upload-content">
            {isDragActive ? (
              <p>Drop the Excel file here...</p>
            ) : (
              <>
                <div className="upload-icon">📊</div>
                <p>Drag & drop an Excel file here, or click to select</p>
                <p className="upload-hint">Supports .xlsx and .xls files</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
