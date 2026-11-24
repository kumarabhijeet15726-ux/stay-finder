// ============================================
// models/Property.js
// Property listing model for PGs, Rooms, etc.
// ============================================

const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, 'Property name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    type: {
      type: String,
      required: [true, 'Property type is required'],
      enum: ['PG', 'Hostel', 'Independent Room', 'Flat'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },

    // Location
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    locality: {
      type: String,
      required: [true, 'Locality is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Full address is required'],
    },
    nearbyCollege: {
      type: String,
      trim: true,
    },

    // Pricing
    monthlyRent: {
      type: Number,
      required: [true, 'Monthly rent is required'],
      min: [0, 'Rent cannot be negative'],
    },
    securityDeposit: {
      type: Number,
      required: [true, 'Security deposit is required'],
      min: [0, 'Security deposit cannot be negative'],
    },

    // Room Details
    sharingType: {
      type: String,
      enum: ['Single', 'Double', 'Triple', 'Dormitory'],
      required: true,
    },
    genderPreference: {
      type: String,
      enum: ['Boys', 'Girls', 'Unisex'],
      required: true,
    },
    hasAC: {
      type: Boolean,
      default: false,
    },
    hasFood: {
      type: Boolean,
      default: false,
    },

    // Amenities (array of strings like 'WiFi', 'Laundry', etc.)
    amenities: [
      {
        type: String,
        trim: true,
      },
    ],

    // House Rules
    houseRules: {
      type: String,
      maxlength: [500, 'House rules cannot exceed 500 characters'],
    },

    // Contact
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit number'],
    },

    // Images (array of file paths or URLs)
    images: [
      {
        type: String,
      },
    ],

    // Status - new properties start as PENDING until admin approves
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },

    // The owner who listed this property
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster search queries
propertySchema.index({ city: 1, locality: 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ monthlyRent: 1 });

module.exports = mongoose.models.Property || mongoose.model('Property', propertySchema);
