const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  category: {
    type: String,
    required: false,
    default: ''
  },
  branch: {
    type: String,
    required: false,
    default: ''
  },
  supplier: {
    type: String,
    required: false,
    default: ''
  },
  articleNo: {
    type: String,
    required: false,
    default: ''
  },
  fabric: {
    type: String,
    required: false,
    default: ''
  },
  concept: {
    type: String,
    required: false,
    default: ''
  },
  NetSlsQty: {
    type: Number,
    required: true,
    default: 0
  },
  Amount: {
    type: Number,
    required: true,
    default: 0
  },
  Cost: {
    type: Number,
    required: true,
    default: 0
  },
  // Additional fields that might be in the Excel file
  originalData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Index for better query performance
dataSchema.index({ category: 1, branch: 1, supplier: 1, fabric: 1, concept: 1 });

module.exports = mongoose.model('Data', dataSchema);
