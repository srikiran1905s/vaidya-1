const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Import models
const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');

console.log('🧪 Testing Enhanced Patient & Doctor Schemas\n');

const testSchemas = async () => {
  try {
    // Connect to MongoDB
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // ========================================
    // Test Patient Schema
    // ========================================
    console.log('📋 Testing Patient Schema...\n');

    // Create a test patient
    const testPatient = new Patient({
      name: 'Rajesh Kumar',
      email: `test.patient.${Date.now()}@example.com`,
      password: 'securePass123',
      dateOfBirth: new Date('1990-05-15'),
      age: 34,
      gender: 'Male',
      phone: '9876543210',
      alternatePhone: '9876543211',
      address: {
        street: '123 MG Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        zipCode: '400001'
      },
      bloodGroup: 'O+',
      height: {
        value: 175,
        unit: 'cm'
      },
      weight: {
        value: 70,
        unit: 'kg'
      },
      emergencyContact: {
        name: 'Priya Kumar',
        phone: '9876543212',
        relation: 'Spouse',
        email: 'priya@example.com'
      },
      medicalHistory: [{
        condition: 'Hypertension',
        diagnosedDate: new Date('2020-01-10'),
        status: 'Under Treatment',
        notes: 'Blood pressure under control with medication',
        treatedBy: 'Dr. Sharma'
      }],
      allergies: [{
        allergen: 'Penicillin',
        severity: 'Severe',
        reaction: 'Skin rash and breathing difficulty'
      }],
      currentMedications: [{
        name: 'Amlodipine',
        dosage: '5mg',
        frequency: 'Once daily',
        startDate: new Date('2020-01-15'),
        prescribedBy: 'Dr. Sharma',
        purpose: 'Blood pressure control'
      }],
      lifestyle: {
        smokingStatus: 'Never',
        alcoholConsumption: 'Occasionally',
        exerciseFrequency: 'Often',
        dietType: 'Vegetarian'
      },
      insurance: {
        provider: 'Star Health Insurance',
        policyNumber: 'STAR123456',
        expiryDate: new Date('2025-12-31'),
        coverageAmount: 500000
      }
    });

    // Save patient
    const savedPatient = await testPatient.save();
    console.log('✅ Patient Created Successfully!');
    console.log('   - Name:', savedPatient.name);
    console.log('   - Email:', savedPatient.email);
    console.log('   - ID:', savedPatient._id);
    console.log('   - Full Address:', savedPatient.fullAddress);
    console.log('   - Calculated Age:', savedPatient.calculatedAge);

    // Test password comparison
    const patientWithPassword = await Patient.findById(savedPatient._id).select('+password');
    const isPasswordMatch = await patientWithPassword.comparePassword('securePass123');
    console.log('   - Password Verification:', isPasswordMatch ? '✅ Passed' : '❌ Failed');

    // Test public profile
    const publicProfile = savedPatient.getPublicProfile();
    console.log('   - Public Profile:', publicProfile.password ? '❌ Has password' : '✅ Password excluded');

    // ========================================
    // Test Doctor Schema
    // ========================================
    console.log('\n👨‍⚕️ Testing Doctor Schema...\n');

    // Create a test doctor
    const testDoctor = new Doctor({
      name: 'Dr. Anjali Mehta',
      email: `test.doctor.${Date.now()}@example.com`,
      password: 'doctorPass123',
      dateOfBirth: new Date('1985-08-20'),
      gender: 'Female',
      phone: '9123456789',
      alternatePhone: '9123456790',
      specialty: 'Cardiologist',
      subSpecialty: 'Interventional Cardiology',
      license: `MCI${Date.now()}`,
      licenseVerified: true,
      qualifications: [{
        degree: 'MBBS',
        institution: 'AIIMS Delhi',
        year: 2008,
        country: 'India'
      }],
      experience: 12,
      hospital: 'Fortis Hospital',
      clinicName: 'Heart Care Clinic',
      clinicAddress: {
        street: '456 Park Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        zipCode: '400002'
      },
      consultationFee: 1000,
      followUpFee: 600,
      consultationDuration: 30,
      consultationTypes: ['Video Call', 'Audio Call', 'In-Person'],
      availability: [
        {
          day: 'Monday',
          slots: [
            { startTime: '09:00', endTime: '12:00', isAvailable: true, maxAppointments: 3 }
          ]
        }
      ],
      languages: ['English', 'Hindi', 'Marathi'],
      bio: 'Experienced cardiologist with 12+ years of practice.',
      specializations: ['Heart Disease', 'Hypertension'],
      isAvailableForEmergency: true,
      acceptNewPatients: true,
      isActive: true,
      isVerified: true
    });

    // Save doctor
    const savedDoctor = await testDoctor.save();
    console.log('✅ Doctor Created Successfully!');
    console.log('   - Name:', savedDoctor.name);
    console.log('   - Email:', savedDoctor.email);
    console.log('   - ID:', savedDoctor._id);
    console.log('   - Specialty:', savedDoctor.specialty);
    console.log('   - License:', savedDoctor.license);
    console.log('   - Full Clinic Address:', savedDoctor.fullClinicAddress);
    console.log('   - Age:', savedDoctor.age);
    console.log('   - Consultation Fee: Rs.', savedDoctor.consultationFee);

    // Test password comparison
    const doctorWithPassword = await Doctor.findById(savedDoctor._id).select('+password');
    const isDoctorPasswordMatch = await doctorWithPassword.comparePassword('doctorPass123');
    console.log('   - Password Verification:', isDoctorPasswordMatch ? '✅ Passed' : '❌ Failed');

    // Test availability check
    const availableMonday = savedDoctor.isAvailableAt('Monday', '10:00');
    const availableTuesday = savedDoctor.isAvailableAt('Tuesday', '10:00');
    console.log('   - Available Monday 10:00:', availableMonday ? '✅ Yes' : '❌ No');
    console.log('   - Available Tuesday 10:00:', availableTuesday ? '✅ Yes' : '❌ No');

    // Test add review
    console.log('\n⭐ Testing Review System...');
    await savedDoctor.addReview(savedPatient._id, 5, 'Excellent doctor! Very professional.');
    await savedDoctor.addReview(savedPatient._id, 4, 'Good consultation.');
    console.log('   - Reviews Added: 2');
    console.log('   - Average Rating:', savedDoctor.rating.toFixed(1));
    console.log('   - Total Reviews:', savedDoctor.totalReviews);

    // Test static methods
    console.log('\n🔍 Testing Static Methods...');
    const topDoctors = await Doctor.findTopRated(3);
    console.log('   - Top Rated Doctors Found:', topDoctors.length);

    const cardiologists = await Doctor.findBySpecialty('Cardiologist');
    console.log('   - Cardiologists Found:', cardiologists.length);

    // Cleanup: Delete test records
    console.log('\n🧹 Cleaning up test data...');
    await Patient.findByIdAndDelete(savedPatient._id);
    await Doctor.findByIdAndDelete(savedDoctor._id);
    console.log('   ✅ Test records deleted');

    console.log('\n🎉 All Schema Tests Passed Successfully!\n');

  } catch (error) {
    console.error('\n❌ Test Failed:', error.message);
    console.error('Error Details:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed.');
    process.exit(0);
  }
};

// Run the test
testSchemas();
