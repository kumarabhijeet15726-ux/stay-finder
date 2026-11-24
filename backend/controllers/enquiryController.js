// ============================================
// controllers/enquiryController.js
// Student enquiries about properties
// ============================================

const Enquiry = require('../models/Enquiry');
const Property = require('../models/Property');

// ---- SUBMIT ENQUIRY ----
// POST /api/enquiries (student only)
const submitEnquiry = async (req, res) => {
  try {
    const { propertyId, name, email, phone, message } = req.body;

    const property = await Property.findById(propertyId);
    if (!property || property.status !== 'approved') {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }

    const enquiry = await Enquiry.create({
      property: propertyId,
      student: req.user._id,
      owner: property.owner,
      name, email, phone, message,
    });

    res.status(201).json({ success: true, message: 'Enquiry sent successfully!', enquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---- GET STUDENT'S OWN ENQUIRIES ----
// GET /api/enquiries/my-enquiries (student)
const getMyEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({ student: req.user._id })
      .populate('property', 'name city locality monthlyRent images')
      .sort({ createdAt: -1 });

    res.json({ success: true, enquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---- GET ENQUIRIES FOR OWNER'S PROPERTIES ----
// GET /api/enquiries/owner-enquiries (owner)
const getOwnerEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({ owner: req.user._id })
      .populate('property', 'name city')
      .populate('student', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, enquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---- UPDATE ENQUIRY STATUS (owner accepts or rejects) ----
// PATCH /api/enquiries/:id/status (owner only)
const updateEnquiryStatus = async (req, res) => {
  try {
    const { status, ownerReply } = req.body;
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be 'accepted' or 'rejected'." });
    }

    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }

    // Verify the logged-in owner is the recipient of this enquiry
    if (enquiry.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied. You can only respond to your own enquiries.' });
    }

    enquiry.status = status;
    if (ownerReply) enquiry.ownerReply = ownerReply;
    await enquiry.save();

    res.json({
      success: true,
      message: `Enquiry ${status} successfully!`,
      enquiry,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---- GET ALL ENQUIRIES (admin) ----
// GET /api/enquiries (admin)
const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .populate('property', 'name city')
      .populate('student', 'name email')
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, enquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { submitEnquiry, getMyEnquiries, getOwnerEnquiries, updateEnquiryStatus, getAllEnquiries };
