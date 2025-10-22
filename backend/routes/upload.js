const express = require('express');
const uploadController = require('../controllers/uploadController');
const upload = require('../middleware/upload');
const router = express.Router();

// Upload route
router.post('/', upload.single('file'), uploadController.processExcelData);

module.exports = router;