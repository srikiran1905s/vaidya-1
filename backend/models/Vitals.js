const mongoose = require('mongoose');

const vitalsSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  label: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['normal', 'warning', 'critical'],
    default: 'normal'
  },
  unit: String,
  recordedBy: {
    type: String,
    enum: ['patient', 'doctor', 'device'],
    default: 'patient'
  },
  deviceId: String
}, {
  timestamps: true
});

// Index for efficient queries
vitalsSchema.index({ patientId: 1, createdAt: -1 });

module.exports = mongoose.model('Vitals', vitalsSchema);
