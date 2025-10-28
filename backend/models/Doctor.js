const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  specialty: {
    type: String,
    required: true,
    trim: true
  },
  license: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  hospital: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  experience: {
    type: Number,
    default: 0
  },
  qualification: {
    type: String,
    trim: true
  },
  consultationFee: {
    type: Number,
    default: 0
  },
  availability: [{
    day: String,
    slots: [{
      startTime: String,
      endTime: String,
      isAvailable: Boolean
    }]
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema);
