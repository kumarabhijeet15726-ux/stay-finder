// ============================================
// routes/adminRoutes.js
// Admin-only endpoints
// ============================================

const express = require('express');
const router = express.Router();
const {
  getDashboardStats, getAllProperties, approveProperty,
  rejectProperty, getAllUsers, toggleUserStatus
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require login + admin role
router.use(protect, authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/properties', getAllProperties);
router.patch('/properties/:id/approve', approveProperty);
router.patch('/properties/:id/reject', rejectProperty);
router.get('/users', getAllUsers);
router.patch('/users/:id/toggle-status', toggleUserStatus);

module.exports = router;
