// ============================================
// config/database.js
// Handles MongoDB connection using Mongoose
// ============================================

const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const uri = process.env.MONGODB_URI || 'mongodb+srv://kumarabhijeet15726_db_user:qXNt3iI5lMEnqoSX@stayfinder.bemyvgp.mongodb.net/stayfinder?retryWrites=true&w=majority';
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    // Don't exit process in serverless environment
    if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
