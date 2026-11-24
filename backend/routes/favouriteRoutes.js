// ============================================
// routes/favouriteRoutes.js
// Favourite/saved property endpoints
// ============================================

const express = require('express');
const router = express.Router();
const { addFavourite, removeFavourite, getMyFavourites } = require('../controllers/favouriteController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('student'), getMyFavourites);
router.post('/', protect, authorize('student'), addFavourite);
router.delete('/:propertyId', protect, authorize('student'), removeFavourite);

module.exports = router;
