const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');
const Vitals = require('./models/Vitals');
const HealthRecord = require('./models/HealthRecord');
const Prescription = require('./models/Prescription');

async function addSampleData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Patient.deleteMany({});
    await Doctor.deleteMany({});
    await Appointment.deleteMany({});
    await Vitals.deleteMany({});
    await HealthRecord.deleteMany({});
    await Prescription.deleteMany({});

    // Hash password for all users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create Sample Patients
    console.log('👥 Creating sample patients...');
    const patients = await Patient.create([
      {
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        password: hashedPassword,
        dateOfBirth: new Date('1990-05-15'),
        age: 34,
        gender: 'Male',
        phone: '9876543210',
        bloodGroup: 'O+',
        address: {
          street: '123 MG Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          zipCode: '400001'
        },
        emergencyContact: {
          name: 'Priya Kumar',
          phone: '9876543211',
          relation: 'Spouse'
        },
        lifestyle: {
          smokingStatus: 'Never',
          alcoholConsumption: 'Occasionally',
          exerciseFrequency: 'Often',
          dietType: 'Non-Vegetarian'
        }
      },
      {
        name: 'Anita Sharma',
        email: 'anita@example.com',
        password: hashedPassword,
        dateOfBirth: new Date('1985-08-22'),
        age: 39,
        gender: 'Female',
        phone: '9876543220',
        bloodGroup: 'A+',
        address: {
          street: '456 Park Street',
          city: 'Delhi',
          state: 'Delhi',
          country: 'India',
          zipCode: '110001'
        },
        emergencyContact: {
          name: 'Rahul Sharma',
          phone: '9876543221',
          relation: 'Spouse'
        },
        lifestyle: {
          smokingStatus: 'Never',
          alcoholConsumption: 'Never',
          exerciseFrequency: 'Daily',
          dietType: 'Vegetarian'
        }
      },
      {
        name: 'Vikram Singh',
        email: 'vikram@example.com',
        password: hashedPassword,
        dateOfBirth: new Date('1995-12-10'),
        age: 29,
        gender: 'Male',
        phone: '9876543230',
        bloodGroup: 'B+',
        address: {
          street: '789 Brigade Road',
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India',
          zipCode: '560001'
        },
        emergencyContact: {
          name: 'Meera Singh',
          phone: '9876543231',
          relation: 'Mother'
        },
        lifestyle: {
          smokingStatus: 'Former',
          alcoholConsumption: 'Regularly',
          exerciseFrequency: 'Sometimes',
          dietType: 'Non-Vegetarian'
        }
      }
    ]);
    console.log(`✅ Created ${patients.length} patients`);

    // Create Sample Doctors
    console.log('👨‍⚕️ Creating sample doctors...');
    const doctors = await Doctor.create([
      {
        name: 'Dr. Anjali Mehta',
        email: 'anjali.mehta@example.com',
        password: hashedPassword,
        dateOfBirth: new Date('1980-03-15'),
        gender: 'Female',
        phone: '9123456789',
        specialty: 'Cardiologist',
        license: 'MCI123456',
        hospital: 'Apollo Hospital',
        experience: 15,
        consultationFee: 1000,
        qualifications: [
          { degree: 'MBBS', institution: 'AIIMS Delhi', year: 2005 },
          { degree: 'MD Cardiology', institution: 'PGI Chandigarh', year: 2010 }
        ],
        availability: [
          {
            day: 'Monday',
            slots: [
              { startTime: '09:00', endTime: '12:00', isAvailable: true },
              { startTime: '14:00', endTime: '17:00', isAvailable: true }
            ]
          },
          {
            day: 'Wednesday',
            slots: [
              { startTime: '09:00', endTime: '12:00', isAvailable: true }
            ]
          },
          {
            day: 'Friday',
            slots: [
              { startTime: '10:00', endTime: '13:00', isAvailable: true }
            ]
          }
        ]
      },
      {
        name: 'Dr. Rahul Verma',
        email: 'rahul.verma@example.com',
        password: hashedPassword,
        dateOfBirth: new Date('1975-07-20'),
        gender: 'Male',
        phone: '9123456780',
        specialty: 'General Physician',
        license: 'MCI789012',
        hospital: 'Max Hospital',
        experience: 20,
        consultationFee: 800,
        qualifications: [
          { degree: 'MBBS', institution: 'CMC Vellore', year: 1998 },
          { degree: 'MD Medicine', institution: 'JIPMER', year: 2003 }
        ],
        availability: [
          {
            day: 'Tuesday',
            slots: [
              { startTime: '08:00', endTime: '11:00', isAvailable: true },
              { startTime: '15:00', endTime: '18:00', isAvailable: true }
            ]
          },
          {
            day: 'Thursday',
            slots: [
              { startTime: '09:00', endTime: '12:00', isAvailable: true }
            ]
          }
        ]
      },
      {
        name: 'Dr. Sneha Patel',
        email: 'sneha.patel@example.com',
        password: hashedPassword,
        dateOfBirth: new Date('1988-11-05'),
        gender: 'Female',
        phone: '9123456770',
        specialty: 'Dermatologist',
        license: 'MCI345678',
        hospital: 'Fortis Hospital',
        experience: 8,
        consultationFee: 900,
        qualifications: [
          { degree: 'MBBS', institution: 'Grant Medical College', year: 2011 },
          { degree: 'MD Dermatology', institution: 'KEM Hospital', year: 2016 }
        ],
        availability: [
          {
            day: 'Monday',
            slots: [
              { startTime: '10:00', endTime: '13:00', isAvailable: true }
            ]
          },
          {
            day: 'Wednesday',
            slots: [
              { startTime: '14:00', endTime: '17:00', isAvailable: true }
            ]
          },
          {
            day: 'Saturday',
            slots: [
              { startTime: '09:00', endTime: '12:00', isAvailable: true }
            ]
          }
        ]
      }
    ]);
    console.log(`✅ Created ${doctors.length} doctors`);

    // Create Sample Appointments
    console.log('📅 Creating sample appointments...');
    const appointments = await Appointment.create([
      {
        patientId: patients[0]._id,
        doctorId: doctors[0]._id,
        date: new Date('2025-11-05'),
        time: '10:00 AM',
        type: 'Video Consultation',
        status: 'scheduled',
        meetingLink: 'https://meet.vaidya.com/room-12345'
      },
      {
        patientId: patients[1]._id,
        doctorId: doctors[1]._id,
        date: new Date('2025-11-02'),
        time: '03:00 PM',
        type: 'In-Person',
        status: 'completed'
      },
      {
        patientId: patients[2]._id,
        doctorId: doctors[2]._id,
        date: new Date('2025-11-10'),
        time: '11:00 AM',
        type: 'Video Consultation',
        status: 'scheduled',
        meetingLink: 'https://meet.vaidya.com/room-67890'
      }
    ]);
    console.log(`✅ Created ${appointments.length} appointments`);

    // Create Sample Vitals
    console.log('💓 Creating sample vitals...');
    const vitals = await Vitals.create([
      {
        patient: patients[0]._id,
        heartRate: 72,
        bloodPressure: '120/80',
        temperature: 98.6,
        weight: 75,
        height: 175,
        timestamp: new Date()
      },
      {
        patient: patients[1]._id,
        heartRate: 68,
        bloodPressure: '115/75',
        temperature: 98.4,
        weight: 62,
        height: 165,
        timestamp: new Date()
      },
      {
        patient: patients[2]._id,
        heartRate: 78,
        bloodPressure: '125/82',
        temperature: 98.7,
        weight: 80,
        height: 180,
        timestamp: new Date()
      }
    ]);
    console.log(`✅ Created ${vitals.length} vitals records`);

    // Create Sample Health Records
    console.log('📋 Creating sample health records...');
    const healthRecords = await HealthRecord.create([
      {
        patient: patients[0]._id,
        type: 'Lab Report',
        title: 'Blood Test Report',
        description: 'Complete Blood Count (CBC) test results',
        doctor: 'Dr. Anjali Mehta',
        date: new Date('2025-10-15')
      },
      {
        patient: patients[1]._id,
        type: 'Prescription',
        title: 'Medication for Fever',
        description: 'Prescribed medications for viral fever',
        doctor: 'Dr. Rahul Verma',
        date: new Date('2025-10-20')
      },
      {
        patient: patients[2]._id,
        type: 'Medical Report',
        title: 'Annual Health Checkup',
        description: 'Complete health checkup report',
        doctor: 'Dr. Sneha Patel',
        date: new Date('2025-10-25')
      }
    ]);
    console.log(`✅ Created ${healthRecords.length} health records`);

    // Create Sample Prescriptions
    console.log('💊 Creating sample prescriptions...');
    const prescriptions = await Prescription.create([
      {
        patient: patients[0]._id,
        doctor: doctors[0]._id,
        medications: [
          {
            name: 'Aspirin',
            dosage: '75mg',
            frequency: 'Once daily',
            duration: '30 days'
          },
          {
            name: 'Atorvastatin',
            dosage: '10mg',
            frequency: 'Once daily at night',
            duration: '30 days'
          }
        ],
        diagnosis: 'Mild Hypertension',
        notes: 'Take medications after meals. Follow up in 30 days.',
        date: new Date('2025-10-28')
      },
      {
        patient: patients[1]._id,
        doctor: doctors[1]._id,
        medications: [
          {
            name: 'Paracetamol',
            dosage: '500mg',
            frequency: 'Three times daily',
            duration: '5 days'
          },
          {
            name: 'Cetirizine',
            dosage: '10mg',
            frequency: 'Once daily at night',
            duration: '7 days'
          }
        ],
        diagnosis: 'Viral Fever with Allergic Rhinitis',
        notes: 'Rest and drink plenty of fluids. Avoid cold foods.',
        date: new Date('2025-10-20')
      }
    ]);
    console.log(`✅ Created ${prescriptions.length} prescriptions`);

    console.log('\n🎉 Sample data added successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Patients: ${patients.length}`);
    console.log(`   - Doctors: ${doctors.length}`);
    console.log(`   - Appointments: ${appointments.length}`);
    console.log(`   - Vitals: ${vitals.length}`);
    console.log(`   - Health Records: ${healthRecords.length}`);
    console.log(`   - Prescriptions: ${prescriptions.length}`);
    
    console.log('\n🔐 Login Credentials:');
    console.log('\n   Patients:');
    console.log('   - Email: rajesh@example.com | Password: password123');
    console.log('   - Email: anita@example.com | Password: password123');
    console.log('   - Email: vikram@example.com | Password: password123');
    console.log('\n   Doctors:');
    console.log('   - Email: anjali.mehta@example.com | Password: password123');
    console.log('   - Email: rahul.verma@example.com | Password: password123');
    console.log('   - Email: sneha.patel@example.com | Password: password123');

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error adding sample data:', error);
    process.exit(1);
  }
}

addSampleData();
