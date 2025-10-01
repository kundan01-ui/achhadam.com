const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { User } = require('../models');

const auth = async (req, res, next) => {
  try {
    console.log('🔍 AUTH MIDDLEWARE: Starting authentication...');
    console.log('🔍 AUTH MIDDLEWARE: Request URL:', req.url);
    console.log('🔍 AUTH MIDDLEWARE: Request Method:', req.method);

    const authHeader = req.header('Authorization');
    console.log('🔍 AUTH MIDDLEWARE: Authorization header:', authHeader);

    const token = authHeader?.replace('Bearer ', '');
    console.log('🔍 AUTH MIDDLEWARE: Extracted token:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');

    if (!token) {
      console.log('❌ AUTH MIDDLEWARE: No token provided');
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    console.log('🔍 AUTH MIDDLEWARE: Verifying token with current JWT_SECRET...');
    let decoded;
    let needsTokenRefresh = false;

    try {
      // Try with current JWT_SECRET
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      console.log('✅ AUTH MIDDLEWARE: Token verified with current JWT_SECRET');
    } catch (currentSecretError) {
      console.log('⚠️ AUTH MIDDLEWARE: Token verification failed with current secret');
      console.log('⚠️ AUTH MIDDLEWARE: Trying with old JWT_SECRET for migration...');

      try {
        // Try with old JWT_SECRET (migration fallback)
        const oldSecret = 'achhadam_jwt_secret_key_change_in_production_2024';
        decoded = jwt.verify(token, oldSecret);
        console.log('✅ AUTH MIDDLEWARE: Token verified with OLD JWT_SECRET - migration needed');
        needsTokenRefresh = true; // Flag that we need to issue new token
      } catch (oldSecretError) {
        console.log('❌ AUTH MIDDLEWARE: Token verification failed with both old and new secrets');
        throw currentSecretError; // Throw original error
      }
    }

    console.log('🔍 AUTH MIDDLEWARE: Token decoded successfully:', {
      userId: decoded.userId,
      userType: decoded.userType,
      phone: decoded.phone,
      exp: decoded.exp,
      iat: decoded.iat,
      needsTokenRefresh: needsTokenRefresh
    });
    
    console.log('🔍 AUTH MIDDLEWARE: Looking up user in database with ID:', decoded.userId);
    console.log('🔍 AUTH MIDDLEWARE: Searching for user with userId:', decoded.userId);
    
    // Check database connection
    console.log('🔍 AUTH MIDDLEWARE: Database connection state:', mongoose.connection.readyState);
    console.log('🔍 AUTH MIDDLEWARE: Database name:', mongoose.connection.name);
    
    // Try different search methods
    const user = await User.findOne({ userId: decoded.userId });
    console.log('🔍 AUTH MIDDLEWARE: User found in database:', user ? 'YES' : 'NO');
    
    if (!user) {
      // Try searching by _id
      console.log('🔍 AUTH MIDDLEWARE: Trying to find user by _id:', decoded.userId);
      const userById = await User.findById(decoded.userId);
      console.log('🔍 AUTH MIDDLEWARE: User found by _id:', userById ? 'YES' : 'NO');
      
      if (userById) {
        console.log('🔍 AUTH MIDDLEWARE: User found by _id, using that user');
        req.user = {
          userId: userById._id.toString(),
          _id: userById._id.toString(),
          userType: userById.userType,
          email: userById.email,
          phone: userById.phone
        };
        console.log('✅ AUTH MIDDLEWARE: Authentication successful with _id lookup');
        return next();
      }
      
      // Try searching by phone
      console.log('🔍 AUTH MIDDLEWARE: Trying to find user by phone:', decoded.phone);
      const userByPhone = await User.findOne({ phone: decoded.phone });
      console.log('🔍 AUTH MIDDLEWARE: User found by phone:', userByPhone ? 'YES' : 'NO');
      
      if (userByPhone) {
        console.log('🔍 AUTH MIDDLEWARE: User found by phone, using that user');
        req.user = {
          userId: userByPhone._id.toString(),
          _id: userByPhone._id.toString(),
          userType: userByPhone.userType,
          email: userByPhone.email,
          phone: userByPhone.phone
        };
        console.log('✅ AUTH MIDDLEWARE: Authentication successful with phone lookup');
        return next();
      }
    }
    
    if (!user) {
      console.log('❌ AUTH MIDDLEWARE: User not found in database');
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    console.log('🔍 AUTH MIDDLEWARE: User details:', {
      userId: user.userId,
      userType: user.userType,
      email: user.email,
      phone: user.phone
    });

    req.user = {
      userId: user._id.toString(),
      _id: user._id.toString(),
      userType: user.userType,
      email: user.email,
      phone: user.phone
    };

    // If token was verified with old JWT_SECRET, generate new token
    if (needsTokenRefresh) {
      console.log('🔄 AUTH MIDDLEWARE: Generating new token with current JWT_SECRET...');
      const newToken = jwt.sign(
        {
          userId: user._id.toString(),
          userType: user.userType,
          phone: user.phone
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: process.env.JWT_EXPIRY || '365d' }
      );
      console.log('✅ AUTH MIDDLEWARE: New token generated - will be sent in response header');
      res.setHeader('X-New-Token', newToken); // Send new token in response header
    }

    console.log('✅ AUTH MIDDLEWARE: Authentication successful');
    next();
  } catch (error) {
    console.error('❌ AUTH MIDDLEWARE: Authentication error:', error);
    console.error('❌ AUTH MIDDLEWARE: Error details:', {
      name: error.name,
      message: error.message,
      expiredAt: error.expiredAt
    });
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

module.exports = auth;




