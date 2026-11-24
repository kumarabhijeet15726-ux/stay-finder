// ============================================
// models/Favourite.js
// Student's saved/favourite properties
// ============================================

const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate favourites (same student can't save same property twice)
favouriteSchema.index({ student: 1, property: 1 }, { unique: true });

module.exports = mongoose.models.Favourite || mongoose.model('Favourite', favouriteSchema);
