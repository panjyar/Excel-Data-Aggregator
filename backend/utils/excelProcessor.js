const XLSX = require('xlsx');

/**
 * Smart Excel processor that automatically detects column mappings
 */
class ExcelProcessor {
  constructor() {
    this.columnMappings = {
      category: ['CategoryShortName', 'Category Filter', 'Category', 'category', 'CATEGORY', 'Category Name', 'CATEGORY_NAME'],
      branch: ['Branch', 'branch', 'BRANCH', 'Branch Name', 'Branch Location', 'BRANCH_NAME'],
      supplier: ['Supplier', 'supplier', 'SUPPLIER', 'Supplier Name', 'Supplier Info', 'SUPPLIER_NAME', 'SupplierAlias', 'SupplierName'],
      articleNo: ['ArticleNo', 'Article No', 'articleNo', 'ARTICLE_NO', 'Article Number', 'ARTICLE_NUMBER'],
      fabric: ['Fabric', 'fabric', 'FABRIC', 'Material', 'Material Type', 'MATERIAL_TYPE'],
      concept: ['Concept', 'concept', 'CONCEPT', 'Style', 'Design', 'Design Style', 'DESIGN_STYLE'],
      netSlsQty: ['NetSlsQty', 'Net Sls Qty', 'netSlsQty', 'NET_SLS_QTY', 'Quantity', 'Qty', 'QUANTITY'],
      amount: ['Amount', 'amount', 'AMOUNT', 'Price', 'Total Amount', 'Total Price', 'TOTAL_AMOUNT', 'NetAmount'],
      cost: ['Cost', 'cost', 'COST', 'Unit Cost', 'Cost Price', 'UNIT_COST', 'NetSlsCostValue']
    };
  }

  /**
   * Find the best matching column for a field
   */
  findColumn(fieldName, availableColumns) {
    const possibleNames = this.columnMappings[fieldName] || [];
    
    for (const possibleName of possibleNames) {
      if (availableColumns.includes(possibleName)) {
        return possibleName;
      }
    }
    
    // Try case-insensitive matching
    for (const possibleName of possibleNames) {
      const found = availableColumns.find(col => 
        col.toLowerCase() === possibleName.toLowerCase()
      );
      if (found) {
        return found;
      }
    }
    
    return null;
  }

  /**
   * Process Excel file and return structured data
   */
  processExcelFile(filePath) {
    try {
      console.log('📊 Processing Excel file:', filePath);
      
      // Read Excel file
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      console.log(`📊 Found ${jsonData.length} rows in sheet: ${sheetName}`);
      
      if (jsonData.length === 0) {
        throw new Error('No data found in Excel file');
      }
      
      // Get available columns
      const availableColumns = Object.keys(jsonData[0]);
      console.log('📋 Available columns:', availableColumns);
      
      // Find column mappings
      const mappings = {};
      Object.keys(this.columnMappings).forEach(field => {
        const column = this.findColumn(field, availableColumns);
        if (column) {
          mappings[field] = column;
          console.log(`✅ Mapped ${field} -> ${column}`);
        } else {
          console.log(`❌ No column found for ${field}`);
        }
      });
      
      // Process data
      const processedData = jsonData.map((row, index) => {
        const processed = {};
        
        // Map each field
        Object.keys(mappings).forEach(field => {
          const column = mappings[field];
          const value = row[column];
          
          if (field === 'netSlsQty' || field === 'amount' || field === 'cost') {
            // Numeric fields
            processed[field === 'netSlsQty' ? 'NetSlsQty' : field.charAt(0).toUpperCase() + field.slice(1)] = 
              this.parseNumeric(value);
          } else {
            // String fields
            processed[field === 'articleNo' ? 'articleNo' : field] = this.cleanString(value);
          }
        });
        
        // Add original data for debugging
        processed.originalData = row;
        
        return processed;
      }).filter(row => {
        // Filter out completely empty rows
        return row.category || row.branch || row.supplier || row.articleNo;
      });
      
      console.log(`✅ Processed ${processedData.length} valid rows`);
      
      return {
        success: true,
        data: processedData,
        mappings: mappings,
        totalRows: jsonData.length,
        validRows: processedData.length
      };
      
    } catch (error) {
      console.error('❌ Error processing Excel file:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  /**
   * Clean string values
   */
  cleanString(value) {
    if (value === null || value === undefined || value === '') return '';
    const cleaned = value.toString().trim();
    return cleaned === 'undefined' || cleaned === 'null' ? '' : cleaned;
  }

  /**
   * Parse numeric values
   */
  parseNumeric(value, defaultValue = 0) {
    if (value === null || value === undefined || value === '') return defaultValue;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }
}

module.exports = ExcelProcessor;
