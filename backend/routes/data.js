const express = require('express');
const dataController = require('../controllers/dataController');
const router = express.Router();

// Data routes
router.get('/aggregated', dataController.getAggregatedData);
router.get('/filter-options', dataController.getFilterOptions);
router.get('/count', dataController.getRecordCount);
router.delete('/clear', dataController.clearAllData);

module.exports = router;