const Data = require('../models/DataModel');
const fs = require('fs');
const path = require('path');
const ExcelProcessor = require('../utils/excelProcessor');

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

    // Use the smart Excel processor
    const processor = new ExcelProcessor();
    const result = processor.processExcelFile(filePath);
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    const processedData = result.data;
    console.log(`✅ Successfully processed ${processedData.length} rows`);
    console.log('📋 Column mappings used:', result.mappings);

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
      originalRowCount: result.totalRows,
      processedRowCount: result.validRows
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
