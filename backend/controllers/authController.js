// ============================================
// controllers/authController.js
// Handles registration, login, and profile
// ============================================

const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ---- HELPER: Generate JWT Token ----
const generateToken = (id) => {
  return jwt.sign(
    { id }, // Payload: only store the user's ID in the token
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// ---- REGISTER ----
// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, phone, role, college, city } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
    }

    // Prevent someone from registering as admin through the API
    // Admins are only created manually or through a seeder
    const allowedRoles = ['student', 'owner'];
    const userRole = allowedRoles.includes(role) ? role : 'student';

    // Check if email is already taken
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Create the user (password is hashed automatically by the model's pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: userRole,
      college,
      city,
    });

    // Generate token and respond
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ---- LOGIN ----
// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // Find user and explicitly select the password field (it's excluded by default)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Your account has been deactivated. Contact support.' });
    }

    // Compare entered password with stored hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        college: user.college,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ---- GET PROFILE ----
// GET /api/auth/profile (protected)
const getProfile = async (req, res) => {
  try {
    // req.user is set by the protect middleware
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ---- UPDATE PROFILE ----
// PUT /api/auth/profile (protected)
const updateProfile = async (req, res) => {
  try {
    const { name, phone, college, city } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, college, city },
      { new: true, runValidators: true }
    );

    res.json({ success: true, message: 'Profile updated successfully!', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { register, login, getProfile, updateProfile };
