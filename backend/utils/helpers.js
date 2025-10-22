// Helper functions for data processing

/**
 * Clean and validate string data
 * @param {any} value - The value to clean
 * @returns {string} - Cleaned string value
 */
const cleanString = (value) => {
  if (value === null || value === undefined || value === '') return '';
  const cleaned = value.toString().trim();
  return cleaned === 'undefined' || cleaned === 'null' ? '' : cleaned;
};

/**
 * Clean problematic fabric values
 * @param {string} fabric - Fabric value to clean
 * @returns {string} - Cleaned fabric value
 */
const cleanFabric = (fabric) => {
  const cleaned = cleanString(fabric);
  if (cleaned === '[None]' || cleaned === 'None') return '';
  return cleaned;
};

/**
 * Clean problematic concept values
 * @param {string} concept - Concept value to clean
 * @returns {string} - Cleaned concept value
 */
const cleanConcept = (concept) => {
  const cleaned = cleanString(concept);
  if (cleaned === '[None]' || cleaned === 'None') return '';
  if (['1 PAIR', '1 PC', '1 SET'].includes(cleaned)) return '';
  return cleaned;
};

/**
 * Validate and parse numeric values
 * @param {any} value - The value to parse
 * @param {number} defaultValue - Default value if parsing fails
 * @returns {number} - Parsed numeric value
 */
const parseNumeric = (value, defaultValue = 0) => {
  if (value === null || value === undefined || value === '') return defaultValue;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Check if a row has meaningful data
 * @param {Object} row - Row object to check
 * @returns {boolean} - True if row has meaningful data
 */
const hasValidData = (row) => {
  return !!(row.category || row.branch || row.supplier || row.articleNo);
};

/**
 * Process Excel row data with flexible column matching
 * @param {Object} row - Raw Excel row data
 * @returns {Object} - Processed row data
 */
const processRowData = (row) => {
  
  // Try different possible column names for each field
  const category = cleanString(
    row['CategoryShortName'] || 
    row['Category Filter'] || 
    row['Category'] ||
    row['category']
  );
  
  const branch = cleanString(
    row['Branch'] || 
    row['branch'] ||
    row['BRANCH']
  );
  
  const supplier = cleanString(
    row['Supplier'] || 
    row['supplier'] ||
    row['SUPPLIER']
  );
  
  const articleNo = cleanString(
    row['ArticleNo'] || 
    row['Article No'] ||
    row['articleNo'] ||
    row['ARTICLE_NO']
  );
  
  const fabric = cleanFabric(
    row['Fabric'] || 
    row['fabric'] ||
    row['FABRIC']
  );
  
  const concept = cleanConcept(
    row['Concept'] || 
    row['concept'] ||
    row['CONCEPT']
  );
  
  const netSlsQty = parseNumeric(
    row['NetSlsQty'] || 
    row['Net Sls Qty'] ||
    row['netSlsQty'] ||
    row['NET_SLS_QTY']
  );
  
  const amount = parseNumeric(
    row['Amount'] || 
    row['amount'] ||
    row['AMOUNT']
  );
  
  const cost = parseNumeric(
    row['Cost'] || 
    row['cost'] ||
    row['COST']
  );
  
  return {
    category,
    branch,
    supplier,
    articleNo,
    fabric,
    concept,
    NetSlsQty: netSlsQty,
    Amount: amount,
    Cost: cost,
    originalData: row
  };
};

module.exports = {
  cleanString,
  cleanFabric,
  cleanConcept,
  parseNumeric,
  hasValidData,
  processRowData
};
