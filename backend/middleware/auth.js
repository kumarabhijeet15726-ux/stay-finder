// ============================================
// middleware/auth.js
// JWT Authentication & Role Authorization
// ============================================

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ---- PROTECT MIDDLEWARE ----
// This runs before any protected route handler.
// It checks if a valid JWT token is present in the request header.
const protect = async (req, res, next) => {
  let token;

  // JWT tokens are sent in the Authorization header as: "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Please log in to continue.',
    });
  }

  try {
    // Verify the token using our secret key
    const secret = process.env.JWT_SECRET || 'stayfinder_super_secret_key_2024_change_this_in_production';
    const decoded = jwt.verify(token, secret);

    // Find the user from the database using the ID stored in the token
    // We fetch fresh data from DB every time (don't trust the token data alone)
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or account has been deactivated.',
      });
    }

    // Attach the user object to the request so route handlers can use it
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token. Please log in again.',
    });
  }
};

// ---- AUTHORIZE MIDDLEWARE ----
// This checks if the logged-in user has the required role.
// IMPORTANT: We check role from the DATABASE, not from the frontend request.
// This is called AFTER protect() so req.user is already set.
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This action requires ${roles.join(' or ')} role.`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
