# Database Schemas Documentation

## Overview
This document describes the MongoDB schemas for the Vaidya Telemedicine Platform.

---

## 📋 Patient Schema

### Basic Information
- **name**: Patient's full name (2-100 characters)
- **email**: Unique email address (validated format)
- **password**: Hashed password (min 6 characters, not returned in queries)
- **dateOfBirth**: Patient's date of birth
- **age**: Patient's age (0-150)
- **gender**: Male, Female, Other, Prefer not to say
- **phone**: 10-digit phone number
- **alternatePhone**: Optional alternate contact

### Address Information
```javascript
address: {
  street: String,
  city: String,
  state: String,
  country: String (default: 'India'),
  zipCode: String
}
```

### Medical Information
- **bloodGroup**: A+, A-, B+, B-, AB+, AB-, O+, O-, Unknown
- **height**: { value: Number, unit: 'cm' | 'ft' }
- **weight**: { value: Number, unit: 'kg' | 'lbs' }

### Emergency Contact
```javascript
emergencyContact: {
  name: String (required),
  phone: String (required),
  relation: String (required),
  email: String
}
```

### Medical History
```javascript
medicalHistory: [{
  condition: String (required),
  diagnosedDate: Date,
  status: 'Active' | 'Resolved' | 'Chronic' | 'Under Treatment',
  notes: String,
  treatedBy: String
}]
```

### Allergies
```javascript
allergies: [{
  allergen: String,
  severity: 'Mild' | 'Moderate' | 'Severe',
  reaction: String
}]
```

### Current Medications
```javascript
currentMedications: [{
  name: String (required),
  dosage: String,
  frequency: String,
  startDate: Date,
  prescribedBy: String,
  purpose: String
}]
```

### Lifestyle Information
```javascript
lifestyle: {
  smokingStatus: 'Never' | 'Former' | 'Current' | 'Unknown',
  alcoholConsumption: 'Never' | 'Occasionally' | 'Regularly' | 'Unknown',
  exerciseFrequency: 'Never' | 'Rarely' | 'Sometimes' | 'Often' | 'Daily',
  dietType: 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Other'
}
```

### Insurance Information
```javascript
insurance: {
  provider: String,
  policyNumber: String,
  expiryDate: Date,
  coverageAmount: Number
}
```

### Profile & Settings
- **profilePicture**: URL/path to profile picture
- **isActive**: Account active status
- **isEmailVerified**: Email verification status
- **isPhoneVerified**: Phone verification status
- **lastLogin**: Last login timestamp
- **loginAttempts**: Failed login attempts counter
- **accountLockedUntil**: Account lock expiry date

### Virtual Fields
- **fullAddress**: Computed full address string
- **calculatedAge**: Auto-calculated age from dateOfBirth

### Methods
- `comparePassword(candidatePassword)`: Compare plain text password with hashed password
- `getPublicProfile()`: Get patient profile without sensitive data

---

## 👨‍⚕️ Doctor Schema

### Basic Information
- **name**: Doctor's full name (2-100 characters)
- **email**: Unique email address (validated format)
- **password**: Hashed password (min 6 characters, not returned in queries)
- **dateOfBirth**: Doctor's date of birth
- **gender**: Male, Female, Other, Prefer not to say
- **phone**: 10-digit phone number
- **alternatePhone**: Optional alternate contact

### Professional Information
- **specialty**: Medical specialty (20+ options including General Physician, Cardiologist, etc.)
- **subSpecialty**: Optional sub-specialty
- **license**: Unique medical license number
- **licenseVerified**: License verification status

### Qualifications
```javascript
qualifications: [{
  degree: String (required),
  institution: String,
  year: Number,
  country: String (default: 'India')
}]
```

### Experience
- **experience**: Years of experience (0-60)
```javascript
previousWorkExperience: [{
  hospital: String,
  position: String,
  startDate: Date,
  endDate: Date,
  location: String
}]
```

### Current Practice
- **hospital**: Current hospital name
- **clinicName**: Clinic name
```javascript
clinicAddress: {
  street: String,
  city: String,
  state: String,
  country: String (default: 'India'),
  zipCode: String
}
```

### Consultation Details
- **consultationFee**: Primary consultation fee (default: 500)
- **followUpFee**: Follow-up consultation fee (default: 300)
- **consultationDuration**: Duration in minutes (default: 30)
- **consultationTypes**: Array of ['Video Call', 'Audio Call', 'Chat', 'In-Person']

### Availability Schedule
```javascript
availability: [{
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday',
  slots: [{
    startTime: String (HH:MM format),
    endTime: String (HH:MM format),
    isAvailable: Boolean,
    maxAppointments: Number (default: 1)
  }]
}]
```

### Languages & About
- **languages**: Array of languages spoken (default: ['English', 'Hindi'])
- **bio**: Doctor's biography (max 1000 characters)
- **specializations**: Array of specialization areas
- **servicesOffered**: Array of services offered
```javascript
awards: [{
  title: String,
  year: Number,
  organization: String
}]
```

### Ratings & Reviews
- **rating**: Average rating (0-5)
- **totalReviews**: Total number of reviews
```javascript
reviews: [{
  patient: ObjectId (ref: 'Patient'),
  rating: Number (1-5),
  comment: String,
  createdAt: Date
}]
```

### Statistics
- **totalPatientsTreated**: Total patients treated
- **totalConsultations**: Total consultations completed

### Profile & Settings
- **profilePicture**: URL/path to profile picture
- **signature**: Digital signature for prescriptions
- **isAvailableForEmergency**: Emergency availability
- **acceptNewPatients**: Accepting new patients
- **isActive**: Account active status
- **isVerified**: Profile verification status
- **isEmailVerified**: Email verification status
- **isPhoneVerified**: Phone verification status
- **lastLogin**: Last login timestamp
- **loginAttempts**: Failed login attempts counter
- **accountLockedUntil**: Account lock expiry date

### Social Links
```javascript
socialLinks: {
  linkedin: String,
  twitter: String,
  website: String
}
```

### Virtual Fields
- **fullClinicAddress**: Computed full clinic address string
- **age**: Auto-calculated age from dateOfBirth

### Instance Methods
- `comparePassword(candidatePassword)`: Compare plain text password with hashed password
- `addReview(patientId, rating, comment)`: Add a review and recalculate average rating
- `isAvailableAt(day, time)`: Check if doctor is available at specific day/time
- `getPublicProfile()`: Get doctor profile without sensitive data

### Static Methods
- `findBySpecialty(specialty)`: Find verified doctors by specialty, sorted by rating
- `findTopRated(limit)`: Find top-rated doctors (default: 10)

---

## 🔐 Security Features

### Password Hashing
Both schemas use bcryptjs to hash passwords before saving:
```javascript
// Automatic hashing on save
patientSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

### Password Comparison
```javascript
// Usage
const isMatch = await patient.comparePassword('plainTextPassword');
```

### Password Exclusion
Passwords are excluded from queries by default using `select: false`

---

## 📊 Indexes for Performance

### Patient Indexes
- `email` (unique)
- `phone`
- `createdAt` (descending)

### Doctor Indexes
- `email` (unique)
- `license` (unique)
- `specialty`
- `rating` (descending)
- `consultationFee`
- `createdAt` (descending)
- `clinicAddress.city`

---

## 📝 Usage Examples

### Create a New Patient
```javascript
const Patient = require('./models/Patient');

const newPatient = new Patient({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'securePassword123',
  dateOfBirth: new Date('1990-01-15'),
  age: 34,
  gender: 'Male',
  phone: '9876543210',
  emergencyContact: {
    name: 'Jane Doe',
    phone: '9876543211',
    relation: 'Spouse'
  },
  bloodGroup: 'O+',
  address: {
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    zipCode: '400001'
  }
});

await newPatient.save();
```

### Create a New Doctor
```javascript
const Doctor = require('./models/Doctor');

const newDoctor = new Doctor({
  name: 'Dr. Sarah Smith',
  email: 'dr.sarah@example.com',
  password: 'doctorPassword123',
  dateOfBirth: new Date('1985-05-20'),
  gender: 'Female',
  phone: '9876543210',
  specialty: 'Cardiologist',
  license: 'MCI123456',
  experience: 10,
  consultationFee: 800,
  qualifications: [{
    degree: 'MBBS',
    institution: 'AIIMS',
    year: 2008
  }],
  availability: [{
    day: 'Monday',
    slots: [{
      startTime: '09:00',
      endTime: '12:00',
      isAvailable: true
    }]
  }]
});

await newDoctor.save();
```

### Find Doctors by Specialty
```javascript
const cardiologists = await Doctor.findBySpecialty('Cardiologist');
```

### Find Top-Rated Doctors
```javascript
const topDoctors = await Doctor.findTopRated(5); // Top 5 doctors
```

### Add a Review to Doctor
```javascript
const doctor = await Doctor.findById(doctorId);
await doctor.addReview(patientId, 5, 'Excellent doctor!');
```

### Check Doctor Availability
```javascript
const isAvailable = doctor.isAvailableAt('Monday', '10:30');
```

### Get Public Profile
```javascript
const publicProfile = doctor.getPublicProfile();
// Password and sensitive fields are excluded
```

---

## 🔄 Timestamps

Both schemas include automatic timestamps:
- `createdAt`: Document creation timestamp
- `updatedAt`: Last update timestamp

---

## ✅ Validation

All fields have proper validation:
- Required fields validation
- String length validation
- Email format validation
- Phone number format validation
- Enum validation for fixed options
- Min/Max validation for numbers
- Date validation

---

## 🚀 Best Practices

1. **Always use methods**: Use schema methods for password comparison
2. **Use virtuals**: Access computed fields like `fullAddress` and `calculatedAge`
3. **Exclude sensitive data**: Use `getPublicProfile()` when sending data to frontend
4. **Use indexes**: Queries on indexed fields are much faster
5. **Validate input**: Schema validation catches most errors
6. **Use static methods**: For common queries like `findBySpecialty()`

---

**Created by**: Cascade AI Assistant  
**Last Updated**: October 28, 2025
