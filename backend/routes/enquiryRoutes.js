// ============================================
// routes/enquiryRoutes.js
// Enquiry endpoints
// ============================================

const express = require('express');
const router = express.Router();
const { submitEnquiry, getMyEnquiries, getOwnerEnquiries, getAllEnquiries } = require('../controllers/enquiryController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('student'), submitEnquiry);
router.get('/my-enquiries', protect, authorize('student'), getMyEnquiries);
router.get('/owner-enquiries', protect, authorize('owner'), getOwnerEnquiries);
router.get('/', protect, authorize('admin'), getAllEnquiries);

module.exports = router;
