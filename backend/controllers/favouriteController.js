// ============================================
// controllers/favouriteController.js
// Student's saved/favourite properties
// ============================================

const Favourite = require('../models/Favourite');

// ---- ADD TO FAVOURITES ----
// POST /api/favourites (student)
const addFavourite = async (req, res) => {
  try {
    const { propertyId } = req.body;

    // Check for duplicate (unique index handles this, but give a nice message)
    const existing = await Favourite.findOne({ student: req.user._id, property: propertyId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already in favourites.' });
    }

    const fav = await Favourite.create({ student: req.user._id, property: propertyId });
    res.status(201).json({ success: true, message: 'Added to favourites!', fav });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---- REMOVE FROM FAVOURITES ----
// DELETE /api/favourites/:propertyId (student)
const removeFavourite = async (req, res) => {
  try {
    await Favourite.findOneAndDelete({ student: req.user._id, property: req.params.propertyId });
    res.json({ success: true, message: 'Removed from favourites.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---- GET MY FAVOURITES ----
// GET /api/favourites (student)
const getMyFavourites = async (req, res) => {
  try {
    const favourites = await Favourite.find({ student: req.user._id })
      .populate('property', 'name city locality monthlyRent images genderPreference sharingType status isAvailable')
      .sort({ createdAt: -1 });

    res.json({ success: true, favourites });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addFavourite, removeFavourite, getMyFavourites };
