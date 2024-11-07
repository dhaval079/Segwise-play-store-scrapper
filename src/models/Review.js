const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewId: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    enum: ['bugs', 'complaints', 'crashes', 'praises', 'other'],
    required: true
  },
  userName: String,
  androidOsVersion: String,
  appVersionCode: String,
  appVersionName: String,
  deviceMetadata: Object
}, {
  timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);