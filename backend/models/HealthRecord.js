const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Lab Results', 'Prescription', 'Consultation Notes', 'X-Ray', 'MRI', 'CT Scan', 'Other']
  },
  doctor: {
    type: String,
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: String,
  fileUrl: String,
  fileName: String,
  fileSize: Number,
  attachments: [{
    name: String,
    url: String,
    type: String
  }]
}, {
  timestamps: true
});

// Index for efficient queries
healthRecordSchema.index({ patientId: 1, date: -1 });

module.exports = mongoose.model('HealthRecord', healthRecordSchema);
