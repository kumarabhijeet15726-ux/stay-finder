// ============================================
// controllers/propertyController.js
// CRUD operations for properties
// ============================================

const Property = require('../models/Property');
const path = require('path');

// ---- CREATE PROPERTY ----
// POST /api/properties (owner only)
const createProperty = async (req, res) => {
  try {
    const {
      name, type, description, city, locality, address,
      nearbyCollege, monthlyRent, securityDeposit, sharingType,
      genderPreference, hasAC, hasFood, amenities, houseRules, contactNumber
    } = req.body;

    // Collect uploaded image paths (either disk filename or buffer dataURI)
    const images = req.files ? req.files.map(file => {
      if (file.filename) {
        return `/uploads/${file.filename}`;
      } else if (file.buffer) {
        return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      }
      return null;
    }).filter(Boolean) : [];

    // Parse amenities if it comes as a JSON string
    let parsedAmenities = [];
    if (amenities) {
      parsedAmenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
    }

    const property = await Property.create({
      name, type, description, city, locality, address,
      nearbyCollege, monthlyRent, securityDeposit, sharingType,
      genderPreference,
      hasAC: hasAC === 'true' || hasAC === true,
      hasFood: hasFood === 'true' || hasFood === true,
      amenities: parsedAmenities,
      houseRules, contactNumber,
      images,
      owner: req.user._id,
      status: 'pending', // Always starts as pending
    });

    res.status(201).json({
      success: true,
      message: 'Property submitted! It will be visible after admin approval.',
      property,
    });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---- GET ALL APPROVED PROPERTIES (for students) ----
// GET /api/properties
const getProperties = async (req, res) => {
  try {
    const {
      city, locality, genderPreference, sharingType,
      hasAC, hasFood, minRent, maxRent, sortBy, search
    } = req.query;

    // Build the filter object dynamically
    const filter = { status: 'approved', isAvailable: true };

    if (city) filter.city = { $regex: city, $options: 'i' }; // case-insensitive search
    if (locality) filter.locality = { $regex: locality, $options: 'i' };
    if (genderPreference) filter.genderPreference = genderPreference;
    if (sharingType) filter.sharingType = sharingType;
    if (hasAC !== undefined) filter.hasAC = hasAC === 'true';
    if (hasFood !== undefined) filter.hasFood = hasFood === 'true';
    if (minRent || maxRent) {
      filter.monthlyRent = {};
      if (minRent) filter.monthlyRent.$gte = Number(minRent);
      if (maxRent) filter.monthlyRent.$lte = Number(maxRent);
    }

    // Text search across name, city, locality
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { locality: { $regex: search, $options: 'i' } },
        { nearbyCollege: { $regex: search, $options: 'i' } },
      ];
    }

    // Sorting
    let sort = { createdAt: -1 }; // Default: newest first
    if (sortBy === 'price_asc') sort = { monthlyRent: 1 };
    if (sortBy === 'price_desc') sort = { monthlyRent: -1 };

    const properties = await Property.find(filter)
      .sort(sort)
      .populate('owner', 'name email phone'); // Include owner basic info

    res.json({ success: true, count: properties.length, properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---- GET SINGLE PROPERTY ----
// GET /api/properties/:id
const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'name email phone');

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }

    res.json({ success: true, property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---- UPDATE PROPERTY ----
// PUT /api/properties/:id (owner only - must own the property)
const updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }

    // Check if the logged-in owner actually owns this property
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only edit your own properties.' });
    }

    const updateData = { ...req.body };

    // Handle new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      updateData.images = [...(property.images || []), ...newImages];
    }

    // After editing, reset to pending for re-approval
    updateData.status = 'pending';

    property = await Property.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, message: 'Property updated. Awaiting re-approval.', property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---- DELETE PROPERTY ----
// DELETE /api/properties/:id (owner or admin)
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }

    // Owner can only delete their own; admin can delete any
    if (req.user.role !== 'admin' && property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only delete your own properties.' });
    }

    await property.deleteOne();
    res.json({ success: true, message: 'Property deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---- GET OWNER'S OWN PROPERTIES ----
// GET /api/properties/my-listings (owner only)
const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: properties.length, properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---- TOGGLE AVAILABILITY ----
// PATCH /api/properties/:id/availability (owner only)
const toggleAvailability = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }

    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    property.isAvailable = !property.isAvailable;
    await property.save();

    res.json({
      success: true,
      message: `Property marked as ${property.isAvailable ? 'available' : 'unavailable'}.`,
      isAvailable: property.isAvailable,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createProperty, getProperties, getProperty,
  updateProperty, deleteProperty, getMyProperties, toggleAvailability
};
