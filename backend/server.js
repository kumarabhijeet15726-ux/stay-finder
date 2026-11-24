// ============================================
// server.js
// Main entry point for the StayFinder backend
// ============================================

// Load environment variables FIRST before anything else
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');

// Initialize Express app
const app = express();

// ---- CONNECT TO DATABASE ----
connectDB();

// ============================================
// MIDDLEWARE
// ============================================

// Allow requests from your frontend (CORS)
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5500', 'http://127.0.0.1:5500'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images as static files
// Example: http://localhost:5000/uploads/image.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ============================================
// API ROUTES
// ============================================

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
app.use('/api/enquiries', require('./routes/enquiryRoutes'));
app.use('/api/favourites', require('./routes/favouriteRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// ---- API HEALTH CHECK ----
app.get('/api', (req, res) => {
  res.json({
    message: '🏠 StayFinder API is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      properties: '/api/properties',
      enquiries: '/api/enquiries',
      favourites: '/api/favourites',
      admin: '/api/admin',
    }
  });
});

// ---- 404 HANDLER ----
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// ---- GLOBAL ERROR HANDLER ----
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error.',
  });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 StayFinder server running on http://localhost:${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});
