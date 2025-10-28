const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');
const Vitals = require('./models/Vitals');
const HealthRecord = require('./models/HealthRecord');
const Prescription = require('./models/Prescription');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected!');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Seed data
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Patient.deleteMany({});
    await Doctor.deleteMany({});
    await Appointment.deleteMany({});
    await Vitals.deleteMany({});
    await HealthRecord.deleteMany({});
    await Prescription.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Create Patients
    console.log('👥 Creating patients...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const patients = await Patient.create([
      {
        name: 'John Smith',
        email: 'john@example.com',
        password: hashedPassword,
        age: 45,
        phone: '+1-555-0101',
        address: '123 Main St, New York, NY 10001',
        bloodGroup: 'O+',
        emergencyContact: {
          name: 'Jane Smith',
          phone: '+1-555-0102',
          relation: 'Spouse'
        },
        medicalHistory: [
          {
            condition: 'Hypertension',
            diagnosedDate: new Date('2020-03-15'),
            status: 'Ongoing'
          }
        ],
        allergies: ['Penicillin'],
        currentMedications: [
          {
            name: 'Lisinopril',
            dosage: '10mg',
            frequency: 'Once daily'
          }
        ]
      },
      {
        name: 'Emma Wilson',
        email: 'emma@example.com',
        password: hashedPassword,
        age: 32,
        phone: '+1-555-0201',
        address: '456 Oak Ave, Los Angeles, CA 90001',
        bloodGroup: 'A+',
        medicalHistory: [
          {
            condition: 'Asthma',
            diagnosedDate: new Date('2015-06-20'),
            status: 'Controlled'
          }
        ],
        allergies: ['Dust', 'Pollen'],
        currentMedications: [
          {
            name: 'Albuterol Inhaler',
            dosage: '90mcg',
            frequency: 'As needed'
          }
        ]
      },
      {
        name: 'Michael Brown',
        email: 'michael@example.com',
        password: hashedPassword,
        age: 58,
        phone: '+1-555-0301',
        address: '789 Pine St, Chicago, IL 60601',
        bloodGroup: 'B+',
        medicalHistory: [
          {
            condition: 'Type 2 Diabetes',
            diagnosedDate: new Date('2018-11-10'),
            status: 'Managed'
          }
        ],
        allergies: [],
        currentMedications: [
          {
            name: 'Metformin',
            dosage: '500mg',
            frequency: 'Twice daily'
          }
        ]
      }
    ]);
    console.log(`✅ Created ${patients.length} patients\n`);

    // Create Doctors
    console.log('👨‍⚕️ Creating doctors...');
    const doctors = await Doctor.create([
      {
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@hospital.com',
        password: hashedPassword,
        specialty: 'Cardiology',
        license: 'MD-12345',
        hospital: 'City General Hospital',
        phone: '+1-555-1001',
        experience: 15,
        qualification: 'MD, FACC',
        consultationFee: 150,
        rating: 4.8,
        totalReviews: 234,
        availability: [
          {
            day: 'Monday',
            slots: [
              { startTime: '09:00', endTime: '12:00', isAvailable: true },
              { startTime: '14:00', endTime: '17:00', isAvailable: true }
            ]
          },
          {
            day: 'Tuesday',
            slots: [
              { startTime: '09:00', endTime: '12:00', isAvailable: true }
            ]
          }
        ]
      },
      {
        name: 'Dr. David Chen',
        email: 'david.chen@hospital.com',
        password: hashedPassword,
        specialty: 'General Physician',
        license: 'MD-23456',
        hospital: 'Metro Health Center',
        phone: '+1-555-1002',
        experience: 10,
        qualification: 'MD, MBBS',
        consultationFee: 100,
        rating: 4.6,
        totalReviews: 156,
        availability: [
          {
            day: 'Monday',
            slots: [
              { startTime: '10:00', endTime: '13:00', isAvailable: true }
            ]
          }
        ]
      },
      {
        name: 'Dr. Priya Patel',
        email: 'priya.patel@hospital.com',
        password: hashedPassword,
        specialty: 'Endocrinology',
        license: 'MD-34567',
        hospital: 'Downtown Medical Center',
        phone: '+1-555-1003',
        experience: 12,
        qualification: 'MD, Endocrinology',
        consultationFee: 175,
        rating: 4.9,
        totalReviews: 189,
        availability: []
      }
    ]);
    console.log(`✅ Created ${doctors.length} doctors\n`);

    // Create Appointments
    console.log('📅 Creating appointments...');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const appointments = await Appointment.create([
      {
        patientId: patients[0]._id,
        doctorId: doctors[0]._id,
        date: today,
        time: '3:00 PM',
        type: 'Video Consultation',
        status: 'scheduled',
        priority: 'normal',
        symptoms: ['Chest pain', 'Shortness of breath'],
        notes: 'Follow-up for hypertension',
        meetingLink: 'https://meet.vaidya.com/room123',
        duration: 30
      },
      {
        patientId: patients[1]._id,
        doctorId: doctors[1]._id,
        date: tomorrow,
        time: '10:00 AM',
        type: 'Initial',
        status: 'scheduled',
        priority: 'high',
        symptoms: ['Persistent cough', 'Wheezing'],
        notes: 'New patient consultation',
        meetingLink: 'https://meet.vaidya.com/room124',
        duration: 45
      },
      {
        patientId: patients[2]._id,
        doctorId: doctors[2]._id,
        date: nextWeek,
        time: '2:00 PM',
        type: 'Follow-up',
        status: 'scheduled',
        priority: 'normal',
        symptoms: ['Blood sugar monitoring'],
        notes: 'Routine diabetes checkup',
        meetingLink: 'https://meet.vaidya.com/room125',
        duration: 30
      },
      {
        patientId: patients[0]._id,
        doctorId: doctors[0]._id,
        date: new Date('2025-01-15'),
        time: '11:00 AM',
        type: 'Video Consultation',
        status: 'completed',
        priority: 'normal',
        symptoms: ['Regular checkup'],
        notes: 'Annual cardiac evaluation completed',
        duration: 30
      },
      {
        patientId: patients[1]._id,
        doctorId: doctors[1]._id,
        date: new Date('2025-01-10'),
        time: '3:30 PM',
        type: 'Video Consultation',
        status: 'completed',
        priority: 'normal',
        symptoms: ['Asthma symptoms'],
        notes: 'Prescribed inhaler adjustment',
        duration: 30
      }
    ]);
    console.log(`✅ Created ${appointments.length} appointments\n`);

    // Create Vitals
    console.log('💓 Creating vitals records...');
    const vitals = await Vitals.create([
      // Patient 1 vitals
      {
        patientId: patients[0]._id,
        label: 'Heart Rate',
        value: '72 bpm',
        status: 'normal',
        unit: 'bpm',
        recordedBy: 'device'
      },
      {
        patientId: patients[0]._id,
        label: 'Blood Pressure',
        value: '120/80',
        status: 'normal',
        unit: 'mmHg',
        recordedBy: 'device'
      },
      {
        patientId: patients[0]._id,
        label: 'Temperature',
        value: '98.6°F',
        status: 'normal',
        unit: '°F',
        recordedBy: 'patient'
      },
      {
        patientId: patients[0]._id,
        label: 'Oxygen',
        value: '98%',
        status: 'normal',
        unit: '%',
        recordedBy: 'device'
      },
      // Patient 2 vitals
      {
        patientId: patients[1]._id,
        label: 'Heart Rate',
        value: '78 bpm',
        status: 'normal',
        unit: 'bpm',
        recordedBy: 'device'
      },
      {
        patientId: patients[1]._id,
        label: 'Blood Pressure',
        value: '115/75',
        status: 'normal',
        unit: 'mmHg',
        recordedBy: 'device'
      },
      {
        patientId: patients[1]._id,
        label: 'Temperature',
        value: '98.4°F',
        status: 'normal',
        unit: '°F',
        recordedBy: 'patient'
      },
      {
        patientId: patients[1]._id,
        label: 'Oxygen',
        value: '97%',
        status: 'normal',
        unit: '%',
        recordedBy: 'device'
      }
    ]);
    console.log(`✅ Created ${vitals.length} vitals records\n`);

    // Create Health Records
    console.log('📄 Creating health records...');
    const healthRecords = await HealthRecord.create([
      {
        patientId: patients[0]._id,
        doctorId: doctors[0]._id,
        title: 'Cardiac Stress Test Results',
        type: 'Lab Results',
        doctor: 'Dr. Sarah Johnson',
        date: new Date('2025-01-15'),
        description: 'Normal cardiac stress test. No significant abnormalities detected.',
        fileUrl: 'https://storage.vaidya.com/records/cardiac-test-001.pdf'
      },
      {
        patientId: patients[0]._id,
        doctorId: doctors[0]._id,
        title: 'Blood Pressure Medication',
        type: 'Prescription',
        doctor: 'Dr. Sarah Johnson',
        date: new Date('2025-01-10'),
        description: 'Lisinopril 10mg - Once daily for hypertension',
        fileUrl: 'https://storage.vaidya.com/records/prescription-001.pdf'
      },
      {
        patientId: patients[0]._id,
        doctorId: doctors[0]._id,
        title: 'Annual Checkup Notes',
        type: 'Consultation Notes',
        doctor: 'Dr. Sarah Johnson',
        date: new Date('2025-01-05'),
        description: 'Patient shows good progress. Continue current medication.',
        fileUrl: 'https://storage.vaidya.com/records/notes-001.pdf'
      },
      {
        patientId: patients[1]._id,
        doctorId: doctors[1]._id,
        title: 'Pulmonary Function Test',
        type: 'Lab Results',
        doctor: 'Dr. David Chen',
        date: new Date('2025-01-12'),
        description: 'Asthma well controlled. FEV1 within normal range.',
        fileUrl: 'https://storage.vaidya.com/records/pulmonary-test-001.pdf'
      },
      {
        patientId: patients[2]._id,
        doctorId: doctors[2]._id,
        title: 'HbA1c Test Results',
        type: 'Lab Results',
        doctor: 'Dr. Priya Patel',
        date: new Date('2025-01-08'),
        description: 'HbA1c: 6.5% - Diabetes well managed',
        fileUrl: 'https://storage.vaidya.com/records/hba1c-001.pdf'
      }
    ]);
    console.log(`✅ Created ${healthRecords.length} health records\n`);

    // Create Prescriptions
    console.log('💊 Creating prescriptions...');
    const prescriptions = await Prescription.create([
      {
        patientId: patients[0]._id,
        patientName: patients[0].name,
        doctorId: doctors[0]._id,
        appointmentId: appointments[3]._id,
        medications: [
          {
            name: 'Lisinopril',
            dosage: '10mg',
            frequency: 'Once daily',
            duration: '90 days',
            instructions: 'Take in the morning with water'
          },
          {
            name: 'Aspirin',
            dosage: '81mg',
            frequency: 'Once daily',
            duration: '90 days',
            instructions: 'Take with food'
          }
        ],
        diagnosis: 'Hypertension, Cardiovascular risk prevention',
        notes: 'Monitor blood pressure weekly. Follow up in 3 months.',
        date: new Date('2025-01-15'),
        validUntil: new Date('2025-04-15'),
        status: 'active'
      },
      {
        patientId: patients[1]._id,
        patientName: patients[1].name,
        doctorId: doctors[1]._id,
        appointmentId: appointments[4]._id,
        medications: [
          {
            name: 'Albuterol Inhaler',
            dosage: '90mcg',
            frequency: 'As needed',
            duration: '30 days',
            instructions: '2 puffs when experiencing symptoms'
          },
          {
            name: 'Fluticasone Inhaler',
            dosage: '110mcg',
            frequency: 'Twice daily',
            duration: '30 days',
            instructions: 'Use morning and evening'
          }
        ],
        diagnosis: 'Asthma - Moderate persistent',
        notes: 'Use rescue inhaler as needed. Daily controller medication important.',
        date: new Date('2025-01-10'),
        validUntil: new Date('2025-02-10'),
        status: 'active'
      },
      {
        patientId: patients[2]._id,
        patientName: patients[2].name,
        doctorId: doctors[2]._id,
        medications: [
          {
            name: 'Metformin',
            dosage: '500mg',
            frequency: 'Twice daily',
            duration: '90 days',
            instructions: 'Take with breakfast and dinner'
          }
        ],
        diagnosis: 'Type 2 Diabetes Mellitus',
        notes: 'Maintain low carb diet. Regular exercise recommended.',
        date: new Date('2025-01-08'),
        validUntil: new Date('2025-04-08'),
        status: 'active'
      }
    ]);
    console.log(`✅ Created ${prescriptions.length} prescriptions\n`);

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Database Seeding Complete!\n');
    console.log('📊 Summary:');
    console.log(`   👥 Patients: ${patients.length}`);
    console.log(`   👨‍⚕️ Doctors: ${doctors.length}`);
    console.log(`   📅 Appointments: ${appointments.length}`);
    console.log(`   💓 Vitals: ${vitals.length}`);
    console.log(`   📄 Health Records: ${healthRecords.length}`);
    console.log(`   💊 Prescriptions: ${prescriptions.length}`);
    console.log('\n🔐 Test Credentials:');
    console.log('\n   Patients:');
    console.log('   - john@example.com / password123');
    console.log('   - emma@example.com / password123');
    console.log('   - michael@example.com / password123');
    console.log('\n   Doctors:');
    console.log('   - sarah.johnson@hospital.com / password123');
    console.log('   - david.chen@hospital.com / password123');
    console.log('   - priya.patel@hospital.com / password123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Seeding Error:', error);
  } finally {
    mongoose.connection.close();
    console.log('👋 Database connection closed');
  }
};

// Run seeding
connectDB().then(() => seedDatabase());
