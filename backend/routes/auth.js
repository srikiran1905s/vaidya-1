const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// Sign Up
router.post('/signup', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().notEmpty(),
  body('role').isIn(['patient', 'doctor'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, role, age, specialty, license, hospital } = req.body;

    // Check if user exists
    let existingUser;
    if (role === 'patient') {
      existingUser = await Patient.findOne({ email });
    } else {
      existingUser = await Doctor.findOne({ email });
    }

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    let user;
    if (role === 'patient') {
      user = new Patient({
        name,
        email,
        password: hashedPassword,
        age: age || 25,
        dateOfBirth: new Date(2000, 0, 1), // Default date
        gender: 'Prefer not to say',
        phone: '0000000000', // Placeholder phone
        emergencyContact: {
          name: 'Emergency Contact',
          phone: '0000000000',
          relation: 'Family'
        }
      });
    } else {
      user = new Doctor({
        name,
        email,
        password: hashedPassword,
        specialty: specialty || 'General Physician',
        license: license || `LIC${Date.now()}`,
        hospital: hospital || '',
        dateOfBirth: new Date(1980, 0, 1), // Default date
        gender: 'Prefer not to say',
        phone: '0000000000' // Placeholder phone
      });
    }

    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Account created successfully',
      token,
      userId: user._id,
      role,
      name: user.name
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// Sign In
router.post('/signin', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  body('role').isIn(['patient', 'doctor'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, role } = req.body;

    // Find user
    let user;
    if (role === 'patient') {
      user = await Patient.findOne({ email });
    } else {
      user = await Doctor.findOne({ email });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Sign in successful',
      token,
      userId: user._id,
      role,
      name: user.name
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Server error during signin' });
  }
});

module.exports = router;
