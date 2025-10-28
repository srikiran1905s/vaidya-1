const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Vitals = require('../models/Vitals');
const HealthRecord = require('../models/HealthRecord');

// Get patient profile
router.get('/profile', auth, async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.userId).select('-password');
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get latest vitals
router.get('/vitals/latest', auth, async (req, res) => {
  try {
    const vitals = await Vitals.find({ patientId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(4);
    res.json(vitals);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new vitals
router.post('/vitals', auth, async (req, res) => {
  try {
    const vital = new Vitals({
      patientId: req.user.userId,
      ...req.body
    });
    await vital.save();
    res.status(201).json(vital);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get upcoming appointment
router.get('/appointments/upcoming', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      patientId: req.user.userId,
      date: { $gte: new Date() },
      status: 'scheduled'
    })
    .sort({ date: 1 })
    .populate('doctorId', 'name specialty');
    
    if (!appointment) {
      return res.json(null);
    }

    res.json({
      id: appointment._id,
      doctor: appointment.doctorId?.name || 'Unknown Doctor',
      specialty: appointment.doctorId?.specialty || '',
      date: appointment.date,
      time: appointment.time,
      type: appointment.type,
      meetingLink: appointment.meetingLink
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all appointments
router.get('/appointments', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user.userId })
      .sort({ date: -1 })
      .populate('doctorId', 'name specialty');
    
    const formattedAppointments = appointments.map(apt => ({
      id: apt._id,
      doctorName: apt.doctorId?.name || 'Unknown Doctor',
      specialty: apt.doctorId?.specialty || '',
      date: apt.date,
      time: apt.time,
      status: apt.status,
      type: apt.type
    }));

    res.json(formattedAppointments);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Book new appointment
router.post('/appointments', auth, async (req, res) => {
  try {
    const appointment = new Appointment({
      patientId: req.user.userId,
      ...req.body
    });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get recent health records
router.get('/records/recent', auth, async (req, res) => {
  try {
    const records = await HealthRecord.find({ patientId: req.user.userId })
      .sort({ date: -1 })
      .limit(5);
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all health records
router.get('/records', auth, async (req, res) => {
  try {
    const records = await HealthRecord.find({ patientId: req.user.userId })
      .sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add health record
router.post('/records', auth, async (req, res) => {
  try {
    const record = new HealthRecord({
      patientId: req.user.userId,
      ...req.body
    });
    await record.save();
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get consultation history
router.get('/consultations', auth, async (req, res) => {
  try {
    const consultations = await Appointment.find({
      patientId: req.user.userId,
      status: 'completed'
    })
    .sort({ date: -1 })
    .populate('doctorId', 'name specialty');

    const formattedConsultations = consultations.map(con => ({
      id: con._id,
      doctorName: con.doctorId?.name || 'Unknown Doctor',
      specialty: con.doctorId?.specialty || '',
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

module.exports = router;
