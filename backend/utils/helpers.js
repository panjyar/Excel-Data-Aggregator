// Helper functions for data processing

/**
 * Clean and validate string data
 * @param {any} value - The value to clean
 * @returns {string} - Cleaned string value
 */
const cleanString = (value) => {
  if (value === null || value === undefined) return '';
  return value.toString().trim();
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
 * Process Excel row data
 * @param {Object} row - Raw Excel row data
 * @returns {Object} - Processed row data
 */
const processRowData = (row) => {
  return {
    category: cleanString(row['CategoryShortName'] || row['Category Filter']),
    branch: cleanString(row['Branch']),
    supplier: cleanString(row['Supplier']),
    articleNo: cleanString(row['ArticleNo']),
    fabric: cleanFabric(row['Fabric']),
    concept: cleanConcept(row['Concept']),
    NetSlsQty: parseNumeric(row['NetSlsQty']),
    Amount: parseNumeric(row['Amount']),
    Cost: parseNumeric(row['Cost']),
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
