// ============================================
// seed.js
// Creates a default admin account and sample data
// Run this once: node seed.js
// ============================================

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Property = require('./models/Property');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data (optional - comment out if you want to keep data)
    // await User.deleteMany({});
    // await Property.deleteMany({});

    // Create Admin Account
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@stayfinder.com' });
    if (!existingAdmin) {
      await User.create({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@stayfinder.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@123',
        role: 'admin',
        phone: '9999999999',
      });
      console.log('✅ Admin account created:', process.env.ADMIN_EMAIL || 'admin@stayfinder.com');
    } else {
      console.log('ℹ️  Admin account already exists');
    }

    // Create a sample owner
    let owner = await User.findOne({ email: 'owner@example.com' });
    if (!owner) {
      owner = await User.create({
        name: 'Ramesh Kumar',
        email: 'owner@example.com',
        password: 'Owner@123',
        role: 'owner',
        phone: '9876543210',
        city: 'Bangalore',
      });
      console.log('✅ Sample owner created: owner@example.com / Owner@123');
    }

    // Create sample properties
    const propCount = await Property.countDocuments({ owner: owner._id });
    if (propCount === 0) {
      await Property.insertMany([
        {
          name: 'Green Valley PG for Girls',
          type: 'PG',
          description: 'A well-maintained PG with modern amenities located near Bangalore University. 24/7 security, homely food, and a peaceful environment for focused studies.',
          city: 'Bangalore',
          locality: 'Jayanagar',
          address: '45, 8th Cross, Jayanagar 4th Block, Bangalore - 560011',
          nearbyCollege: 'Bangalore University',
          monthlyRent: 7500,
          securityDeposit: 15000,
          sharingType: 'Double',
          genderPreference: 'Girls',
          hasAC: false,
          hasFood: true,
          amenities: ['WiFi', 'Laundry', 'RO Water', 'CCTV', 'Power Backup'],
          houseRules: 'No smoking. Gate closes at 10 PM. Guests allowed till 7 PM.',
          contactNumber: '9876543210',
          images: [],
          status: 'approved',
          owner: owner._id,
        },
        {
          name: 'The Scholar House',
          type: 'PG',
          description: 'Premium PG accommodation for boys near Christ University. Fully furnished rooms with AC, high-speed WiFi, and 3 meals a day.',
          city: 'Bangalore',
          locality: 'Koramangala',
          address: '12, 5th Main, Koramangala 1st Block, Bangalore - 560034',
          nearbyCollege: 'Christ University',
          monthlyRent: 12000,
          securityDeposit: 24000,
          sharingType: 'Single',
          genderPreference: 'Boys',
          hasAC: true,
          hasFood: true,
          amenities: ['WiFi', 'AC', 'Gym', 'Housekeeping', 'Parking', 'Power Backup'],
          houseRules: 'No alcohol. Gate closes at 11 PM.',
          contactNumber: '9876543210',
          images: [],
          status: 'approved',
          owner: owner._id,
        },
        {
          name: 'Sunrise Hostel - Unisex',
          type: 'Hostel',
          description: 'Budget-friendly unisex hostel near Manipal University. Good connectivity, clean rooms, and a friendly environment.',
          city: 'Pune',
          locality: 'Viman Nagar',
          address: '78, Clover Park, Viman Nagar, Pune - 411014',
          nearbyCollege: 'MIT College of Engineering',
          monthlyRent: 5500,
          securityDeposit: 10000,
          sharingType: 'Triple',
          genderPreference: 'Unisex',
          hasAC: false,
          hasFood: false,
          amenities: ['WiFi', 'RO Water', 'Common Kitchen', 'CCTV'],
          houseRules: 'No overnight guests. Quiet hours after 10 PM.',
          contactNumber: '9876543210',
          images: [],
          status: 'approved',
          owner: owner._id,
        },
      ]);
      console.log('✅ Sample properties created (approved)');
    }

    console.log('\n🎉 Seeding complete!\n');
    console.log('📋 Test Accounts:');
    console.log('   Admin:  admin@stayfinder.com / Admin@123');
    console.log('   Owner:  owner@example.com / Owner@123');
    console.log('\nRegister a student account through the website.\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
