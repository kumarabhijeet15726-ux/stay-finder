require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('../backend/config/database');

const app = express();

// Connect DB (handles cached connections for serverless)
connectDB();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'backend', 'uploads')));

// Mount API routes
app.use('/api/auth', require('../backend/routes/authRoutes'));
app.use('/api/properties', require('../backend/routes/propertyRoutes'));
app.use('/api/enquiries', require('../backend/routes/enquiryRoutes'));
app.use('/api/favourites', require('../backend/routes/favouriteRoutes'));
app.use('/api/admin', require('../backend/routes/adminRoutes'));

app.get('/api', (req, res) => {
  res.json({
    message: '🏠 StayFinder API is running on Vercel!',
    version: '1.0.0',
    status: 'online'
  });
});

app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error.',
  });
});

module.exports = app;
