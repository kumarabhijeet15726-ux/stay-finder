// ============================================
// models/User.js
// User model for Students, Owners, and Admins
// ============================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: function() {
        return !this.googleId; // Required only if not signing in with Google
      },
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't send password in queries by default
    },
    googleId: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number'],
    },
    // Role determines what the user can do
    // student: can search and enquire
    // owner: can list properties
    // admin: can approve/reject everything
    role: {
      type: String,
      enum: ['student', 'owner', 'admin'],
      default: 'student',
    },
    profileImage: {
      type: String,
      default: null,
    },
    college: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// ---- MIDDLEWARE: Hash password before saving ----
// This runs automatically every time a user is saved
userSchema.pre('save', async function (next) {
  // Only hash if password was actually changed and is present
  if (!this.isModified('password') || !this.password) return next();

  // bcrypt with salt rounds = 10 (higher = more secure but slower)
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ---- METHOD: Compare entered password with stored hash ----
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
