const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const doctorSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  
  // Personal Details
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
    required: [true, 'Gender is required']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  alternatePhone: {
    type: String,
    trim: true
  },
  
  // Professional Information
  specialty: {
    type: String,
    required: [true, 'Specialty is required'],
    trim: true,
    enum: [
      'General Physician',
      'Cardiologist',
      'Dermatologist',
      'Pediatrician',
      'Orthopedist',
      'Gynecologist',
      'Psychiatrist',
      'Neurologist',
      'ENT Specialist',
      'Ophthalmologist',
      'Dentist',
      'Endocrinologist',
      'Gastroenterologist',
      'Pulmonologist',
      'Nephrologist',
      'Urologist',
      'Oncologist',
      'Radiologist',
      'Anesthesiologist',
      'Other'
    ]
  },
  subSpecialty: {
    type: String,
    trim: true
  },
  license: {
    type: String,
    required: [true, 'Medical license number is required'],
    unique: true,
    trim: true
  },
  licenseVerified: {
    type: Boolean,
    default: false
  },
  
  // Qualifications
  qualifications: [{
    degree: {
      type: String,
      required: true
    },
    institution: String,
    year: Number,
    country: { type: String, default: 'India' }
  }],
  
  // Experience
  experience: {
    type: Number,
    required: [true, 'Years of experience is required'],
    min: [0, 'Experience cannot be negative'],
    max: [60, 'Please enter valid experience']
  },
  previousWorkExperience: [{
    hospital: String,
    position: String,
    startDate: Date,
    endDate: Date,
    location: String
  }],
  
  // Current Practice
  hospital: {
    type: String,
    trim: true
  },
  clinicName: {
    type: String,
    trim: true
  },
  clinicAddress: {
    street: String,
    city: String,
    state: String,
    country: { type: String, default: 'India' },
    zipCode: String
  },
  
  // Consultation Details
  consultationFee: {
    type: Number,
    required: [true, 'Consultation fee is required'],
    min: [0, 'Fee cannot be negative'],
    default: 500
  },
  followUpFee: {
    type: Number,
    default: 300
  },
  consultationDuration: {
    type: Number, // in minutes
    default: 30
  },
  consultationTypes: [{
    type: String,
    enum: ['Video Call', 'Audio Call', 'Chat', 'In-Person'],
    default: ['Video Call', 'Chat']
  }],
  
  // Availability Schedule
  availability: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true
    },
    slots: [{
      startTime: {
        type: String,
        required: true,
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Please use HH:MM format']
      },
      endTime: {
        type: String,
        required: true,
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Please use HH:MM format']
      },
      isAvailable: {
        type: Boolean,
        default: true
      },
      maxAppointments: {
        type: Number,
        default: 1
      }
    }]
  }],
  
  // Languages Spoken
  languages: [{
    type: String,
    default: ['English', 'Hindi']
  }],
  
  // About & Bio
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot exceed 1000 characters']
  },
  specializations: [String],
  servicesOffered: [String],
  awards: [{
    title: String,
    year: Number,
    organization: String
  }],
  
  // Ratings & Reviews
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  reviews: [{
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Statistics
  totalPatientsTreated: {
    type: Number,
    default: 0
  },
  totalConsultations: {
    type: Number,
    default: 0
  },
  
  // Profile & Settings
  profilePicture: {
    type: String,
    default: 'default-doctor-avatar.png'
  },
  signature: {
    type: String // Digital signature for prescriptions
  },
  isAvailableForEmergency: {
    type: Boolean,
    default: false
  },
  acceptNewPatients: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  
  // Activity Tracking
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  accountLockedUntil: Date,
  
  // Social Links
  socialLinks: {
    linkedin: String,
    twitter: String,
    website: String
  }
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
// Note: email and license already have unique indexes from schema definition
doctorSchema.index({ specialty: 1 });
doctorSchema.index({ rating: -1 });
doctorSchema.index({ consultationFee: 1 });
doctorSchema.index({ createdAt: -1 });
doctorSchema.index({ 'clinicAddress.city': 1 });

// Virtual field for full clinic address
doctorSchema.virtual('fullClinicAddress').get(function() {
  if (!this.clinicAddress) return '';
  const { street, city, state, zipCode, country } = this.clinicAddress;
  return [street, city, state, zipCode, country].filter(Boolean).join(', ');
});

// Virtual field for age
doctorSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Hash password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
doctorSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Method to add a review
doctorSchema.methods.addReview = function(patientId, rating, comment) {
  this.reviews.push({
    patient: patientId,
    rating,
    comment,
    createdAt: new Date()
  });
  
  // Recalculate average rating
  this.totalReviews = this.reviews.length;
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.rating = totalRating / this.totalReviews;
  
  return this.save();
};

// Method to check if doctor is available on a specific day and time
doctorSchema.methods.isAvailableAt = function(day, time) {
  const daySchedule = this.availability.find(avail => avail.day === day);
  if (!daySchedule) return false;
  
  return daySchedule.slots.some(slot => {
    return slot.isAvailable && time >= slot.startTime && time <= slot.endTime;
  });
};

// Method to get doctor profile without sensitive data
doctorSchema.methods.getPublicProfile = function() {
  const doctor = this.toObject();
  delete doctor.password;
  delete doctor.loginAttempts;
  delete doctor.accountLockedUntil;
  delete doctor.signature;
  return doctor;
};

// Static method to find doctors by specialty
doctorSchema.statics.findBySpecialty = function(specialty) {
  return this.find({ 
    specialty, 
    isActive: true, 
    isVerified: true,
    acceptNewPatients: true 
  }).sort({ rating: -1 });
};

// Static method to find top-rated doctors
doctorSchema.statics.findTopRated = function(limit = 10) {
  return this.find({ 
    isActive: true, 
    isVerified: true 
  })
  .sort({ rating: -1, totalReviews: -1 })
  .limit(limit);
};

module.exports = mongoose.model('Doctor', doctorSchema);
