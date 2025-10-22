const Data = require('../models/DataModel');

// Get aggregated data with filters
const getAggregatedData = async (req, res) => {
  try {
    const { 
      category, 
      branch, 
      supplier, 
      fabric, 
      concept,
      categories,
      branches,
      suppliers,
      fabrics,
      concepts
    } = req.query;

    // Build match stage for filtering with OR logic between different filter types
    const orConditions = [];

    // Handle single filter values
    if (category) orConditions.push({ category: category });
    if (branch) orConditions.push({ branch: branch });
    if (supplier) orConditions.push({ supplier: supplier });
    if (fabric) orConditions.push({ fabric: fabric });
    if (concept) orConditions.push({ concept: concept });

    // Handle multiple filter values (arrays)
    if (categories) {
      const categoryArray = Array.isArray(categories) ? categories : categories.split(',');
      orConditions.push({ category: { $in: categoryArray } });
    }
    if (branches) {
      const branchArray = Array.isArray(branches) ? branches : branches.split(',');
      orConditions.push({ branch: { $in: branchArray } });
    }
    if (suppliers) {
      const supplierArray = Array.isArray(suppliers) ? suppliers : suppliers.split(',');
      orConditions.push({ supplier: { $in: supplierArray } });
    }
    if (fabrics) {
      const fabricArray = Array.isArray(fabrics) ? fabrics : fabrics.split(',');
      orConditions.push({ fabric: { $in: fabricArray } });
    }
    if (concepts) {
      const conceptArray = Array.isArray(concepts) ? concepts : concepts.split(',');
      orConditions.push({ concept: { $in: conceptArray } });
    }

    // Build the match stage
    const matchStage = orConditions.length > 0 ? { $or: orConditions } : {};

    // Aggregation pipeline
    const pipeline = [
      // Match stage for filtering
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      
      // Group by the display fields and sum NetSlsQty
      {
        $group: {
          _id: {
            category: '$category',
            branch: '$branch',
            supplier: '$supplier',
            articleNo: '$articleNo',
            fabric: '$fabric',
            concept: '$concept'
          },
          NetSlsQty: { $sum: '$NetSlsQty' },
          Amount: { $sum: '$Amount' },
          Cost: { $sum: '$Cost' }
        }
      },
      // Project to match the desired output format
      {
        $project: {
          _id: 0,
          category: '$_id.category',
          branch: '$_id.branch',
          supplier: '$_id.supplier',
          articleNo: '$_id.articleNo',
          fabric: '$_id.fabric',
          concept: '$_id.concept',
          NetSlsQty: 1,
          Amount: 1,
          Cost: 1
        }
      },
      // Sort by category, then by supplier
      {
        $sort: {
          category: 1,
          supplier: 1,
          articleNo: 1
        }
      }
    ];

    const data = await Data.aggregate(pipeline);
    
    res.json({
      success: true,
      data: data,
      count: data.length,
      filters: req.query
    });
  } catch (error) {
    console.error('Error fetching aggregated data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching data',
      error: error.message
    });
  }
};

// Get unique filter options
const getFilterOptions = async (req, res) => {
  try {
    const categories = await Data.distinct('category');
    const branches = await Data.distinct('branch');
    const suppliers = await Data.distinct('supplier');
    const fabrics = await Data.distinct('fabric');
    const concepts = await Data.distinct('concept');

    // Filter out empty values and sort
    const filterOptions = {
      categories: categories.filter(cat => cat && cat.trim() !== '').sort(),
      branches: branches.filter(branch => branch && branch.trim() !== '').sort(),
      suppliers: suppliers.filter(supplier => supplier && supplier.trim() !== '').sort(),
      fabrics: fabrics.filter(fabric => fabric && fabric.trim() !== '').sort(),
      concepts: concepts.filter(concept => concept && concept.trim() !== '').sort()
    };

    res.json({
      success: true,
      filterOptions: filterOptions
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching filter options',
      error: error.message
    });
  }
};

// Get total record count
const getRecordCount = async (req, res) => {
  try {
    const count = await Data.countDocuments();
    res.json({
      success: true,
      count: count
    });
  } catch (error) {
    console.error('Error fetching record count:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching record count',
      error: error.message
    });
  }
};

// Clear all data
const clearAllData = async (req, res) => {
  try {
    const result = await Data.deleteMany({});
    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} records`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error clearing data:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing data',
      error: error.message
    });
  }
};

module.exports = {
  getAggregatedData,
  getFilterOptions,
  getRecordCount,
  clearAllData
};
