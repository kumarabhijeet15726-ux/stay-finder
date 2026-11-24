// ============================================
// controllers/adminController.js
// Admin-only operations
// ============================================

const User = require('../models/User');
const Property = require('../models/Property');
const Enquiry = require('../models/Enquiry');

// ---- DASHBOARD STATS ----
// GET /api/admin/stats
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalStudents, totalOwners, totalProperties,
      pendingProperties, approvedProperties, totalEnquiries
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'owner' }),
      Property.countDocuments(),
      Property.countDocuments({ status: 'pending' }),
      Property.countDocuments({ status: 'approved' }),
      Enquiry.countDocuments(),
    ]);

    res.json({
      success: true,
      stats: {
        totalStudents, totalOwners, totalProperties,
        pendingProperties, approvedProperties, totalEnquiries,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---- GET ALL PROPERTIES (with pending) ----
// GET /api/admin/properties
const getAllProperties = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const properties = await Property.find(filter)
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: properties.length, properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---- APPROVE PROPERTY ----
// PATCH /api/admin/properties/:id/approve
const approveProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );

    if (!property) return res.status(404).json({ success: false, message: 'Property not found.' });

    res.json({ success: true, message: 'Property approved successfully!', property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---- REJECT PROPERTY ----
// PATCH /api/admin/properties/:id/reject
const rejectProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );

    if (!property) return res.status(404).json({ success: false, message: 'Property not found.' });

    res.json({ success: true, message: 'Property rejected.', property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---- GET ALL USERS ----
// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};

    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---- DEACTIVATE / ACTIVATE USER ----
// PATCH /api/admin/users/:id/toggle-status
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.role === 'admin') return res.status(400).json({ success: false, message: 'Cannot deactivate admin.' });

    user.isActive = !user.isActive;
    await user.save();

    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}.`, isActive: user.isActive });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardStats, getAllProperties, approveProperty, rejectProperty, getAllUsers, toggleUserStatus };
