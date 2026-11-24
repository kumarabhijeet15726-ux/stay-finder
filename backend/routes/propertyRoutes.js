// ============================================
// routes/propertyRoutes.js
// Property CRUD endpoints
// ============================================

const express = require('express');
const router = express.Router();
const {
  createProperty, getProperties, getProperty,
  updateProperty, deleteProperty, getMyProperties, toggleAvailability
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public: get all approved properties & single property
router.get('/', getProperties);
router.get('/my-listings', protect, authorize('owner'), getMyProperties);
router.get('/:id', getProperty);

// Owner only: create, update, delete, toggle
router.post('/', protect, authorize('owner'), upload.array('images', 10), createProperty);
router.put('/:id', protect, authorize('owner', 'admin'), upload.array('images', 10), updateProperty);
router.delete('/:id', protect, authorize('owner', 'admin'), deleteProperty);
router.patch('/:id/availability', protect, authorize('owner'), toggleAvailability);

module.exports = router;
