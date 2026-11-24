// ============================================
// routes/authRoutes.js
// Authentication endpoints
// ============================================

const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes (no authentication needed)
router.post('/register', register);
router.post('/login', login);

// Protected routes (need valid JWT token)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
