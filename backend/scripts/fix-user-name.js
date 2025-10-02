/**
 * Fix user firstName/lastName from name field
 * Ensures VIMLESH SHARMA is split into firstName and lastName
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../src/models/User');

async function fixUserNames() {
  try {
    console.log('🔧 Starting user name fix...\n');

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find phone number user
    const phone = '8969445367';
    const user = await User.findOne({ phone: phone });

    if (!user) {
      console.log(`❌ User with phone ${phone} not found`);
      await mongoose.disconnect();
      return;
    }

    console.log('👤 CURRENT USER DATA:');
    console.log(`   _id: ${user._id}`);
    console.log(`   name: ${user.name}`);
    console.log(`   firstName: ${user.firstName}`);
    console.log(`   lastName: ${user.lastName}`);
    console.log(`   phone: ${user.phone}`);
    console.log(`   email: ${user.email}\n`);

    // If firstName is missing but name exists, split it
    if (!user.firstName && user.name) {
      const nameParts = user.name.trim().split(/\s+/);
      user.firstName = nameParts[0];
      user.lastName = nameParts.slice(1).join(' ') || '';

      await user.save();

      console.log('✅ UPDATED USER DATA:');
      console.log(`   firstName: ${user.firstName}`);
      console.log(`   lastName: ${user.lastName}\n`);
    } else if (user.firstName) {
      console.log('✅ User already has firstName/lastName set\n');
    } else {
      console.log('⚠️  User has no name field to split\n');
    }

    await mongoose.disconnect();
    console.log('✅ Done!');
  } catch (error) {
    console.error('❌ Fix failed:', error);
    process.exit(1);
  }
}

// Run fix
fixUserNames();
