const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: [true, 'Please describe the action'],
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Please add the target ID'],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('AdminLog', adminLogSchema);
