const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');

// Get doctor profile
router.get('/profile', auth, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.userId).select('-password');
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get doctor statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [todayAppointments, waitingPatients, totalPatients, totalConsultations] = await Promise.all([
      Appointment.countDocuments({
        doctorId: req.user.userId,
        date: { $gte: today, $lt: tomorrow },
        status: 'scheduled'
      }),
      Appointment.countDocuments({
        doctorId: req.user.userId,
        status: 'scheduled'
      }),
      Appointment.distinct('patientId', { doctorId: req.user.userId }),
      Appointment.countDocuments({
        doctorId: req.user.userId,
        status: 'completed'
      })
    ]);

    const stats = [
      {
        label: "Today's Appointments",
        value: todayAppointments.toString(),
        icon: "Calendar",
        color: "text-primary"
      },
      {
        label: "Waiting Patients",
        value: waitingPatients.toString(),
        icon: "Clock",
        color: "text-warning"
      },
      {
        label: "Total Patients",
        value: totalPatients.length.toString(),
        icon: "Users",
        color: "text-secondary"
      },
      {
        label: "Consultations",
        value: totalConsultations.toString(),
        icon: "Video",
        color: "text-success"
      }
    ];

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get upcoming consultations (today's schedule)
router.get('/consultations/upcoming', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const consultations = await Appointment.find({
      doctorId: req.user.userId,
      date: { $gte: today, $lt: tomorrow },
      status: 'scheduled'
    })
    .sort({ time: 1 })
    .populate('patientId', 'name');

    const formattedConsultations = consultations.map(con => ({
      id: con._id,
      patient: con.patientId?.name || 'Unknown Patient',
      patientId: con.patientId?._id,
      time: con.time,
      type: con.type,
      priority: con.priority,
      duration: con.duration
    }));

    res.json(formattedConsultations);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get recent patients
router.get('/patients/recent', auth, async (req, res) => {
  try {
    const recentAppointments = await Appointment.find({
      doctorId: req.user.userId,
      status: 'completed'
    })
    .sort({ date: -1 })
    .limit(5)
    .populate('patientId', 'name age medicalHistory');

    const formattedPatients = recentAppointments.map(apt => ({
      id: apt.patientId?._id,
      name: apt.patientId?.name || 'Unknown Patient',
      lastVisit: apt.date,
      condition: apt.patientId?.medicalHistory?.[0]?.condition || 'N/A',
      age: apt.patientId?.age
    }));

    res.json(formattedPatients);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all schedule
router.get('/schedule', auth, async (req, res) => {
  try {
    const schedule = await Appointment.find({
      doctorId: req.user.userId,
      status: { $ne: 'cancelled' }
    })
    .sort({ date: 1, time: 1 })
    .populate('patientId', 'name');

    const formattedSchedule = schedule.map(apt => ({
      id: apt._id,
      patientName: apt.patientId?.name || 'Unknown Patient',
      patientId: apt.patientId?._id,
      date: apt.date,
      time: apt.time,
      type: apt.type,
      status: apt.status
    }));

    res.json(formattedSchedule);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all patients
router.get('/patients', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.user.userId })
      .distinct('patientId');
    
    const patients = await Patient.find({ _id: { $in: appointments } })
      .select('-password');

    const formattedPatients = patients.map(patient => ({
      id: patient._id,
      name: patient.name,
      age: patient.age,
      condition: patient.medicalHistory?.[0]?.condition || 'N/A',
      phone: patient.phone,
      email: patient.email,
      lastVisit: null // You can calculate this if needed
    }));

    res.json(formattedPatients);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get consultation history
router.get('/consultations', auth, async (req, res) => {
  try {
    const consultations = await Appointment.find({
      doctorId: req.user.userId,
      status: 'completed'
    })
    .sort({ date: -1 })
    .populate('patientId', 'name');

    const formattedConsultations = consultations.map(con => ({
      id: con._id,
      patientName: con.patientId?.name || 'Unknown Patient',
      patientId: con.patientId?._id,
      date: con.date,
      time: con.time,
      status: con.status,
      duration: con.duration,
      notes: con.notes
    }));

    res.json(formattedConsultations);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all prescriptions
router.get('/prescriptions', auth, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ doctorId: req.user.userId })
      .sort({ date: -1 })
      .populate('patientId', 'name');

    const formattedPrescriptions = prescriptions.map(presc => ({
      id: presc._id,
      patientName: presc.patientId?.name || 'Unknown Patient',
      patientId: presc.patientId?._id,
      medication: presc.medications[0]?.name || 'N/A',
      dosage: presc.medications[0]?.dosage || '',
      date: presc.date,
      duration: presc.medications[0]?.duration || ''
    }));

    res.json(formattedPrescriptions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create prescription
router.post('/prescriptions', auth, async (req, res) => {
  try {
    const prescription = new Prescription({
      doctorId: req.user.userId,
      ...req.body
    });
    await prescription.save();
    res.status(201).json(prescription);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get messages (placeholder)
router.get('/messages', auth, async (req, res) => {
  try {
    // This would connect to a messaging system
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
