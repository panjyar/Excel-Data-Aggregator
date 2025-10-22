const XLSX = require('xlsx');
const Data = require('../models/DataModel');
const fs = require('fs');
const path = require('path');
const { processRowData, hasValidData } = require('../utils/helpers');

// Process and save Excel data
const processExcelData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const filePath = req.file.path;
    console.log('Processing file:', filePath);

    // Read the Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    console.log(`Found ${jsonData.length} rows in Excel file`);

    // Process and clean the data using helper functions
    const processedData = jsonData
      .map(processRowData)
      .filter(hasValidData);

    console.log(`Processed ${processedData.length} valid rows`);

    // Clear existing data
    await Data.deleteMany({});
    console.log('Cleared existing data');

    // Insert new data in batches
    const batchSize = 1000;
    let insertedCount = 0;

    for (let i = 0; i < processedData.length; i += batchSize) {
      const batch = processedData.slice(i, i + batchSize);
      await Data.insertMany(batch);
      insertedCount += batch.length;
      console.log(`Inserted batch: ${insertedCount}/${processedData.length} records`);
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);
    console.log('Cleaned up uploaded file');

    res.json({
      success: true,
      message: `Successfully imported ${insertedCount} records`,
      recordCount: insertedCount,
      originalRowCount: jsonData.length,
      processedRowCount: processedData.length
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Error processing Excel file',
      error: error.message
    });
  }
};

module.exports = {
  processExcelData
};
